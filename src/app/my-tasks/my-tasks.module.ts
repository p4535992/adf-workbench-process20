import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTasksRoutingModule } from './my-tasks-routing.module';
import { MyTasksPageComponent } from './my-tasks-page/my-tasks-page.component';
import { MyTasksListPageComponent } from './my-tasks-list-page/my-tasks-list-page.component';
import { MyTasksDetailsPageComponent } from './my-tasks-details-page/my-tasks-details-page.component';

import { AppCommonModule } from '../app-common/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    MyTasksRoutingModule,

    /* Common App imports (Angular Core and Material, ADF Core, Content, and Process */
    AppCommonModule
  ],
  declarations: [MyTasksPageComponent, MyTasksListPageComponent, MyTasksDetailsPageComponent]
})
export class MyTasksModule { }
