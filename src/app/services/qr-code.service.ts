import { Injectable } from "@angular/core";
import { BarcodeScanner, BarcodeScanResult } from "@ionic-native/barcode-scanner/ngx";

@Injectable({
  providedIn: "root"
})
export class QrCodeService {
  constructor(private barCodeScanner: BarcodeScanner) {}

  async openQr() {
    return await this.barCodeScanner.scan();
  }
}
