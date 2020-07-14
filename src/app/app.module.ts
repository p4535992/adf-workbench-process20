import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppCommonModule } from './app-common/app-common.module';
import { AppLoginRoutingModule } from './app-login/app-login-routing.module';
import { AppLoginModule } from './app-login/app-login.module';
import { AppMenuService } from './app-menu/app-menu.service';

import { ProcessAppsModule } from './process-apps/process-apps.module';
import { ProcessAppsRoutingModule } from './process-apps/process-apps-routing.module';
import { MyTasksModule } from './my-tasks/my-tasks.module';
import { MyTasksRoutingModule } from './my-tasks/my-tasks-routing.module';
import { MyProcessesModule } from './my-processes/my-processes.module';
import { MyProcessesRoutingModule } from './my-processes/my-processes-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  TRANSLATION_PROVIDER,
  AppConfigService,
  DebugAppConfigService,
  TranslationService,
  TranslateLoaderService,
  AuthBearerInterceptor,
  AuthenticationService,
  AlfrescoApiService,
  StorageService,
  LogService,
  NotificationService,
  UserPreferencesService } from '@alfresco/adf-core';

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    AppCommonModule,
    AppLoginModule,
    AppLoginRoutingModule,
    ProcessAppsModule,
    ProcessAppsRoutingModule,
    MyTasksModule,
    MyTasksRoutingModule,
    MyProcessesModule,
    MyProcessesRoutingModule,
    BrowserAnimationsModule,
    //MOD 4535992
    // ngx-translate and the loader module
    HttpClientModule,

    TranslateModule.forRoot(),
    /*
      {
        loader: {
          provide: TRANSLATION_PROVIDER,
          multi: true,
          useValue: {
              name: 'app',
              source: 'assets'
          }
        }
      }
    ),
    */
    // END MOD 4535992
  ],
  providers: [
    AppMenuService,
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
    /*
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      //useValue: {
      //  name: 'app',
      //  source: 'assets'
      //},
      useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
      useExisting: true,
      deps: [HttpClient]
    },
    */
   /*
    {
      provide: TranslateLoader,
      // useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    */

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthBearerInterceptor,
      multi: true
    },
    /*
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    */
    AlfrescoApiService,
    StorageService,
    LogService,
    NotificationService,
    TranslateService,
    TranslationService,
    UserPreferencesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
