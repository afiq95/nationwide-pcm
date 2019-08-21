import { Component, OnInit } from "@angular/core";
import { ModalController, NavController, AlertController } from "@ionic/angular";
import { DeclinePickupFormPage } from "../decline-pickup-form/decline-pickup-form.page";
import { PCAApiService } from "src/app/services/pcaapi.service";
import { LoadingService } from "src/app/services/loading.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { HereAPIService } from "src/app/services/here-api.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import * as moment from "moment";
@Component({
  selector: "app-pickup-list",
  templateUrl: "./pickup-list.page.html",
  styleUrls: ["./pickup-list.page.scss"]
})
export class PickupListPage implements OnInit {
  currentStatus = "Pending";
  primary = "primary";
  pickups = [];
  pendings = [];
  completed = [];
  constructor(
    public modalController: ModalController,
    private api: PCAApiService,
    private navCtrl: NavController,
    private loading: LoadingService,
    private storage: LocalStorageService,
    private callNumber: CallNumber,
    private hereApi: HereAPIService,
    private geolocation: Geolocation,
    public alertController: AlertController
  ) {}
  async ngOnInit() {}

  callContact(item) {
    this.callNumber.callNumber(item, false);
  }

  async initData() {
    try {
      await this.loading.PresentLoading();
      this.pickups = [];
      const pickupRouteCodes = await this.storage.getPickupRouting();
      for (const code of pickupRouteCodes) {
        var data: any[] = (await this.api.getPickupByRouteCode(code.RouteCode)).data.Results;
        data = data.map(x => {
          const diff = moment().diff(moment(x.DateTimeClosed), "minutes");
          if (moment().isBefore(moment(x.DateTimeClosed)) && diff < 60) {
            x.isLate = true;
          } else {
            x.isLate = false;
          }
          x.isLoadingCoords = false;
          x.longitude = 0;
          x.latitude = 0;
          x.distance = "";
          x.time = "";
          return { ...x };
        });
        this.pickups.push(...data);
      }

      this.pendings = this.pickups.filter(x => {
        return !x.IsCompleted;
      });
      this.completed = this.pickups.filter(x => {
        return x.IsCompleted;
      });
      await this.loading.Dismiss();
    } catch (ex) {
      await this.loading.Dismiss();
      const retryLoad = await this.warn();
      if (retryLoad) await this.initData();
      else this.navCtrl.navigateRoot("/tabs/dashboard", { replaceUrl: true });
    }
  }
  async ionViewWillEnter() {
    await this.initData();
  }

  async warn(): Promise<boolean> {
    return new Promise(async resolve => {
      const confirm = await this.alertController.create({
        header: "Error",
        message: "Error Fetching Pickup (Check your internet connection)",
        buttons: [
          {
            text: "Retry",
            handler: () => {
              return resolve(true);
            }
          },
          {
            text: "OK",
            role: "cancel",
            handler: () => {
              return resolve(false);
            }
          }
        ]
      });

      await confirm.present();
    });
  }

  async openDeclineForm(item) {
    const modal = await this.modalController.create({
      component: DeclinePickupFormPage,
      componentProps: {
        pickupId: item.Id
      },
      keyboardClose: true
    });

    await modal.present();
  }

  async accept(item) {
    item.IsAccepted = true;
    await this.api.acceptTask(item.Id);
  }

  async pickupPage(item) {
    console.log(item);
    this.navCtrl.navigateForward(["/pickup-details"], {
      state: {
        pickup: item
      }
    });
  }
}
