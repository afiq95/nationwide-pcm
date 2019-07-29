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

  async setDuty(item) {
    return await this.storage.set(ONDUTY, item);
  }

  async getDutyId() {
    return await this.storage.get(ONDUTYID);
  }

  async setDutyId(item) {
    return await this.storage.set(ONDUTYID, item);
  }
}

const APITOKEN: string = "APITOKEN";
const USERID: string = "USERID";
const STAFFID: string = "STAFFID";
const ONDUTY: string = "ONDUTY";
const ONDUTYID: string = "ONDUTYID";
