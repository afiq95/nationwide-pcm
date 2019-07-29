import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { CompletedDeliveryPage } from "./completed-delivery.page";
import { HeaderTrasformDirectiveModule } from "src/app/directive/header-trasform.directive.module";
import { PcaHeaderComponentModule } from "src/app/components/pca-header/pca-header.module";

const routes: Routes = [
  {
    path: "",
    component: CompletedDeliveryPage
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
  declarations: [CompletedDeliveryPage]
})
export class CompletedDeliveryPageModule {}
