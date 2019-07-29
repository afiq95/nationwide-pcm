import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PCAApiService } from "src/app/services/pcaapi.service";

@Component({
  selector: "app-pickup-signature-form",
  templateUrl: "./pickup-signature-form.page.html",
  styleUrls: ["./pickup-signature-form.page.scss"]
})
export class PickupSignatureFormPage implements OnInit {
  pickup: any;
  public signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 280,
    canvasHeight: 250
  };
  constructor(private router: Router, private api: PCAApiService) {}

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras)
      this.pickup = this.router.getCurrentNavigation().extras.state.pickup;
  }

  async done() {
    const res = await this.api.completeTask(this.pickup);
    this.router.navigate(["/tabs/pickup-list"]);
  }
}
