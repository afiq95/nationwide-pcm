import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { DeclinePickupFormPage } from "../decline-pickup-form/decline-pickup-form.page";
import { PCAApiService } from "src/app/services/pcaapi.service";

@Component({
  selector: "app-pickup-list",
  templateUrl: "./pickup-list.page.html",
  styleUrls: ["./pickup-list.page.scss"]
})
export class PickupListPage {
  currentStatus = "Pending";
  primary = "primary";
  pickups = [];
  pendings = [];
  completed = [];
  constructor(
    public modalController: ModalController,
    private api: PCAApiService,
    private navCtrl: NavController
  ) {}

  async ionViewWillEnter() {
    this.pickups = (await this.api.getPickupListings()).data.Results;
    this.pendings = this.pickups.filter(x => {
      return !x.IsCompleted;
    });
    this.completed = this.pickups.filter(x => {
      return x.IsCompleted;
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
