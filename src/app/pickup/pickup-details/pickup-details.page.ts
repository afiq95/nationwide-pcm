import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, AlertController } from "@ionic/angular";
import { Camera } from "@ionic-native/camera/ngx";

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
  allFailCode = [
    {
      name: "Office Closed",
      code: "X06"
    },
    {
      name: "Future Pickup",
      code: "X14"
    },
    {
      name: "Attempt After Closed Time",
      code: "X23"
    },
    {
      name: "No Package (RC)",
      code: "X28"
    },
    {
      name: "No Invoice",
      code: "X38"
    },
    {
      name: "Vehicle Breakdown",
      code: "X63"
    }
  ];
  failCode = "";
  reason = "";
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private camera: Camera,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state)
      this.pickup = this.router.getCurrentNavigation().extras.state.pickup;
    console.log(this.pickup);
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
            text: "Okay"
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
            text: "Okay"
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
            text: "Okay"
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
            text: "Okay"
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
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        quality: 20,
        allowEdit: false,
        correctOrientation: false,
        saveToPhotoAlbum: false,
        sourceType: this.camera.PictureSourceType.CAMERA,
        targetHeight: 1000,
        targetWidth: 1000
      })
      .then(res => {
        this.rawUrl = res;
        let win: any = window; // hack ionic/angular compilator

        const myURL = win.Ionic.WebView.convertFileSrc(res);
        console.log(myURL);
        this.cameraUrl = myURL;
      });
  }
}
