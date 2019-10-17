import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private firestore: AngularFirestore) { }

  sendUserMsg(data) {
    return this.firestore.collection('UserMsg').add(data);
  }
  addSubscriber(data) {
    return this.firestore.collection('Subscriber').add(data);
  }

}

export interface User {
  name: string;
  email: string;
  subject: string;
  message: string;
}