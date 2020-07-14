import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import {
  CoreModule,
  TRANSLATION_PROVIDER,
  TranslationService,
  TranslateLoaderService } from '@alfresco/adf-core'; //MOD 4535992 TRANSLATION_PROVIDER
import { ContentModule } from '@alfresco/adf-content-services';
import { ProcessModule } from '@alfresco/adf-process-services';
import { InsightsModule } from '@alfresco/adf-insights';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

export function modules() {
  return [
    /* Angular Core */
    CommonModule,

    /* Flex Layout */
    FlexLayoutModule,

    /* Alfresco ADF + Angular Material Components */
    CoreModule,
    ContentModule,
    ProcessModule,
    InsightsModule,

  ];
}

@NgModule({
  imports: [
    modules(),
  ],
  declarations: [],
  providers: [
    //MOD 4535992 COMMENTARE ????
    /*
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: 'app',
        source: 'assets'
      }
    },
    */
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
          name: 'app',
          source: 'assets'
      },
      useClass: TranslateLoaderService
    },
    {
      provide: TranslateLoader,
      useClass: TranslateLoaderService
    },
    //END MOD 4535992

  ],
  exports: modules()
})
export class AppCommonModule { }

