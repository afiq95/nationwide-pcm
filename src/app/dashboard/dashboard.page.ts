import { Component } from "@angular/core";
import { LocalStorageService } from "../services/local-storage.service";
import { PCAApiService } from "../services/pcaapi.service";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage {
  pickup: {
    Successful: 0;
    Failed: 0;
    Pending: 0;
    Total: 0;
  };

  courierId: "";
  constructor(
    private storage: LocalStorageService,
    private api: PCAApiService,
    private navCtrl: NavController
  ) {}

  async ionViewWillEnter() {
    this.courierId = await this.storage.getCourierId();
    this.pickup = {
      Failed: (await this.api.GetPickupCount("failed")).data.Count,
      Successful: (await this.api.GetPickupCount("pickedup")).data.Count,
      Pending: (await this.api.GetPickupCount("accepted")).data.Count,
      Total: (await this.api.GetPickupCount("today")).data.Count
    };
  }

  async openRouteCode() {
    await this.navCtrl.navigateForward("/tabs/dashboard/route");
  }
}
