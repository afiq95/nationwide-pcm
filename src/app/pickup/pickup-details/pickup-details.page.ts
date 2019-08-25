import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, AlertController } from "@ionic/angular";
import { Camera } from "@ionic-native/camera/ngx";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import { PCAApiService } from "src/app/services/pcaapi.service";
import { Base64 } from "@ionic-native/base64/ngx";
import { LoadingService } from "src/app/services/loading.service";
import { delay } from "q";

@Component({
  selector: "app-pickup-details",
  templateUrl: "./pickup-details.page.html",
  styleUrls: ["./pickup-details.page.scss"]
})
export class PickupDetailsPage implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public signaturePadOptions: Object = {
    minWidth: 5,
    canvasWidth: 280,
    canvasHeight: 250
  };

  pickup: any = {};
  docCn = 0;
  docPkg = 0;
  parcelCn = 0;
  parcelPkg = 0;
  status = "";
  cameraUrl: any = "";
  rawUrl: any;
  allFailCode = [];
  failCode: any = null;
  reason = "";
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private camera: Camera,
    public alertCtrl: AlertController,
    private storage: LocalStorageService,
    private api: PCAApiService,
    private base64: Base64,
    private loading: LoadingService
  ) {}

  async ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state)
      this.pickup = this.router.getCurrentNavigation().extras.state.pickup;
    this.allFailCode = (await this.storage.getPickupFailCode()).map(x => {
      return {
        name: x.Title,
        code: x.Code,
        isSignature: x.IsSignatureNeeded,
        isAttachment: x.IsAttachmentNeeded
      };
    });
  }

  removeDocCn() {
    if (this.docCn != 0) this.docCn--;
  }

  addDocCn() {
    if (this.docPkg <= this.docCn) this.docPkg = this.docCn + 1;
    this.docCn++;
  }

  removeDocPkg() {
    if (this.docPkg != 0 && this.docPkg != this.docCn) this.docPkg--;
  }

  addDocPkg() {
    if (this.docCn == 0) return;
    this.docPkg++;
  }

  removeParcelCn() {
    if (this.parcelCn != 0) this.parcelCn--;
  }

  addParcelCn() {
    if (this.parcelPkg <= this.parcelCn) this.parcelPkg = this.parcelCn + 1;
    this.parcelCn++;
  }

  removeParcelPkg() {
    if (this.parcelPkg != 0 && this.parcelPkg != this.parcelCn) this.parcelPkg--;
  }

  addParcelPkg() {
    if (this.parcelCn == 0) return;
    this.parcelPkg++;
  }

  async fail() {
    if (this.status == "failed" && this.failCode == null) {
      const alert = await this.alertCtrl.create({
        animated: true,
        message: "Please choose fail code",
        header: "Attention",
        buttons: [
          {
            role: "cancel",
            text: "OK"
          }
        ]
      });
      await alert.present();
      return;
    }

    if (this.failCode.isSignature) {
      if (this.signaturePad.isEmpty()) {
        const alert = await this.alertCtrl.create({
          animated: true,
          backdropDismiss: true,
          message: "Signature cannot be empty",
          keyboardClose: true,
          buttons: [
            {
              text: "OK",
              role: "cancel"
            }
          ]
        });
        await alert.present();
        return;
      }
    }

    if (this.cameraUrl == "" && this.failCode.isAttachment) {
      const alert = await this.alertCtrl.create({
        animated: true,
        message: "Please attach an image",
        header: "Attention",
        buttons: [
          {
            role: "cancel",
            text: "OK"
          }
        ]
      });
      await alert.present();
      return;
    }

    await this.post();
  }

  async post() {
    await this.loading.PresentLoading();

    var isUploadedFile = false;
    var isUploadedAttachment = false;
    var isPost = false;

    if (this.status == "failed") {
      this.docCn = 0;
      this.docPkg = 0;
      this.parcelCn = 0;
      this.parcelPkg = 0;
    } else if (this.status == "success") {
      this.failCode = null;
    }
    const item = {
      taskId: this.pickup.Id,
      PickupId: this.pickup.PickupId,
      docPkg: this.docPkg,
      docCn: this.docCn,
      parcelPkg: this.parcelPkg,
      parcelCn: this.parcelCn,
      pickupStatus: this.status,
      reason: this.reason,
      pickupCode: ""
    };

    if (this.failCode) {
      item.pickupCode = this.failCode.code;
    }
    this.pickup = item;

    if (this.pickup.pickupStatus == "success") {
      this.pickup.IsCompleted = true;
      this.pickup.IsPickedUp = true;
    } else {
      this.pickup.IsCompleted = true;
      this.pickup.IsPickedUp = false;
    }

    if (this.failCode) {
      if (this.failCode.isSignature) {
        this.loading.changeText("Uploading Signature");
        while (!isUploadedFile) {
          try {
            await this.UploadFile();
            isUploadedFile = true;
          } catch (error) {
            this.loading.changeText("Retrying Signature Upload");
            await delay(1500);
          }
        }
      }
    } else if (this.status == "success") {
      this.loading.changeText("Uploading Signature");
      while (!isUploadedFile) {
        try {
          await this.UploadFile();
          isUploadedFile = true;
        } catch (error) {
          this.loading.changeText("Retrying Signature Upload");
          await delay(1500);
        }
      }
    }

    if (this.cameraUrl != "") {
      this.loading.changeText("Uploading Attachment");
      while (!isUploadedAttachment) {
        try {
          await this.uploadAttachment();
          isUploadedAttachment = true;
        } catch (error) {
          console.log(error);
          this.loading.changeText("Retrying Attachment Upload");
          await delay(1500);
        }
      }
    }

    this.loading.changeText("Uploading Task");

    while (!isPost) {
      try {
        await this.api.completeTask(this.pickup);
        isPost = true;
      } catch (error) {
        this.loading.changeText("Retrying Task Upload");
        await delay(1500);
      }
    }

    setTimeout(async () => {
      await this.loading.Dismiss();
      await this.navCtrl.navigateRoot("/tabs/dashboard");
    }, 1000);
  }

  async done() {
    if (this.signaturePad.isEmpty() && this.status == "success") {
      const alert = await this.alertCtrl.create({
        animated: true,
        backdropDismiss: true,
        message: "Signature cannot be empty",
        header: "Warning",
        keyboardClose: true,
        buttons: [
          {
            text: "OK",
            role: "cancel"
          }
        ]
      });
      await alert.present();
      return;
    }
    if (this.status == "success" && (this.parcelCn > this.parcelPkg || this.docCn > this.docPkg)) {
      const alert = await this.alertCtrl.create({
        animated: true,
        message: "Number of packages cannot be lower than CN",
        header: "Attention",
        buttons: [
          {
            role: "cancel",
            text: "OK"
          }
        ]
      });
      await alert.present();
      return;
    }
    if (
      this.parcelCn == 0 &&
      this.parcelPkg == 0 &&
      this.docCn == 0 &&
      this.docPkg == 0 &&
      this.status == "success"
    ) {
      const alert = await this.alertCtrl.create({
        animated: true,
        message: "Please insert number of parcels/consignments",
        header: "Attention",
        buttons: [
          {
            role: "cancel",
            text: "OK"
          }
        ]
      });
      await alert.present();
      return;
    }

    await this.post();
  }

  openCamera() {
    this.camera.cleanup();
    this.camera
      .getPicture({
        cameraDirection: 0,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        quality: 70,
        allowEdit: false,
        correctOrientation: false,
        saveToPhotoAlbum: false,
        sourceType: this.camera.PictureSourceType.CAMERA,
        targetHeight: 1200,
        targetWidth: 1200
      })
      .then(res => {
        this.rawUrl = res;
        let win: any = window;

        const myURL = win.Ionic.WebView.convertFileSrc(res);
        console.log(myURL);
        this.cameraUrl = myURL;
      });
  }

  async uploadAttachment() {
    await this.base64.encodeFile(this.rawUrl).then(async img => {
      var fd = new FormData();
      fd.append(
        "files",
        this.dataURItoBlob(img.replace("data:image/*", "data:image/jpeg")),
        "1.jpg"
      );
      await this.api.sendPickupAttachment(this.pickup.taskId, fd);
    });
  }

  dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0) byteString = atob(dataURI.split(",")[1]);
    else byteString = encodeURI(dataURI.split(",")[1]);
    var mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  async UploadFile() {
    var image = this.signaturePad.toDataURL();
    var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
    var blob = this.base64ToBlob(base64ImageContent, "image/png");
    var formData = new FormData();
    formData.append("files", blob, "1.jpg");
    await this.api.uploadPickupSignature(this.pickup.taskId, formData);
  }

  base64ToBlob(base64, mime) {
    mime = mime || "";
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      var slice = byteChars.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }
}
