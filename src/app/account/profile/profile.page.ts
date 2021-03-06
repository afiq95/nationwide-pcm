import { Component, OnInit } from "@angular/core";
import { AlertController, ToastController } from "@ionic/angular";
import { alertController } from "@ionic/core";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { PCAApiService } from "src/app/services/pcaapi.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  option = "personal";
  vehicleMode = "M";
  plateNo = "WJS 5555";
  deliveryCode = "shav 43";
  pickupRouting: any[] = [];
  deliveryRouting: any[] = [];

  constructor(
    public alertController: AlertController,
    private api: PCAApiService,
    private storage: LocalStorageService,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    this.pickupRouting = await this.storage.getPickupRouting();
    this.deliveryRouting = await this.storage.getDeliveryRouting();
  }

  async addPickupRouting() {
    const alert = await this.alertController.create({
      header: "Add Pickup Routing Code",
      message: "Enter your pickup routing code",
      inputs: [
        {
          type: "text",
          placeholder: "Routing Code",
          name: "pickupCode",
          id: "pickupCode"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Add",
          handler: async item => {
            const regex = /[a-zA-Z]{4}[0-9][0-9]/;
            if (!item.pickupCode.match(regex)) {
              const toast = await this.toast.create({
                message: "Please insert delivery code",
                duration: 3000
              });
              toast.present();
              await this.addPickupRouting();
            } else {
              var data: any = {
                RouteCode: item.pickupCode,
                IsPickupCode: true,
                IsDeliveryCode: false,
                IsExpired: false,
                StaffId: await this.storage.getStaffId()
              };
              const res = await this.api.InsertRoutingCode(data);
              data.Id = res.data.Id;
              await this.storage.addPickupRouting(data);
              this.pickupRouting = await this.storage.getPickupRouting();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async addDeliveryRouting() {
    const alert = await this.alertController.create({
      header: "Add Delivery Routing Code",
      message: "Enter your delivery routing code",
      inputs: [
        {
          type: "text",
          placeholder: "Routing Code",
          name: "deliCode",
          id: "deliCode"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Add",
          handler: async item => {
            const regex = /[a-zA-Z]{4}[0-9][0-9]/;
            if (!item.deliCode.match(regex)) {
              const toast = await this.toast.create({
                message: "Please insert delivery code",
                duration: 3000
              });
              toast.present();
              await this.addPickupRouting();
            } else {
              var data: any = {
                RouteCode: item.deliCode,
                IsPickupCode: false,
                IsDeliveryCode: true,
                IsExpired: false,
                StaffId: await this.storage.getStaffId()
              };
              const res = await this.api.InsertRoutingCode(data);
              data.Id = res.data.Id;
              await this.storage.addDeliveryRouting(data);
              this.deliveryRouting = await this.storage.getDeliveryRouting();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async removePickupRouting(route) {
    if (route.IsPickupCode) {
      const alert = await this.alertController.create({
        header: "Delete Pickup Routing Code",
        message: `Are you sure to delete pickup routing code : ${route.RouteCode}?`,

        buttons: [
          {
            text: "Yes",
            handler: async () => {
              await this.api.MarkRoutingCodeExpired(route);
              await this.storage.removePickupRouting(route.Id);
              this.pickupRouting = await this.storage.getPickupRouting();
            }
          },
          {
            text: "No",
            role: "cancel"
          }
        ]
      });

      await alert.present();
    }
  }
  async removeDeliveryRouting(route) {
    if (route.IsDeliveryCode) {
      const alert = await this.alertController.create({
        header: "Delete Delivery Routing Code",
        message: `Are you sure to delete delivery routing code : ${route.RouteCode}?`,

        buttons: [
          {
            text: "Yes",
            handler: async () => {
              await this.api.MarkRoutingCodeExpired(route);
              await this.storage.removeDeliveryRouting(route.Id);
              this.deliveryRouting = await this.storage.getDeliveryRouting();
            }
          },
          {
            text: "No",
            role: "cancel"
          }
        ]
      });

      await alert.present();
    }
  }

  async updateProfile() {
    console.log("Update");
  }
}
