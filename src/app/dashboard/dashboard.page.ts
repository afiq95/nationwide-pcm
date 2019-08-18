import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalStorageService } from "../services/local-storage.service";
import { PCAApiService } from "../services/pcaapi.service";
import { NavController, AlertController, IonSelect } from "@ionic/angular";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage {
  pickup = {
    Successful: 0,
    Failed: 0,
    Pending: 0,
    Total: 0
  };
  delivery = {
    Successful: 0,
    Failed: 0,
    Pending: 0,
    Total: 0
  };
  isOnDuty = false;
  courierId: "";

  @ViewChild("modeSelect") modeSelect: IonSelect;
  vehicleMode: any;
  constructor(
    private storage: LocalStorageService,
    private api: PCAApiService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  async ionViewWillEnter() {
    this.courierId = await this.storage.getCourierId();
    // this.pickup = {
    //   Failed: (await this.api.GetPickupCount("failed")).data.Count,
    //   Successful: (await this.api.GetPickupCount("pickedup")).data.Count,
    //   Pending: (await this.api.GetPickupCount("accepted")).data.Count,
    //   Total: (await this.api.GetPickupCount("today")).data.Count
    // };
    this.pickup = {
      Failed: 0,
      Pending: 0,
      Successful: 0,
      Total: 0
    };

    this.delivery = {
      Failed: 0,
      Pending: 0,
      Successful: 0,
      Total: 0
    };

    const pickRoute = await this.storage.getPickupRouting();
    pickRoute.forEach(route => {
      this.api.GetPickupCount(route.RouteCode).then(res => {
        this.pickup.Failed += res.data.Failed;
        this.pickup.Successful += res.data.Successful;
        this.pickup.Pending += res.data.Pending;
        this.pickup.Total += res.data.Total;
      });
    });

    const deliRoute = await this.storage.getDeliveryRouting();
    deliRoute.forEach(route => {
      this.api.GetDeliCount(route.RouteCode).then(res => {
        this.delivery.Failed += res.data.Failed;
        this.delivery.Successful += res.data.Successful;
        this.delivery.Pending += res.data.Pending;
        this.delivery.Total += res.data.Total;
      });
    });

    const data = await this.storage.getVehicleMode();
    if (!data) {
      const alert = await this.alertController.create({
        message: "You haven't select your vehicle mode yet. Tap on OK to continue",
        header: "Warning",
        buttons: [
          {
            text: "OK",
            handler: () => {
              this.modeSelect.open();
            }
          }
        ]
      });

      await alert.present();
    } else {
      this.vehicleMode = data;
    }
  }

  async openRouteCode() {
    await this.navCtrl.navigateForward("/tabs/dashboard/route");
  }

  async changeStatus() {
    if (!this.isOnDuty) {
      const started = await this.api.startDuty();
      await this.storage.setDutyId(started.data.Id);
      await this.storage.setDuty(true);
      this.isOnDuty = true;
    } else {
      const alert = await this.alertController.create({
        header: "Off Duty?",
        message: "Are you sure you are going off duty",
        buttons: [
          {
            text: "Yes",
            handler: async () => {
              await this.api.stopDuty();
              await this.storage.setDutyId("");
              await this.storage.setDuty(false);
              this.isOnDuty = false;
            }
          },
          {
            text: "No",
            handler: () => {
              this.isOnDuty = true;
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async onModeChange(item) {
    await this.storage.setVehicleMode(item.detail.value);
  }
}