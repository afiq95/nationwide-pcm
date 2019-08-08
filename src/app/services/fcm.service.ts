import { Injectable } from "@angular/core";
import { FCM } from "@ionic-native/fcm/ngx";
import { PCAApiService } from "./pcaapi.service";
import { LocalStorageService } from "./local-storage.service";
import { AlertController, NavController, ModalController } from "@ionic/angular";
import { DeclinePickupFormPage } from "../pickup/decline-pickup-form/decline-pickup-form.page";

@Injectable({
  providedIn: "root"
})
export class FcmService {
  constructor(
    private fcm: FCM,
    private api: PCAApiService,
    private storage: LocalStorageService,
    public alertController: AlertController,
    private navCtrl: NavController,
    public modalController: ModalController
  ) {
    this.fcm.onTokenRefresh().subscribe(token => {
      this.storage.getUserId().then(uid => {
        this.api.updateFcmToken(token, uid);
      });
    });
    this.fcm.onNotification().subscribe((data: any) => {
      console.log(data);
      if (data.wasTapped) this.navCtrl.navigateRoot(["/tabs/pickup-list"]);
      if (data.type == "newtask") this.NewPickupTask(data);
    });
  }

  async initToken() {
    const token = await this.fcm.getToken();
    if ((await this.storage.getFcmToken()) == token) return token;
    else {
      await this.api.updateFcmToken(token, await this.storage.getUserId());
      await this.storage.setFcmToken(token);
      return token;
    }
  }

  async NewPickupTask(item) {
    console.log(item);
    (await this.alertController.create({
      buttons: [
        {
          text: "Accept",
          handler: () => {
            this.api.acceptTask(item.pickupid);
            this.navCtrl.navigateRoot(["/tabs/pickup-list"]);
          }
        },
        {
          text: "Decline",
          handler: () => {
            this.modalController
              .create({
                component: DeclinePickupFormPage,
                componentProps: {
                  pickupId: item.pickupid
                },
                keyboardClose: true
              })
              .then(res => {
                res.present();
              });
          }
        }
      ],
      header: "New Pickup",
      message: "You have a new pickup task at " + item.address
    })).present();
  }
}
