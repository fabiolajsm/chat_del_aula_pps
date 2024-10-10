import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { addIcons } from 'ionicons';
import { arrowRedoCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButton, IonIcon],
})
export class HomeComponent {
  selectedRoom: string = '';

  constructor(
    public auth: AuthService,
    public spinner: NgxSpinnerService,
    private router: Router
  ) {
    addIcons({ arrowRedoCircleOutline });
  }

  async selectRoom(room: string) {
    localStorage.setItem('room', room);
    this.router.navigate(['chat']);
  }

  handleLogout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
