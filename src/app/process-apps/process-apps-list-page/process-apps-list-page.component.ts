import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppDefinitionRepresentationModel } from '@alfresco/adf-process-services';


@Component({
  selector: 'app-process-apps-list-page',
  templateUrl: './process-apps-list-page.component.html',
  styleUrls: ['./process-apps-list-page.component.scss']
})
export class ProcessAppsListPageComponent implements OnInit {
  processAppsFilter = [ { tenantId: 1 } ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onAppClick(appDef: AppDefinitionRepresentationModel) {
    console.log('Navigating to App Definition : ', appDef);

    this.router.navigate(['/process-apps', appDef.id]);
  }

}
