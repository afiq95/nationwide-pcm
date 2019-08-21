import { Component, OnInit } from "@angular/core";
import { DeliveryService } from "src/app/services/delivery.service";
import { NavController } from "@ionic/angular";
import { BarcodeScanner, BarcodeScanResult } from "@ionic-native/barcode-scanner/ngx";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { LoadingService } from "src/app/services/loading.service";
import { PCAApiService } from "src/app/services/pcaapi.service";

@Component({
  selector: "app-delivery-list",
  templateUrl: "./delivery-list.page.html",
  styleUrls: ["./delivery-list.page.scss"]
})
export class DeliveryListPage {
  checked: any[] = [];
  deliveries: any[] = [];
  dataDeliveries: any[] = [];
  deliDRSes: any[] = [];
  completedDeliveries: any[] = [];
  status = "pending";
  constructor(
    private api: PCAApiService,
    private navCtrl: NavController,
    private barCodeScanner: BarcodeScanner,
    private storage: LocalStorageService,
    private loading: LoadingService
  ) {}

  async ionViewWillLeave() {
    this.checked = [];
    this.completedDeliveries = [];
    this.deliveries = [];
    this.dataDeliveries = [];
    this.deliDRSes = [];
  }
  async ionViewWillEnter() {
    await this.loading.PresentLoading();
    // this.deliveries
    //   .filter(x => x.isChecked)
    //   .forEach(y => {
    //     y.isChecked = false;
    //   });
    await this.loading.changeText("Fetching DRS");
    const deliveryRoute = await this.storage.getDeliveryRouting();
    for (const item of deliveryRoute) {
      const data = (await this.api.getDeliveries(item.RouteCode)).data.Results;
      this.deliDRSes.push(...data);
    }

    for (const deli of this.deliDRSes) {
      const data = await this.api.getDeliveryTasks(deli.DrsNo);
      const successful = data.data.Results.filter(f => {
        return f.IsSuccessful || f.IsFailed;
      });
      const pendings = data.data.Results.filter(f => {
        return !f.IsSuccessful && !f.IsFailed;
      });
      this.dataDeliveries.push(...pendings);
      this.completedDeliveries.push(...successful);
      this.deliveries = this.dataDeliveries;
    }
    await this.loading.Dismiss();
  }

  checkChecked($event, delivery) {
    if ($event.detail.checked) this.checked.push(delivery);
    else {
      const index = this.checked.findIndex(x => {
        return x.Id == delivery.Id;
      });
      this.checked.splice(index, 1);
    }
  }

  clearAll() {
    this.checked = [];
    this.dataDeliveries
      .filter(x => x.isChecked)
      .forEach(y => {
        y.isChecked = false;
      });
    this.deliveries = this.dataDeliveries;
  }

  proceed() {
    this.navCtrl.navigateForward("/delivery-check-list", {
      state: {
        items: this.checked,
        existed: this.dataDeliveries
      }
    });
  }

  openQr() {
    this.barCodeScanner
      .scan()
      .then((barcodeData: BarcodeScanResult) => {
        if (!barcodeData.cancelled) {
          const found = this.dataDeliveries.find(x => {
            return x.CnNo.toLowerCase() == barcodeData.text.substring(0, 8).toLowerCase();
          });
          this.navCtrl.navigateForward("/delivery-check-list", {
            state: {
              items: [found],
              existed: this.dataDeliveries
            },
            replaceUrl: true
          });
        }
      })
      .catch(err => {
        console.log("Error", err);
      });
  }

  change(item) {
    this.status = item;
  }

  searchCn(item) {
    if (item.detail.value == "") {
      this.deliveries = this.dataDeliveries;
      return;
    }
    const found = this.dataDeliveries.filter(x => {
      console.log(x.CnNo.toLowerCase());
      return x.CnNo.toLowerCase().search(item.detail.value.toLowerCase()) > -1;
    });

    this.deliveries = found;
  }
}
