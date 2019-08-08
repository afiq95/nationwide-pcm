import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class LoadingService {
  private loading: HTMLIonLoadingElement = null;
  constructor(private loadingCtrl: LoadingController) {}

  async PresentLoading() {
    if (this.loading) {
      await this.loading.present();
    } else {
      await this.create();
      await this.PresentLoading();
    }
  }

  async create() {
    this.loading = await this.loadingCtrl.create({
      animated: true,
      backdropDismiss: false,
      showBackdrop: true,
      spinner: "dots",
      keyboardClose: true
    });
  }

  async Dismiss() {
    await this.loading.dismiss();
    this.loading = null;
  }
}
