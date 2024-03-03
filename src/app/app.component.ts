import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
 title = 'Home'
 menuOptions = [{name: 'Home', route: ''}, {name: 'Offline', route: 'offline'}];
 @ViewChild('drawer') drawer!: MatSidenav;

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) { }

  navigate(option: string) {
    this.drawer.close();
    this.router.navigate([option]).catch(error => console.log(error));
  }

  openUserMenu() {
    const config = {
      height: '500px',
      width: '300px',
      position: {
        top: '64px',
        right: '0'
      }
    };
    const dialogRef = this.dialog.open(UserMenuComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
}