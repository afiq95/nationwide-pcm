import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SignatureFormPage } from "./signature-form.page";
import { SignaturePadModule } from "angular2-signaturepad";
import { HeaderTrasformDirectiveModule } from "src/app/directive/header-trasform.directive.module";
import { PcaHeaderComponentModule } from "src/app/components/pca-header/pca-header.module";

const routes: Routes = [
  {
    path: "",
    component: SignatureFormPage
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
  declarations: [SignatureFormPage]
})
export class SignatureFormPageModule {}
