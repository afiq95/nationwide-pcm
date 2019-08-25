import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { DeliveryConfirmationPage } from "./delivery-confirmation.page";
import { PcaHeaderComponentModule } from "src/app/components/pca-header/pca-header.module";
import { HeaderTrasformDirectiveModule } from "src/app/directive/header-trasform.directive.module";
import { SignaturePadModule } from "angular2-signaturepad";

const routes: Routes = [
  {
    path: "",
    component: DeliveryConfirmationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HeaderTrasformDirectiveModule,
    PcaHeaderComponentModule,
    SignaturePadModule
  ],
  declarations: [DeliveryConfirmationPage]
})
export class DeliveryConfirmationPageModule {}
