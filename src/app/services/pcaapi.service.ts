import { Injectable } from "@angular/core";
import Axios, { AxiosInstance } from "axios";
import { LocalStorageService } from "./local-storage.service";
import { environment } from "../../environments/environment";
import { NavController } from "@ionic/angular";
@Injectable({
  providedIn: "root"
})
export class PCAApiService {
  private axios: AxiosInstance;
  private token: string = "";

  constructor(private storage: LocalStorageService, private navCtrl: NavController) {}

  private async initAxios() {
    this.token = await this.storage.getApiToken();
    this.axios = Axios.create({
      baseURL: BASEURL,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + this.token
      }
    });
    this.axios.interceptors.response.use(
      item => {
        return item;
      },
      err => {
        if (err.response.status == 401)
          this.navCtrl.navigateRoot("/login", {
            replaceUrl: true
          });
      }
    );
  }

  async login(username: string, password: string) {
    return await Axios.post(BASEURL + "/api/authorization", {
      CourierId: username,
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

  async getPickupByRouteCode(routeCode) {
    await this.initAxios();
    return await this.axios.get("/api/pickup/routeCode/" + routeCode);
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
      DocumentPackageCount: item.docPkg,
      IsPickedUp: item.IsPickedUp,
      IsCompleted: item.IsCompleted,
      DeclinedReason: item.reason,
      PickupCode: item.pickupCode
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

  async getDuty() {
    await this.initAxios();
    const staffId = await this.storage.getStaffId();
    return await this.axios.get("/api/duty/" + staffId);
  }

  async GetPickupCount(item) {
    await this.initAxios();
    const staffId = await this.storage.getStaffId();
    return await this.axios.get(`/api/pickup/count/${staffId}/${item}`);
  }

  async InsertRoutingCode(item) {
    await this.initAxios();
    return await this.axios.post(`/api/routehistory`, item);
  }

  async MarkRoutingCodeExpired(item) {
    await this.initAxios();
    return await this.axios.put(`/api/routehistory/routeid/${item.Id}`);
  }

  async getDeliveries(routeCode) {
    await this.initAxios();
    return await this.axios.get(`/api/delivery/route/${routeCode}`);
  }

  async getDeliveryTasks(drsNo) {
    await this.initAxios();
    return await this.axios.get(`/api/delivery/tasks/${drsNo}`);
  }

  async failDeliveryTask(items) {
    await this.initAxios();
    return await this.axios.post(`/api/delivery/fail/`, items);
  }

  async successDeliveryTask(items) {
    await this.initAxios();
    return await this.axios.post(`/api/delivery/success/`, items);
  }

  async uploadDeliverySignature(drsNo, formdata) {
    let uploadInstance = Axios.create({
      baseURL: BASEURL,
      headers: { "Content-Type": "multipart/form-data", Authorization: "Bearer " + this.token }
    });
    var post = await uploadInstance.post("/api/image/delivery/signature/" + drsNo, formdata);
    return post;
  }

  async uploadPickupSignature(pickupId, formdata) {
    let uploadInstance = Axios.create({
      baseURL: BASEURL,
      headers: { "Content-Type": "multipart/form-data", Authorization: "Bearer " + this.token }
    });
    var post = await uploadInstance.post("/api/image/pickup/signature/" + pickupId, formdata);
    return post;
  }

  async sendPickupAttachment(pickupId, formdata) {
    let uploadInstance = Axios.create({
      baseURL: BASEURL,
      headers: { "Content-Type": "multipart/form-data", Authorization: "Bearer " + this.token }
    });
    var post = await uploadInstance.post("/api/image/pickup/attachment/" + pickupId, formdata);
    return post;
  }

  async SendDeliveryAttachment(drsNo, formData) {
    let uploadInstance = Axios.create({
      baseURL: BASEURL,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + this.token
      }
    });
    var post = await uploadInstance.post("/api/image/delivery/attachment/" + drsNo, formData);
    return post;
  }
}

const BASEURL: string = environment.apiUrl;
