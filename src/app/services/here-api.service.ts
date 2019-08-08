import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import Axios, { AxiosInstance } from "axios";
import { HttpClient } from "@angular/common/http";
import { HTTP } from "@ionic-native/http/ngx";
@Injectable({
  providedIn: "root"
})
export class HereAPIService {
  constructor(private http: HTTP) {}

  public async GetCoordinates(address: string) {
    address = address.trim();
    address = address.replace("NULL", " ");
    address = address.replace(" ", "+");
    const url = `https://geocoder.api.here.com/6.2/geocode.json?app_code=${
      environment.hereAppCode
    }&app_id=${environment.hereAppId}&searchText=${address}`;
    return await this.http.get(url, {}, {});
  }

  public async GetETA(fromLatitude, fromLongitude, destLatitude, destLongitude) {
    const url = `https://route.api.here.com/routing/7.2/calculateroute.json?waypoint0=${fromLatitude}%2C${fromLongitude}&waypoint1=${destLatitude}%2C${destLongitude}&mode=fastest%3Btruck%3Btraffic%3Aenabled&app_id=${
      environment.hereAppId
    }&app_code=${environment.hereAppCode}&departure=now`;
    return await this.http.get(url, {}, {});
  }
}
