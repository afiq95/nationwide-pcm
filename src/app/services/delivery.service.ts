import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class DeliveryService {
  constructor() {}

  getDeliveries() {
    return [
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
  }
}
