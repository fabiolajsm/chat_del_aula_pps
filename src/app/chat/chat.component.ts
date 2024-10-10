import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatMessage } from '../interfaces/message.interface';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import {
  IonButton,
  IonIcon,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    IonButton,
    IonHeader,
    IonTitle,
    IonIcon,
    IonToolbar,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  room: string = ''; // Sala de chat seleccionada
  private userSubscription!: Subscription;
  private chatHistorySubscription!: Subscription;
  fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    newMessage: ['', Validators.required],
  });
  prefixUsername: string = '@';
  currentUserEmail: string = '';
  messages: ChatMessage[] | null = null;
  messagesGroupedByDate: { date: string; messages: ChatMessage[] }[] = [];
  isLoading: boolean = false;

  constructor(
    public authService: AuthService,
    public chatService: ChatService,
    public spinner: NgxSpinnerService,
    private router: Router
  ) {
    addIcons({ closeOutline });
    this.room = localStorage.getItem('room') ?? '';
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe((user) => {
      if (user?.email) {
        this.currentUserEmail = user.email;
        this.loadMessages();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.chatHistorySubscription) {
      this.chatHistorySubscription.unsubscribe();
    }
  }

  loadMessages() {
    this.isLoading = true;
    this.spinner.show();

    this.chatHistorySubscription = this.chatService
      .getMessages(this.room)
      .subscribe((data: ChatMessage[]) => {
        this.messages = data;
        this.groupMessagesByDate();
        this.isLoading = false;
        this.spinner.hide();
      });
  }

  sendMessage() {
    const rawForm = this.form.getRawValue();

    if (rawForm.newMessage.trim().length > 0) {
      const newDate = new Date();
      const date = format(newDate, 'dd MMMM yyyy');
      const time = format(newDate, 'hh:mm a');

      this.chatService.updateMessages(
        this.currentUserEmail,
        rawForm.newMessage,
        date,
        time,
        this.room
      );
      this.form.reset();
      this.loadMessages(); // Carga los mensajes después de enviar
    }
  }

  groupMessagesByDate() {
    if (this.messages === null) return;
    const grouped: { [key: string]: ChatMessage[] } = {};

    for (const message of this.messages) {
      if (!grouped[message.date]) {
        grouped[message.date] = [];
      }
      grouped[message.date].push(message);
    }

    this.messagesGroupedByDate = Object.keys(grouped)
      .sort((dateA, dateB) => {
        const parsedDateA = parse(dateA, 'dd MMMM yyyy', new Date(), {
          locale: es,
        });
        const parsedDateB = parse(dateB, 'dd MMMM yyyy', new Date(), {
          locale: es,
        });
        return parsedDateA.getTime() - parsedDateB.getTime();
      })
      .map((date) => ({
        date,
        messages: grouped[date].sort(this.orderByDateAndTime),
      }));
  }

  orderByDateAndTime(messageA: ChatMessage, messageB: ChatMessage) {
    const dateTimeA = new Date(`${messageA.date} ${messageA.time}`);
    const dateTimeB = new Date(`${messageB.date} ${messageB.time}`);
    return dateTimeA.getTime() - dateTimeB.getTime();
  }

  getUsernameFromEmail(email: string): string {
    const atIndex = email.indexOf('@');
    return atIndex !== -1 ? email.slice(0, atIndex) : email;
  }

  handleBack() {
    this.router.navigate(['home']);
  }
}
