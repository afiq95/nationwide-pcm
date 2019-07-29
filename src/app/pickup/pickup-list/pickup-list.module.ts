import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { PickupListPage } from "./pickup-list.page";
import { PcaHeaderComponentModule } from "src/app/components/pca-header/pca-header.module";
import { HeaderTrasformDirectiveModule } from "src/app/directive/header-trasform.directive.module";

const routes: Routes = [
  {
    path: "",
    component: PickupListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PcaHeaderComponentModule,
    HeaderTrasformDirectiveModule
  ],
  declarations: [PickupListPage]
})
export class PickupListPageModule {}
