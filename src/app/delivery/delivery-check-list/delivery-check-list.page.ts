import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { BarcodeScanner, BarcodeScanResult } from "@ionic-native/barcode-scanner/ngx";
import { QrCodeService } from "src/app/services/qr-code.service";

@Component({
  selector: "app-delivery-check-list",
  templateUrl: "./delivery-check-list.page.html",
  styleUrls: ["./delivery-check-list.page.scss"]
})
export class DeliveryCheckListPage implements OnInit {
  deliveries: any[] = [];
  searchText = "";
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private qrCodeService: QrCodeService
  ) {}

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state;
    console.log(state);
    if (state) this.deliveries = state.items;
  }

  next() {
    this.navCtrl.navigateForward("/delivery-confirmation", {
      state: {
        items: this.deliveries
      }
    });
  }

  async openQr() {
    console.log(await this.qrCodeService.openQr());
  }
}
