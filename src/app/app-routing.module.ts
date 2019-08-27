import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "./serivices/auth-guard.service";

const routes: Routes = [
  { path: "", loadChildren: "./tabs/tabs.module#TabsPageModule", canActivate: [AuthGuardService] },
  {
    path: "delivery-list",
    loadChildren: "./delivery/delivery-list/delivery-list.module#DeliveryListPageModule"
  },
  { path: "dashboard", loadChildren: "./dashboard/dashboard.module#DashboardPageModule" },
  {
    path: "delivery-confirmation",
    loadChildren:
      "./delivery/delivery-confirmation/delivery-confirmation.module#DeliveryConfirmationPageModule"
  },
  {
    path: "delivery-check-list",
    loadChildren:
      "./delivery/delivery-check-list/delivery-check-list.module#DeliveryCheckListPageModule"
  },
  {
    path: "signature-form",
    loadChildren: "./signature/signature-form/signature-form.module#SignatureFormPageModule"
  },
  {
    path: "completed-delivery",
    loadChildren:
      "./delivery/completed-delivery/completed-delivery.module#CompletedDeliveryPageModule"
  },
  {
    path: "pickup-list",
    loadChildren: "./pickup/pickup-list/pickup-list.module#PickupListPageModule"
  },
  {
    path: "pickup-details",
    loadChildren: "./pickup/pickup-details/pickup-details.module#PickupDetailsPageModule"
  },
  {
    path: "pickup-signature-form",
    loadChildren:
      "./pickup/pickup-signature-form/pickup-signature-form.module#PickupSignatureFormPageModule"
  },
  {
    path: "decline-pickup-form",
    loadChildren:
      "./pickup/decline-pickup-form/decline-pickup-form.module#DeclinePickupFormPageModule"
  },
  {
    path: "pickup-completed",
    loadChildren: "./pickup/pickup-completed/pickup-completed.module#PickupCompletedPageModule"
  },
  { path: "login", loadChildren: "./account/login/login.module#LoginPageModule" },
  { path: 'view-all', loadChildren: './routeCode/view-all/view-all.module#ViewAllPageModule' },  { path: 'profile', loadChildren: './account/profile/profile.module#ProfilePageModule' }

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
