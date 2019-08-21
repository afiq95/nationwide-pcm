import { Component, OnInit, ViewChild } from "@angular/core";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import { Router } from "@angular/router";
import { PCAApiService } from "src/app/services/pcaapi.service";
import { LoadingService } from "src/app/services/loading.service";
import { NavController, AlertController } from "@ionic/angular";
import { Camera } from "@ionic-native/camera/ngx";
import { Base64 } from "@ionic-native/base64/ngx";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { delay } from "q";
@Component({
  selector: "app-signature-form",
  templateUrl: "./signature-form.page.html",
  styleUrls: ["./signature-form.page.scss"]
})
export class SignatureFormPage implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  state: any;
  deliveries: any[] = [];
  drsNo = "";
  fd: FormData;
  public signaturePadOptions: Object = {
    minWidth: 5,
    canvasWidth: 500,
    canvasHeight: 300
  };
  rawUrl: any;
  constructor(
    private router: Router,
    private api: PCAApiService,
    private loading: LoadingService,
    private navCtrl: NavController,
    private camera: Camera,
    private base64: Base64,
    private storage: LocalStorageService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.state = this.router.getCurrentNavigation().extras.state;
    if (this.state) {
      this.drsNo = this.state.drsNo;
      this.deliveries = this.state.deliveries;
      this.rawUrl = this.state.rawUrl;
    }
  }

  async done() {
    var isUploadedFile = false;
    var isUploadedAttachment = false;
    var isPost = false;
    var file = null;
    var attach = null;
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

    this.loading.changeText("Uploading Attachment");
    while (!isUploadedAttachment) {
      try {
        attach = await this.uploadAttachment();
        isUploadedAttachment = true;
      } catch (error) {
        this.loading.changeText("Retrying Attachment Upload");
        await delay(1500);
      }
    }

    const mode = await this.storage.getVehicleMode();
    const courierId = await this.storage.getCourierId();
    const data = this.deliveries.map(x => {
      x.AttachmentUrl = attach.data.PhotoUrl;
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

  async uploadAttachment() {
    var fd = new FormData();
    await this.base64.encodeFile(this.rawUrl).then(async img => {
      fd.append(
        "files",
        this.dataURItoBlob(img.replace("data:image/*", "data:image/jpeg")),
        "1.jpg"
      );
    });

    return await this.api.SendDeliveryAttachment(this.drsNo, fd);
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
    return await this.api.uploadDeliverySignature(this.drsNo, formData);
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
