import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
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
    private api: PCAApiService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.androidPermissions
        .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
        .then(
          result => console.log("Has permission?", result.hasPermission),
          err =>
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        );

      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
      // this.storage.getApiToken().then(res => {
      //   if (res) this.fcm.initToken().then(res => {
      //     this.storage.getUserId().then(uid =>)
      //   });
      // });

      this.statusBar.hide();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }
}
