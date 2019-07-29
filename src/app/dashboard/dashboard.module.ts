import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { DashboardPage } from "./dashboard.page";
import { PcaHeaderComponentModule } from "../components/pca-header/pca-header.module";
import { HeaderTrasformDirective } from "../directive/header-trasform.directive";
import { HeaderTrasformDirectiveModule } from "../directive/header-trasform.directive.module";

const routes: Routes = [
  {
    path: "",
    component: DashboardPage
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
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
