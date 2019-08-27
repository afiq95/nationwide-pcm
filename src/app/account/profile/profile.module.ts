import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { PcaHeaderComponentModule } from "../../components/pca-header/pca-header.module";
import { HeaderTrasformDirectiveModule } from "../../directive/header-trasform.directive.module";

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
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
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
