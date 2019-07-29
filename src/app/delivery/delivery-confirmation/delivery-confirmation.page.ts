import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Camera } from "@ionic-native/camera/ngx";
@Component({
  selector: "app-delivery-confirmation",
  templateUrl: "./delivery-confirmation.page.html",
  styleUrls: ["./delivery-confirmation.page.scss"]
})
export class DeliveryConfirmationPage implements OnInit {
  deliveries: any[] = [];
  cameraUri = "";
  cameraUrl: any = "";
  constructor(private router: Router, private camera: Camera) {}

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state;
    console.log(state);
    if (state) this.deliveries = state.items;
  }

  goToSignature() {
    this.router.navigate(["/signature-form"]);
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
        let win: any = window; // hack ionic/angular compilator

        const myURL = win.Ionic.WebView.convertFileSrc(res);
        console.log(myURL);
        this.cameraUrl = myURL;
      });
  }
}
