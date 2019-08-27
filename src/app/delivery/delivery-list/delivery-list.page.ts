import { Component, OnInit } from "@angular/core";
import { DeliveryService } from "src/app/services/delivery.service";
import { NavController, AlertController } from "@ionic/angular";
import { BarcodeScanner, BarcodeScanResult } from "@ionic-native/barcode-scanner/ngx";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { LoadingService } from "src/app/services/loading.service";
import { PCAApiService } from "src/app/services/pcaapi.service";
import { delay } from "q";

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
    private loading: LoadingService,
    public alertController: AlertController
  ) {}

  async ionViewWillLeave() {
    this.checked = [];
    this.completedDeliveries = [];
    this.deliveries = [];
    this.dataDeliveries = [];
    this.deliDRSes = [];
  }
  async ionViewWillEnter() {
    var retry = false;
    while (!retry) {
      try {
        await this.initData();
        retry = true;
      } catch (ex) {
        const alert = await this.alertController.create({
          animated: true,
          backdropDismiss: false,
          message: "Error getting deliveries",
          header: "Error",
          buttons: [
            {
              text: "Retry"
            },
            {
              text: "Cancel",
              handler: () => {
                this.navCtrl.navigateRoot("/tabs/dashboard", { replaceUrl: true });
              }
            }
          ]
        });
        await alert.present();
      }
    }
  }

  async initData() {
    var drs = false;
    var delifetch = false;
    await this.loading.PresentLoading();
    this.loading.changeText("Fetching DRS");
    while (!drs) {
      const deliveryRoute = await this.storage.getDeliveryRouting();
      try {
        this.deliDRSes = [];
        for (const item of deliveryRoute) {
          const data = (await this.api.getDeliveries(item.RouteCode)).data.Results;
          this.deliDRSes.push(...data);
        }
        drs = true;
      } catch (error) {
        this.loading.changeText("Retrying DRS Fetch");
        await delay(1500);
      }
    }

    this.loading.changeText("Fetching Task");
    while (!delifetch) {
      try {
        this.dataDeliveries = [];
        this.completedDeliveries = [];
        this.deliveries = [];
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
        delifetch = true;
      } catch (error) {
        this.loading.changeText("Retrying Task Fetch");
        await delay(1500);
      }
    }
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
    this.deliveries.push({
      CnNo: "BBBBBBBB",
      Pieces: "10",
      DrsNo:"BBBBBBBBB",
      CustomerNo:"BBBBBB"
    },)
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
