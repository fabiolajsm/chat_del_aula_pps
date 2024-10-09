import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CollectionReference,
  addDoc,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { ChatMessage } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  firestore = inject(Firestore);

  getMessages(room: string): Observable<ChatMessage[]> {
    const messagesRef: CollectionReference = collection(
      this.firestore,
      'messages'
    );
    const messagesQuery = query(messagesRef, where('room', '==', room));
    return collectionData(messagesQuery, { idField: 'id' }) as Observable<
      ChatMessage[]
    >;
  }

  updateMessages(
    username: string,
    text: string,
    date: string,
    time: string,
    room: string
  ) {
    const newMessage = {
      username,
      text,
      date,
      time,
      room, // Agregar la sala al mensaje
    };
    const messagesRef: CollectionReference = collection(
      this.firestore,
      'messages'
    );
    addDoc(messagesRef, newMessage);
  }
}
