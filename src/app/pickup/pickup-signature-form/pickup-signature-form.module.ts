import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { PickupSignatureFormPage } from "./pickup-signature-form.page";
import { SignaturePadModule } from "angular2-signaturepad";
import { HeaderTrasformDirective } from "src/app/directive/header-trasform.directive";
import { HeaderTrasformDirectiveModule } from "src/app/directive/header-trasform.directive.module";
import { PcaHeaderComponentModule } from "src/app/components/pca-header/pca-header.module";

const routes: Routes = [
  {
    path: "",
    component: PickupSignatureFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SignaturePadModule,
    HeaderTrasformDirectiveModule,
    PcaHeaderComponentModule
  ],
  declarations: [PickupSignatureFormPage]
})
export class PickupSignatureFormPageModule {}
