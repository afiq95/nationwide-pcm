import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { PickupDetailsPage } from "./pickup-details.page";
import { HeaderTrasformDirectiveModule } from "src/app/directive/header-trasform.directive.module";
import { PcaHeaderComponentModule } from "src/app/components/pca-header/pca-header.module";

const routes: Routes = [
  {
    path: "",
    component: PickupDetailsPage
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
  declarations: [PickupDetailsPage]
})
export class PickupDetailsPageModule {}
