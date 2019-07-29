import { Component, OnInit } from "@angular/core";
import { DeliveryService } from "src/app/services/delivery.service";
import { NavController } from "@ionic/angular";
import { BarcodeScanner, BarcodeScanResult } from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: "app-delivery-list",
  templateUrl: "./delivery-list.page.html",
  styleUrls: ["./delivery-list.page.scss"]
})
export class DeliveryListPage implements OnInit {
  checked: any[] = [];
  deliveries: any[] = [];
  constructor(
    private deliService: DeliveryService,
    private navCtrl: NavController,
    private barCodeScanner: BarcodeScanner
  ) {}

  ngOnInit() {
    this.deliveries = this.deliService.getDeliveries();
  }

  checkChecked($event, delivery) {
    if ($event.detail.checked) this.checked.push(delivery);
    else {
      const index = this.checked.findIndex(x => {
        return x.id == delivery.id;
      });
      this.checked.splice(index, 1);
    }
  }

  proceed() {
    this.navCtrl.navigateForward("/delivery-check-list", {
      state: {
        items: this.checked
      }
    });
  }

  openQr() {
    this.barCodeScanner
      .scan()
      .then((barcodeData: BarcodeScanResult) => {
        if (!barcodeData.cancelled) {
          const found = this.deliveries.find(x => {
            return x.consignmentNote.toLowerCase() == barcodeData.text.toLowerCase();
          });
          this.navCtrl.navigateForward("/delivery-check-list", {
            state: {
              items: [found]
            }
          });
        }
      })
      .catch(err => {
        console.log("Error", err);
      });
  }
}
