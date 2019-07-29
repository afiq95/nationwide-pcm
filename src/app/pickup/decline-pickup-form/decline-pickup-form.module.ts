import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DeclinePickupFormPage } from './decline-pickup-form.page';

const routes: Routes = [
  {
    path: '',
    component: DeclinePickupFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DeclinePickupFormPage]
})
export class DeclinePickupFormPageModule {}
