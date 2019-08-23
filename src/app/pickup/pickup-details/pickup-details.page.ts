import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, AlertController } from "@ionic/angular";
import { Camera } from "@ionic-native/camera/ngx";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Component({
  selector: "app-pickup-details",
  templateUrl: "./pickup-details.page.html",
  styleUrls: ["./pickup-details.page.scss"]
})
export class PickupDetailsPage implements OnInit {
  pickup: any = {};
  docCn = 0;
  docPkg = 0;
  parcelCn = 0;
  parcelPkg = 0;
  status = "";
  cameraUrl: any = "";
  rawUrl: any;
  allFailCode = [];
  failCode = "";
  reason = "";
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private camera: Camera,
    public alertController: AlertController,
    private storage: LocalStorageService
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

  async goToSignature() {
    if (this.status == "") {
      const alert = await this.alertController.create({
        animated: true,
        message: "Please choose pickup code",
        header: "Attention",
        buttons: [
          {
            role: "cancel",
            text: "OK"
          }
        ]
      });
      await alert.present();
    } else if (this.cameraUrl == "") {
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
    } else if (
      this.parcelCn == 0 &&
      this.parcelPkg == 0 &&
      this.docCn == 0 &&
      this.docPkg == 0 &&
      this.status != "failed"
    ) {
      const alert = await this.alertController.create({
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
    } else if (
      this.status == "success" &&
      (this.parcelCn > this.parcelPkg || this.docCn > this.docPkg)
    ) {
      const alert = await this.alertController.create({
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
    } else if (this.status == "failed" && this.failCode == "") {
      const alert = await this.alertController.create({
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
    } else {
      if (this.status == "failed") {
        this.docCn = 0;
        this.docPkg = 0;
        this.parcelCn = 0;
        this.parcelPkg = 0;
      }
      const item = {
        taskId: this.pickup.Id,
        PickupId: this.pickup.PickupId,
        docPkg: this.docPkg,
        docCn: this.docCn,
        parcelPkg: this.parcelPkg,
        parcelCn: this.parcelCn,
        pickupStatus: this.status,
        pickupCode: this.failCode,
        reason: this.reason
      };
      this.navCtrl.navigateForward(["/pickup-signature-form"], {
        state: { pickup: item, imgUrl: this.rawUrl }
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
        console.log(myURL);
        this.cameraUrl = myURL;
      });
  }
}
