import { Component, OnInit, ViewChild } from "@angular/core";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import { Router } from "@angular/router";
import { PCAApiService } from "src/app/services/pcaapi.service";
import { LoadingService } from "src/app/services/loading.service";
import { NavController } from "@ionic/angular";
import { Camera } from "@ionic-native/camera/ngx";
import { Base64 } from "@ionic-native/base64/ngx";
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
    private base64: Base64
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
    await this.loading.PresentLoading();
    const file = await this.UploadFile();
    const attach = await this.uploadAttachment();
    const data = this.deliveries.map(x => {
      x.AttachmentUrl = attach.data.PhotoUrl;
      x.SignatureUrl = file.data.PhotoUrl;
      return { ...x };
    });
    console.log(data);
    await this.api.successDeliveryTask(data);
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
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0) byteString = atob(dataURI.split(",")[1]);
    else byteString = encodeURI(dataURI.split(",")[1]);
    var mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    // write the bytes of the string to a typed array
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
