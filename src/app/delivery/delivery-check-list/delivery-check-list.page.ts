import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, AlertController, ToastController } from "@ionic/angular";
import { BarcodeScanner, BarcodeScanResult } from "@ionic-native/barcode-scanner/ngx";
import { QrCodeService } from "src/app/services/qr-code.service";

@Component({
  selector: "app-delivery-check-list",
  templateUrl: "./delivery-check-list.page.html",
  styleUrls: ["./delivery-check-list.page.scss"]
})
export class DeliveryCheckListPage implements OnInit {
  deliveries: any[] = [];
  existed: any[] = [];
  searchText = "";
  currentDrs = "";
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private barCodeScanner: BarcodeScanner,
    public alertController: AlertController,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state;
    console.log(state);
    if (state) {
      this.deliveries = state.items;
      this.existed = state.existed;
      this.currentDrs = this.deliveries[0].DrsNo;
    }
  }

  next() {
    this.navCtrl.navigateForward("/delivery-confirmation", {
      state: {
        items: this.deliveries
      }
    });
  }
  removeDelivery(item) {
    const index = this.deliveries.findIndex(x => {
      return x.Id == item.Id;
    });
    this.deliveries.splice(index, 1);
  }

  async add() {
    const isAdded = await this.checkAndAdd(this.searchText);
    if (isAdded) this.searchText = "";
  }

  async checkAndAdd(cnNo) {
    const found = this.existed.find(x => {
      return x.CnNo.toLowerCase() == cnNo.toLowerCase();
    });

    if (found) {
      if (found.DrsNo != this.currentDrs) {
        await this.presentInvalidDrs();
        return false;
      } else {
        const index = this.deliveries.findIndex(l => {
          return l.CnNo.toLowerCase() == found.CnNo.toLowerCase();
        });
        if (index == -1) {
          this.deliveries.push(found);
          await this.presentToast();
          return true;
        } else {
          await this.presentDuplicate();
        }
      }
    } else {
      this.presentInvalidCN();
      return false;
    }
  }

  async openQr() {
    this.barCodeScanner
      .scan()
      .then(async (barcodeData: BarcodeScanResult) => {
        if (!barcodeData.cancelled) {
          await this.checkAndAdd(barcodeData.text.substring(0, 8).toLowerCase());
        }
      })
      .catch(err => {
        console.log("Error", err);
      });
  }

  async presentInvalidDrs() {
    const alert = await this.alertController.create({
      header: "Invalid CN",
      message: "Scanned CN Number isn't in current DRS",
      buttons: ["OK"]
    });

    await alert.present();
  }

  async presentInvalidCN() {
    const alert = await this.alertController.create({
      header: "Invalid CN",
      message: "Scanned CN Number isn't invalid ",
      buttons: ["OK"]
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Scanned CN Number is added",
      duration: 2000,
      showCloseButton: true,
      position: "top",
      color: "success",
      animated: true,
      keyboardClose: true
    });
    await toast.present();
  }

  async presentDuplicate() {
    const toast = await this.toastController.create({
      message: "Duplicate CN number scanned",
      duration: 2000,
      showCloseButton: true,
      position: "top",
      color: "danger",
      animated: true,
      keyboardClose: true
    });
    toast.present();
  }
}
