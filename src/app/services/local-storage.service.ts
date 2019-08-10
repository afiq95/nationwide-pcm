import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  constructor(private storage: Storage) {}

  async getApiToken() {
    return await this.storage.get(APITOKEN);
  }

  async setApiToken(item) {
    return await this.storage.set(APITOKEN, item);
  }

  async getFcmToken() {
    return await this.storage.get(FCMTOKEN);
  }

  async setFcmToken(item) {
    return await this.storage.set(FCMTOKEN, item);
  }

  async setUserId(item) {
    return await this.storage.set(USERID, item);
  }

  async getUserId() {
    return await this.storage.get(USERID);
  }

  async setStaffId(item) {
    return await this.storage.set(STAFFID, item);
  }

  async getStaffId() {
    return await this.storage.get(STAFFID);
  }

  async getDuty() {
    return await this.storage.get(ONDUTY);
  }

  async setVehicleMode(item) {
    return await this.storage.set(VEHICLEMODE, item);
  }

  async getVehicleMode() {
    return await this.storage.get(VEHICLEMODE);
  }

  async setDuty(item) {
    return await this.storage.set(ONDUTY, item);
  }

  async getDutyId() {
    const id = await this.storage.get(ONDUTYID);
    if (!id || id == "") return "";
    else return id;
  }

  async setDutyId(item) {
    return await this.storage.set(ONDUTYID, item);
  }

  async getCourierId() {
    return await this.storage.get(COURIERID);
  }

  async setCourierId(item) {
    return await this.storage.set(COURIERID, item);
  }

  async addPickupRouting(item) {
    var current = await this.getPickupRouting();
    current.push(item);
    return await this.setPickupRouting(current);
  }

  async addDeliveryRouting(item) {
    var current = await this.getDeliveryRouting();
    current.push(item);
    return await this.setDeliveryRouting(current);
  }

  async getPickupRouting() {
    const data = await this.storage.get(PICKUPROUTE);
    if (data) return data;
    else return [];
  }

  async removePickupRouting(id) {
    const data = await this.getPickupRouting();
    const index = data.findIndex(x => x.Id == id);
    data.splice(index, 1);
    return await this.setPickupRouting(data);
  }
  async removeDeliveryRouting(id) {
    const data = await this.getDeliveryRouting();
    const index = data.findIndex(x => x.Id == id);
    data.splice(index, 1);
    return await this.setDeliveryRouting(data);
  }

  async setPickupRouting(item) {
    return await this.storage.set(PICKUPROUTE, item);
  }

  async getDeliveryRouting() {
    const data = await this.storage.get(DELIVERYROUTE);
    if (data) return data;
    else return [];
  }

  async setDeliveryRouting(item) {
    return await this.storage.set(DELIVERYROUTE, item);
  }
}

const FCMTOKEN: string = "FCMTOKEN";
const APITOKEN: string = "APITOKEN";
const USERID: string = "USERID";
const STAFFID: string = "STAFFID";
const ONDUTY: string = "ONDUTY";
const ONDUTYID: string = "ONDUTYID";
const PICKUPROUTE: string = "PICKUPROUTE";
const DELIVERYROUTE: string = "DELIVERYROUTE";
const COURIERID: string = "COURIERID";
const VEHICLEMODE: string = "VEHICLEMODE";
