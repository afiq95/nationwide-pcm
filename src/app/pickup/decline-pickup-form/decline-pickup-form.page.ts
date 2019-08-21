import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { PCAApiService } from "src/app/services/pcaapi.service";

@Component({
  selector: "app-decline-pickup-form",
  templateUrl: "./decline-pickup-form.page.html",
  styleUrls: ["./decline-pickup-form.page.scss"]
})
export class DeclinePickupFormPage implements OnInit {
  selectedReason = "";
  declinedReason = "";
  @Input("pickupId") pickupId = "";

  constructor(
    public modalController: ModalController,
    private api: PCAApiService
  ) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  async post() {
    if (this.selectedReason == "No Time")
      await this.api.declineTask({
        Id: this.pickupId,
        DeclinedReason: this.selectedReason
      });
    else
      await this.api.declineTask({
        Id: this.pickupId,
        DeclinedReason: this.declinedReason
      });

    this.dismiss();
  }
}
