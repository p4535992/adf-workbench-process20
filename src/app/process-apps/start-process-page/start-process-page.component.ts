import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProcessInstance, StartProcessInstanceComponent } from '@alfresco/adf-process-services';
import { AppsProcessService, NotificationService } from '@alfresco/adf-core';

import { AppDefinitionRepresentation } from 'alfresco-js-api';

@Component({
  selector: 'app-start-process-page',
  templateUrl: './start-process-page.component.html',
  styleUrls: ['./start-process-page.component.scss']
})
export class StartProcessPageComponent implements OnInit {
  appDef: AppDefinitionRepresentation;
  @ViewChild(StartProcessInstanceComponent)
  startProcessForm: StartProcessInstanceComponent;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private processAppService: AppsProcessService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    const appId: number = +this.activatedRoute.snapshot.params['process-app-id'];
    console.log('Start Process for app: ', appId);
    this.processAppService.getApplicationDetailsById(appId).subscribe(
      (appDef: AppDefinitionRepresentation) => {
        this.appDef = appDef;
      },
      (error) => {
        console.log('Error: ', error);
      });
  }

  onGoBack($event: Event) {
    this.navigateBack2AppList();
  }

  private navigateBack2AppList() {
    this.router.navigate(['../'],
      {
        relativeTo: this.activatedRoute
      });
  }

  onStartProcessInstance(procInstance: ProcessInstance) {
    console.log('Started process instance: ', procInstance.id);
    this.notificationService.openSnackMessage(
      `Successfully started process instance ('${procInstance.id}') for Process App ${this.appName}`,
      4000);
    this.startProcessForm.reset();

  }

  onCancelProcessInstance() {
    console.log('Starting Process was cancelled.');
    this.startProcessForm.reset();
  }

  onStartError(error: any) {
    console.log('There was an error starting process: ', error);
    this.notificationService.openSnackMessage(
      `Failed to start process instance for Process App ${this.appName} error = ${error}`,
      4000);
  }}
