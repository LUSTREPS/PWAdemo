import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

import { ViewRoutingModule } from './view-routing.module';
import { ViewComponent } from './view/view.component';


@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
    ViewRoutingModule,
    MatIconModule
  ]
})
export class ViewModule { }
