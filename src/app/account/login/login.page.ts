import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { PCAApiService } from "src/app/services/pcaapi.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { FcmService } from "src/app/services/fcm.service";
import { LoadingService } from "src/app/services/loading.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  myForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private apiService: PCAApiService,
    private storage: LocalStorageService,
    private fcm: FcmService,
    private loading: LoadingService
  ) {
    this.myForm = this.formBuilder.group({
      Username: ["", Validators.required],
      Password: ["", Validators.required]
    });
  }

  ngOnInit() {}

  async Login() {
    await this.loading.PresentLoading();
    const res = await this.apiService.login(this.myForm.value.Username, this.myForm.value.Password);
    await this.storage.setApiToken(res.data.token);
    await this.storage.setUserId(res.data.UserId);
    await this.storage.setStaffId(res.data.StaffId);
    await this.storage.setCourierId(this.myForm.value.Username);
    // const token = await this.fcm.initToken();
    // await this.apiService.updateFcmToken(token, res.data.UserId);
    this.router
      .navigate(["/tabs/dashboard"], {
        replaceUrl: true
      })
      .then(() => {
        this.loading.Dismiss();
      });
  }
}