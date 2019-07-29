import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PcaHeaderComponent } from './pca-header.component';

@NgModule({
  imports: [ CommonModule, FormsModule,IonicModule,],
  declarations: [PcaHeaderComponent],
  exports: [PcaHeaderComponent]
})
export class PcaHeaderComponentModule {}
