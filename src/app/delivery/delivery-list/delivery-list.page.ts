import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-delivery-list",
  templateUrl: "./delivery-list.page.html",
  styleUrls: ["./delivery-list.page.scss"]
})
export class DeliveryListPage implements OnInit {
  checked: any[] = [];
  deliveries: any[] = [
    {
      isChecked: false,
      id: 1,
      consignmentNote: "EN1"
    },
    {
      isChecked: false,
      id: 2,
      consignmentNote: "EN2"
    },
    {
      isChecked: false,
      id: 3,
      consignmentNote: "EN3"
    },
    {
      isChecked: false,
      id: 4,
      consignmentNote: "EN4"
    },
    {
      isChecked: false,
      id: 6,
      consignmentNote: "EN5"
    },
    {
      isChecked: false,
      id: 7,
      consignmentNote: "EN6"
    },
    {
      isChecked: false,
      id: 8,
      consignmentNote: "EN7"
    },
    {
      isChecked: false,
      id: 9,
      consignmentNote: "EN8"
    }
  ];
  constructor() {}

  ngOnInit() {}

  checkChecked($event, delivery) {
    if ($event.detail.checked) this.checked.push(delivery);
    else {
      const index = this.checked.findIndex(x => {
        return x.id == delivery.id;
      });
      this.checked.splice(index, 1);
    }
  }

  addNumber() {}
}
