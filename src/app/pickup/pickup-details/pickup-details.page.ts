import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-pickup-details",
  templateUrl: "./pickup-details.page.html",
  styleUrls: ["./pickup-details.page.scss"]
})
export class PickupDetailsPage implements OnInit {
  pickup: any = {};
  docCn = 0;
  docPkg = 0;
  parcelCn = 0;
  parcelPkg = 0;
  code = "";
  constructor(private navCtrl: NavController, private router: Router) {}

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state)
      this.pickup = this.router.getCurrentNavigation().extras.state.pickup;
    console.log(this.pickup);
  }

  removeDocCn() {
    this.docCn--;
  }

  addDocCn() {
    this.docCn++;
  }

  removeDocPkg() {
    this.docPkg--;
  }

  addDocPkg() {
    this.docPkg++;
  }

  removeParcelCn() {
    this.parcelCn--;
  }

  addParcelCn() {
    this.parcelCn++;
  }

  removeParcelPkg() {
    this.parcelPkg--;
  }

  addParcelPkg() {
    this.parcelPkg++;
  }

  async goToSignature() {
    const item = {
      taskId: this.pickup.Id,
      docPkg: this.docPkg,
      docCn: this.docCn,
      parcelPkg: this.parcelPkg,
      parcelCn: this.parcelCn,
      pickupStatus: this.code
    };
    this.navCtrl.navigateForward(["/pickup-signature-form"], {
      state: { pickup: item }
    });
  }
}
