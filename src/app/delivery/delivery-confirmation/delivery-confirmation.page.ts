import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Camera } from "@ionic-native/camera/ngx";
import { PCAApiService } from "src/app/services/pcaapi.service";
import { NavController, AlertController } from "@ionic/angular";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import { Base64 } from "@ionic-native/base64/ngx";
import { delay } from "q";
import { LoadingService } from "src/app/services/loading.service";

@Component({
  selector: "app-delivery-confirmation",
  templateUrl: "./delivery-confirmation.page.html",
  styleUrls: ["./delivery-confirmation.page.scss"]
})
export class DeliveryConfirmationPage implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public signaturePadOptions: Object = {
    minWidth: 5,
    canvasWidth: 280,
    canvasHeight: 250
  };

  deliveries: any[] = [];
  cameraUri = "";
  cameraUrl: any = "";
  status = "";
  failCode: any = null;
  allFailCode = [];
  note = "";
  rawUrl: any;
  receiverName = "";
  receiverId = "";
  cnTotal = 0;
  pcsTotal = 0;
  constructor(
    private router: Router,
    private camera: Camera,
    private api: PCAApiService,
    private navCtrl: NavController,
    private storage: LocalStorageService,
    public alertController: AlertController,
    private base64: Base64,
    private loading: LoadingService
  ) {}

  async ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state;
    if (state) this.deliveries = state.items;
    this.allFailCode = (await this.storage.getDeliFailCode()).map(x => {
      return {
        name: x.Title,
        code: x.Code,
        isSignature: x.IsSignatureNeeded,
        isAttachment: x.IsAttachmentNeeded
      };
    });
    this.cnTotal = this.deliveries.length;
    this.pcsTotal = this.deliveries.reduce((total, num) => {
      return total + num.Pieces;
    }, 0);
  }

  async goToSignature() {
    if (this.cameraUrl == "" && this.status == "failed") {
      const alert = await this.alertController.create({
        animated: true,
        message: "Please attach an image",
        header: "Warning",
        buttons: [
          {
            role: "cancel",
            text: "OK"
          }
        ]
      });
      await alert.present();
    } else if (this.receiverId == "" || this.receiverName == "") {
      const alert = await this.alertController.create({
        animated: true,
        message: "Please Fill Receiver Name and Identification",
        header: "Warning",
        buttons: [
          {
            role: "cancel",
            text: "OK"
          }
        ]
      });
      await alert.present();
    } else {
      var recId = this.receiverId;
      if (this.receiverId.length >= 14) recId = this.receiverId.substring(0, 13);
      const data = this.deliveries.map(x => {
        x.ReceiverIdentification = recId;
        x.ReceiverName = this.receiverName;
        return { ...x };
      });
      this.router.navigate(["/signature-form"], {
        state: {
          deliveries: data,
          drsNo: this.deliveries[0].DrsNo,
          imgUrl: this.cameraUrl,
          rawUrl: this.rawUrl
        }
      });
    }
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
        this.cameraUrl = myURL;
      });
  }

  async uploadAttachment() {
    var fd = new FormData();
    await this.base64.encodeFile(this.rawUrl).then(async img => {
      fd.append(
        "files",
        this.dataURItoBlob(img.replace("data:image/*", "data:image/jpeg")),
        "1.jpg"
      );
    });

    return await this.api.SendDeliveryAttachment(this.deliveries[0].DrsNo, fd);
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
    return await this.api.uploadDeliverySignature(this.deliveries[0].DrsNo, formData);
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

  clear() {
    this.signaturePad.clear();
  }

  async ValidateFail() {
    var isSignature = false;
    var isAttachment = false;

    if (this.status == "failed" && !this.failCode) {
      const alert = await this.alertController.create({
        animated: true,
        backdropDismiss: true,
        buttons: ["OK"],
        header: "No Fail Code",
        message: "Choose a fail code"
      });
      await alert.present();
      return;
    }

    if (this.failCode.isSignature) {
      if (this.signaturePad.isEmpty()) {
        const alert = await this.alertController.create({
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
      isSignature = true;
    }

    if (this.failCode.isAttachment) {
      if (this.cameraUrl == "") {
        const alert = await this.alertController.create({
          animated: true,
          message: "Please attach an image",
          header: "Warning",
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
      isAttachment = true;
    }

    await this.postDone(isSignature, isAttachment, true);
  }

  async ValidateSuccess() {
    if (this.receiverId == "" || this.receiverName == "") {
      const alert = await this.alertController.create({
        animated: true,
        message: "Please Fill Receiver Name and Identification",
        header: "Warning",
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
    if (this.signaturePad.isEmpty()) {
      const alert = await this.alertController.create({
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

    await this.postDone(true, false, false);
  }

  async postDone(isSignature: boolean, isAttachment: boolean, isFailed: boolean) {
    const mode = await this.storage.getVehicleMode();
    const courierId = await this.storage.getCourierId();
    if (isFailed) {
      var attach;
      var file;
      await this.loading.PresentLoading();

      if (isSignature) file = await this.UploadFile();
      if (isAttachment) attach = await this.uploadAttachment();

      const data = this.deliveries.map(x => {
        x.IsSuccessful = false;
        if (this.failCode) {
          x.FailCode = this.failCode.code;
        }
        x.Reason = this.note;
        x.Mode = mode;
        x.CourierId = courierId;
        x.ReceiverName = this.receiverName;
        if (isSignature) x.SignatureUrl = file.data.PhotoUrl;
        if (isAttachment) x.AttachmentUrl = attach.data.PhotoUrl;
        return { ...x };
      });
      await this.api.failDeliveryTask(data);
      await this.navCtrl.navigateRoot("/tabs/dashboard");
      await this.loading.Dismiss();
    } else {
      var isUploadedFile = false;
      var isPost = false;
      var file = null;

      await this.loading.PresentLoading();

      this.loading.changeText("Uploading Signature");
      while (!isUploadedFile) {
        try {
          file = await this.UploadFile();
          isUploadedFile = true;
        } catch (error) {
          this.loading.changeText("Retrying Signature Upload");
          await delay(1500);
        }
      }
      var recId = this.receiverId;
      if (this.receiverId.length >= 14) recId = this.receiverId.substring(0, 13);
      const data = this.deliveries.map(x => {
        x.ReceiverIdentification = recId;
        x.ReceiverName = this.receiverName;
        x.SignatureUrl = file.data.PhotoUrl;
        x.Mode = mode;
        x.CourierId = courierId;
        return { ...x };
      });

      this.loading.changeText("Uploading Task");
      while (!isPost) {
        try {
          await this.api.successDeliveryTask(data);
          isPost = true;
        } catch (error) {
          this.loading.changeText("Retrying Task Upload");
          await delay(1500);
        }
      }

      this.loading.Dismiss().then(() => {
        this.camera.cleanup();
        this.navCtrl.navigateRoot("/tabs/dashboard", { replaceUrl: true });
      });
    }
  }
}
