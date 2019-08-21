import { Component } from "@angular/core";

import { Platform, Events } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { FcmService } from "./services/fcm.service";
import { LocalStorageService } from "./services/local-storage.service";
import { PCAApiService } from "./services/pcaapi.service";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private androidPermissions: AndroidPermissions,
    private backgroundMode: BackgroundMode,
    private fcm: FcmService,
    private storage: LocalStorageService,
    private api: PCAApiService,
    private event: Events
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.androidPermissions
      //   .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
      //   .then(
      //     result => console.log("Has permission?", result.hasPermission),
      //     err =>
      //       this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      //   );
      // this.androidPermissions
      //   .checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
      //   .then(
      //     result =>
      //       this.androidPermissions.requestPermission(
      //         this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
      //       ),
      //     err =>
      //       this.androidPermissions.requestPermission(
      //         this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
      //       )
      //   );
      this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
      ]);

      // this.androidPermissions
      //   .checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      //   .then(result => {
      //     if (result.hasPermission) {
      //     } else {
      //       console.log("no perm");
      //       this.androidPermissions.requestPermissions([
      //         this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      //       ]);
      //     }
      //   });
      // this.storage.getApiToken().then(res => {
      //   if (res) this.fcm.initToken().then(res => {
      //     this.storage.getUserId().then(uid =>)
      //   });
      // });
      // this.api.getDuty().then((res: any) => {
      //   if (res.data.Results.length > 0) {
      //     console.log("here");
      //     this.storage.setDutyId(res.data.Results[0].Id);
      //     this.event.publish("dutyChanged", true);
      //   } else {
      //     this.storage.setDutyId("");
      //     this.event.publish("dutyChanged", false);
      //   }
      // });
      this.storage.getApiToken().then(token => {
        this.storage.getRefreshToken().then(refresh => {
          this.api.refreshToken(token, refresh).then(res => {
            this.storage.setApiToken(res.data.token).then(() => {
              this.storage.setRefreshToken(res.data.refreshToken);
            });
          });
        });
      });
      this.statusBar.hide();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }
}
