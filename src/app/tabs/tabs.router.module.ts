import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "dashboard",
        children: [
          {
            path: "",
            loadChildren: "../dashboard/dashboard.module#DashboardPageModule"
          },
          {
            path: "route",
            loadChildren: "../routeCode/view-all/view-all.module#ViewAllPageModule"
          }
        ]
      },
      {
        path: "delivery-list",
        children: [
          {
            path: "",
            loadChildren: "../delivery/delivery-list/delivery-list.module#DeliveryListPageModule"
          },
          {
            path: "completed",
            loadChildren:
              "../delivery/completed-delivery/completed-delivery.module#CompletedDeliveryPageModule"
          }
        ]
      },
      {
        path: "pickup-list",
        children: [
          {
            path: "",
            loadChildren: "../pickup/pickup-list/pickup-list.module#PickupListPageModule"
          }
        ]
      },
      {
        path: "",
        redirectTo: "/tabs/dashboard",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/dashboard",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
