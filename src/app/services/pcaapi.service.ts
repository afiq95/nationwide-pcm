import { Injectable } from "@angular/core";
import Axios, { AxiosInstance } from "axios";
import { LocalStorageService } from "./local-storage.service";
@Injectable({
  providedIn: "root"
})
export class PCAApiService {
  private axios: AxiosInstance;
  private token: string = "";
  constructor(private storage: LocalStorageService) {}

  private async initAxios() {
    this.token = await this.storage.getApiToken();
    this.axios = Axios.create({
      baseURL: BASEURL,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + this.token
      }
    });
  }

  async login(username: string, password: string) {
    return await Axios.post(BASEURL + "/api/authorization", {
      Username: username,
      Password: password
    });
  }

  async updateFcmToken(token: string, userId: string) {
    await this.initAxios();
    return await this.axios.post("/api/fcmtokens", {
      FcmToken: token,
      UserId: userId
    });
  }

  async getPickupListings() {
    await this.initAxios();
    const staffId = await this.storage.getStaffId();
    return await this.axios.get("/api/pickup/userid/" + staffId);
  }

  async acceptTask(taskId) {
    await this.initAxios();
    return await this.axios.post("/api/pickup/" + taskId + "/accept");
  }

  async declineTask(task) {
    await this.initAxios();
    return await this.axios.post("/api/pickup/decline", task);
  }

  async completeTask(item) {
    await this.initAxios();
    return await this.axios.post("/api/pickup/" + item.taskId + "/complete", {
      ParcelConsignmentCount: item.parcelCn,
      ParcelPackageCount: item.parcelPkg,
      DocumentConsignmentCount: item.docCn,
      DocumentPacakageCount: item.docPkg,
      PickupCode: item.pickupStatus
    });
  }

  async startDuty() {
    await this.initAxios();
    const staffId = await this.storage.getStaffId();
    return await this.axios.post("/api/duty/" + staffId + "/start");
  }

  async stopDuty() {
    await this.initAxios();
    const staffId = await this.storage.getDutyId();
    return await this.axios.post("/api/duty/" + staffId + "/stop");
  }
}

const BASEURL: string = "http://192.168.0.37:57163";
