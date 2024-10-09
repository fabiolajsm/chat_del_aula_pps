import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CollectionReference,
  addDoc,
  collection,
  query,
} from 'firebase/firestore';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { ChatMessage } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  firestore = inject(Firestore);

  getMessages(): Observable<ChatMessage[]> {
    const messagesRef: CollectionReference = collection(
      this.firestore,
      'messages'
    );
    const messagesQuery = query(messagesRef);
    return collectionData(messagesQuery, { idField: 'id' }) as Observable<
      ChatMessage[]
    >;
  }
  updateMessages(username: string, text: string, date: string, time: string) {
    const newMessage = {
      username,
      text,
      date,
      time,
    };
    const messagesRef: CollectionReference = collection(
      this.firestore,
      'messages'
    );
    addDoc(messagesRef, newMessage);
  }
}
