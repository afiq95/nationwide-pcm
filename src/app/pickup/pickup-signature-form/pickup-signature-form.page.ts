import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { PCAApiService } from "src/app/services/pcaapi.service";
import { LoadingService } from "src/app/services/loading.service";
import { NavController } from "@ionic/angular";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import { Base64 } from "@ionic-native/base64/ngx";

@Component({
  selector: "app-pickup-signature-form",
  templateUrl: "./pickup-signature-form.page.html",
  styleUrls: ["./pickup-signature-form.page.scss"]
})
export class PickupSignatureFormPage implements OnInit {
  pickup: any;
  imgUrl: any = "";
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  public signaturePadOptions: Object = {
    minWidth: 5,
    canvasWidth: 280,
    canvasHeight: 250
  };
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private api: PCAApiService,
    private loading: LoadingService,
    private base64: Base64
  ) {}

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras) {
      this.pickup = this.router.getCurrentNavigation().extras.state.pickup;
      this.imgUrl = this.router.getCurrentNavigation().extras.state.imgUrl;
      console.log("imgur", this.imgUrl);
    }
  }

  async uploadAttachment() {
    debugger;
    await this.base64.encodeFile(this.imgUrl).then(async img => {
      debugger;
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

  async done() {
    await this.loading.PresentLoading();
    if (this.pickup.pickupStatus == "success") {
      this.pickup.IsCompleted = true;
      this.pickup.IsPickedUp = true;
    } else {
      this.pickup.IsCompleted = true;
    }
    await this.api.completeTask(this.pickup);
    await this.uploadAttachment();
    await this.UploadFile();

    setTimeout(async () => {
      await this.loading.Dismiss();
      await this.navCtrl.navigateRoot("/tabs/dashboard");
    }, 1000);
  }

  reverse() {
    this.navCtrl.pop();
  }
}
