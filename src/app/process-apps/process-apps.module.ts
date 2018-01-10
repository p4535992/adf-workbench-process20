import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessAppsRoutingModule } from './process-apps-routing.module';
import { ProcessAppsPageComponent } from './process-apps-page/process-apps-page.component';
import { ProcessAppsListPageComponent } from './process-apps-list-page/process-apps-list-page.component';
import { ProcessAppsDetailsPageComponent } from './process-apps-details-page/process-apps-details-page.component';

import { AppCommonModule } from '../app-common/app-common.module';
import { ProcessDefinitionsListPageComponent } from './process-definitions-list-page/process-definitions-list-page.component';
import { ProcessDefinitionsDetailsPageComponent } from './process-definitions-details-page/process-definitions-details-page.component';
import { StartProcessPageComponent } from './start-process-page/start-process-page.component';

@NgModule({
  imports: [
    CommonModule,
    ProcessAppsRoutingModule,

    /* Common App imports (Angular Core and Material, ADF Core, Content, and Process */
    AppCommonModule
  ],
  declarations: [ProcessAppsPageComponent, ProcessAppsListPageComponent, ProcessAppsDetailsPageComponent, ProcessDefinitionsListPageComponent, ProcessDefinitionsDetailsPageComponent, StartProcessPageComponent]
})
export class ProcessAppsModule { }
