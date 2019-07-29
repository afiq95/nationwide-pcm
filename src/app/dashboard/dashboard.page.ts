import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../services/local-storage.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage implements OnInit {
  constructor(private storage: LocalStorageService) {}

  ngOnInit() {}
}
