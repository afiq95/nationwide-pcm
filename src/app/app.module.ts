import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PcaHeaderComponentModule } from "./components/pca-header/pca-header.module";
import { HeaderTrasformDirective } from "./directive/header-trasform.directive";
import { DeliveryService } from "./services/delivery.service";
import { DeclinePickupFormPageModule } from "./pickup/decline-pickup-form/decline-pickup-form.module";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { QrCodeService } from "./services/qr-code.service";
import { Camera } from "@ionic-native/camera/ngx";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { FCM } from "@ionic-native/fcm/ngx";
import { FcmService } from "./services/fcm.service";
import { PCAApiService } from "./services/pcaapi.service";
import { Base64 } from "@ionic-native/base64/ngx";
import { IonicStorageModule } from "@ionic/storage";
import { AuthGuardService } from "./serivices/auth-guard.service";
import { HereAPIService } from "./services/here-api.service";
import { HTTP } from "@ionic-native/http/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    DeclinePickupFormPageModule,
    IonicStorageModule.forRoot({
      name: "__mydb",
      driverOrder: ["indexeddb", "sqlite", "websql"]
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DeliveryService,
    BarcodeScanner,
    AndroidPermissions,
    QrCodeService,
    Camera,
    BackgroundMode,
    FCM,
    FcmService,
    PCAApiService,
    AuthGuardService,
    CallNumber,
    Base64,
    HereAPIService,
    HTTP,
    Geolocation,
    AppVersion
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
