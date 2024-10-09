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
import { ChatComponent } from '../chat/chat.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButton, IonIcon],
  providers: [ModalController],
})
export class HomeComponent {
  selectedRoom: string = '';

  constructor(
    public auth: AuthService,
    public spinner: NgxSpinnerService,
    private router: Router,
    private modalController: ModalController
  ) {
    addIcons({ arrowRedoCircleOutline });
  }

  async selectRoom(room: string) {
    const modal = await this.modalController.create({
      component: ChatComponent,
      componentProps: { room },
    });
    return await modal.present();
  }

  handleLogout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
