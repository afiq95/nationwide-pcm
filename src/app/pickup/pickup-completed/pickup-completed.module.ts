import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PickupCompletedPage } from './pickup-completed.page';

const routes: Routes = [
  {
    path: '',
    component: PickupCompletedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PickupCompletedPage]
})
export class PickupCompletedPageModule {}
