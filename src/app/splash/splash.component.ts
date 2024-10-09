import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  standalone: true,
  imports: [IonContent, CommonModule],
})
export class SplashComponent {
  constructor(public router: Router) {
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 4000);
  }
}
