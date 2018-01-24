import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProcessesRoutingModule } from './my-processes-routing.module';
import { MyProcessesPageComponent } from './my-processes-page/my-processes-page.component';
import { MyProcessesListPageComponent } from './my-processes-list-page/my-processes-list-page.component';
import { MyProcessesDetailsPageComponent } from './my-processes-details-page/my-processes-details-page.component';

import { AppCommonModule } from '../app-common/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    MyProcessesRoutingModule,

    /* Common App imports (Angular Core and Material, ADF Core, Content, and Process */
    AppCommonModule
  ],
  declarations: [MyProcessesPageComponent, MyProcessesListPageComponent, MyProcessesDetailsPageComponent]
})
export class MyProcessesModule { }
