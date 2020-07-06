import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppMenuService, MenuItem } from './app-menu/app-menu.service';

import { AuthenticationService } from '@alfresco/adf-core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'adf-workbench-process30-src';
  appName = 'ADF Workbench';
  mainMenuItems;
  activeMenuItem$: Observable<MenuItem>;

  constructor(private router: Router,
              private menuService: AppMenuService,
              private authService: AuthenticationService) {
    this.updateMenu();

    this.menuService.menuChanged.subscribe((any) => {
      this.updateMenu();
    });
  }

  getCurrentUser() {
    return this.authService.getBpmUsername();
  }

  onLogout(event) {
    event.preventDefault();

    this.authService.logout()
      .subscribe(
        () => {
          this.navigateToLogin();
        },
        (error: any) => {
          if (error && error.response && error.response.status === 401) {
            this.navigateToLogin();
          } else {
            console.log('An unknown error occurred while logging out', error);
            this.navigateToLogin();
          }
        }
      );
  }

  navigateToLogin() {
    this.updateMenu();
    this.router.navigate(['/login']);
  }

  private updateMenu() {
    this.mainMenuItems = this.menuService.getMenuItems();
    this.activeMenuItem$ = this.menuService.activeMenuItem$;
  }
}
