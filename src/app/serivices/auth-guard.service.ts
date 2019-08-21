import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { LocalStorageService } from "../services/local-storage.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private storage: LocalStorageService) {}

  async canActivate(): Promise<boolean> {
    const uid = await this.storage.getUserId();
    const token = await this.storage.getApiToken();
    const tokenRefresh = await this.storage.getRefreshToken();
    if (uid && token && tokenRefresh) return true;
    else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
