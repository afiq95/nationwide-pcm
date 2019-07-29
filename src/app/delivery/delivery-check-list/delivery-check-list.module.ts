import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { DeliveryCheckListPage } from "./delivery-check-list.page";
import { PcaHeaderComponentModule } from "src/app/components/pca-header/pca-header.module";
import { HeaderTrasformDirectiveModule } from "src/app/directive/header-trasform.directive.module";

const routes: Routes = [
  {
    path: "",
    component: DeliveryCheckListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HeaderTrasformDirectiveModule,
    PcaHeaderComponentModule
  ],
  declarations: [DeliveryCheckListPage]
})
export class DeliveryCheckListPageModule {}
