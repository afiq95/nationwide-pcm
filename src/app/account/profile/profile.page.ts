import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  option = "personal";
  vehicleMode = "M";
  plateNo = "WJS 5555";
  deliveryCode="shav 43";
  constructor() {}

  ngOnInit() {}
}
