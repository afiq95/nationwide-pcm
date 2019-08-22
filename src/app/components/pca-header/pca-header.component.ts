import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { Events, AlertController } from "@ionic/angular";
import { PCAApiService } from "src/app/services/pcaapi.service";

@Component({
  selector: "app-pca-header",
  templateUrl: "./pca-header.component.html",
  styleUrls: ["./pca-header.component.scss"]
})
export class PcaHeaderComponent implements OnInit {
  isOnDuty = false;
  constructor(
    private storage: LocalStorageService,
    private event: Events,
    private api: PCAApiService,
    public alertController: AlertController
  ) {}

  async ngOnInit() {
    this.isOnDuty = await this.storage.getDuty();
    this.event.subscribe("dutyChanged", item => {
      this.storage.setDuty(item).then(() => {
        this.isOnDuty = item;
      });
    });
  }

  async changeStatus() {
    if (!this.isOnDuty) {
      const started = await this.api.startDuty();
      await this.storage.setDutyId(started.data.Id);
      this.event.publish("dutyChanged", true);
      await this.storage.setDuty(true);
      this.isOnDuty = true;
    } else {
      const alert = await this.alertController.create({
        header: "Off Duty?",
        message: "Are you sure you are going off duty",
        buttons: [
          {
            text: "Yes",
            handler: async () => {
              await this.api.stopDuty();
              await this.storage.setDutyId("");
              await this.storage.setDuty(false);
              this.isOnDuty = false;
            }
          },
          {
            text: "No",
            handler: () => {
              this.isOnDuty = true;
            }
          }
        ]
      });
      await alert.present();
    }
  }
}
