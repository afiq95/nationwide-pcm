import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Camera } from "@ionic-native/camera/ngx";
import { PCAApiService } from "src/app/services/pcaapi.service";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-delivery-confirmation",
  templateUrl: "./delivery-confirmation.page.html",
  styleUrls: ["./delivery-confirmation.page.scss"]
})
export class DeliveryConfirmationPage implements OnInit {
  deliveries: any[] = [];
  cameraUri = "";
  cameraUrl: any = "";
  status = "";
  failCode = "";
  allFailCode = [
    {
      name: "Vehicle Breakdown",
      code: "X63"
    },
    {
      name: "Natural Disaster",
      code: "X70"
    },
    {
      name: "Shipment Refused By Recipient",
      code: "X05"
    },
    {
      name: "Incorrect Address",
      code: "X02"
    },
    {
      name: "Business Closed On Dlvy Attempt",
      code: "X06"
    },
    {
      name: "Pkg Not Dlvd/Attempted",
      code: "X01"
    }
  ];
  note = "";
  rawUrl: any;
  receiverName = "";
  receiverId = "";
  constructor(
    private router: Router,
    private camera: Camera,
    private api: PCAApiService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state;
    console.log(state);
    if (state) this.deliveries = state.items;
  }

  goToSignature() {
    const data = this.deliveries.map(x => {
      x.ReceiverIdentification = this.receiverId;
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

  async done() {
    const data = this.deliveries.map(x => {
      x.IsSuccessful = false;
      x.FailCode = this.failCode;
      x.Reason = this.note;
      return { ...x };
    });
    await this.api.failDeliveryTask(data);
    await this.navCtrl.navigateRoot("/tabs/dashboard");
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
        let win: any = window;
        const myURL = win.Ionic.WebView.convertFileSrc(res);
        this.cameraUrl = myURL;
      });
  }
}
