import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "tab1",
        children: [
          {
            path: "",
            loadChildren: "../tab1/tab1.module#Tab1PageModule"
          }
        ]
      },
      {
        path: "tab2",
        children: [
          {
            path: "",
            loadChildren: "../dashboard/dashboard.module#DashboardPageModule"
          }
        ]
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: "../delivery/delivery-list/delivery-list.module#DeliveryListPageModule"
          }
        ]
      },
      {
        path: "",
        redirectTo: "/tabs/tab1",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/tab1",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
