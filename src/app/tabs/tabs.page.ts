import { Component, OnInit } from "@angular/core";
import { PCAApiService } from "../services/pcaapi.service";
import { FcmService } from "../services/fcm.service";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"]
})
export class TabsPage implements OnInit {
  constructor(private fcm: FcmService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fcm.initToken();
  }
}
