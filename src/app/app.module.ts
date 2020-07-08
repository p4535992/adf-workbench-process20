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
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TRANSLATION_PROVIDER } from '@alfresco/adf-core';

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
    //MOD ABD
    /*
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
          deps: [HttpClient]
      }
    }),
    */
    // END MOD ABD
  ],
  providers: [
    AppMenuService,

    //MOD ABD https://github.com/ngx-translate/core/issues/186
    /*
    {
      provide: TranslateLoader,
      useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
      deps: [HttpClient]
    }
    */
   {
    provide: TRANSLATION_PROVIDER,
    multi: true,
    useValue: {
      name: 'app',
      source: 'assets'
    }
   }
    //END MOD ABD
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
