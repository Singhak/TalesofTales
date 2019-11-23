import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import { User } from './user.model';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/firestore';
import { configuration } from '../configuration';
import { take, map } from 'rxjs/operators';
import { post } from 'selenium-webdriver/http';
import { Post } from '../posts/post-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private tokenExpirationTimer: any;
  public userDetail = new BehaviorSubject<User>(null);
  constructor(private firebaseAuth: AngularFireAuth, private router: Router,
    private toastrService: ToastrService, private firestore: AngularFirestore) {
    this.autoLogin();
  }

  signInWithTwitter() {
    this.AuthState();
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider()
    );
  }

  signInWithFacebook() {
    this.AuthState();
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );
  }

  signInWithGoogle() {
    this.AuthState();
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }

  isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  logout() {
    this.firebaseAuth.auth.signOut();
    this.router.navigate(['/posts']);
    localStorage.removeItem('user');
    this.userDetail.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private AuthState() {
    this.user = this.firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          user.getIdToken().then((token) => {
            const expiresIn = (new Date()).getTime();
            const photoURL = this.changeProfilePicUrl(user.photoURL);
            this.handleAuthentication(user.uid, user.displayName, user.email, photoURL, token, expiresIn);
          })
        } else {
          this.userDetails = null;
          localStorage.setItem('user', null);
        }
      }
    );
  }

  changeProfilePicUrl(url: string) {
    if (url.lastIndexOf('_normal') >= 0) {
      return url.replace('_normal', '');
    }
    if (url.lastIndexOf('_bigger') >= 0) {
      return url.replace('_bigger', '');
    }
    if (url.lastIndexOf('/picture') >= 0) {
      return url + '?type=large'
    }
    return url;
  }

  getSignInMethodsForEmail(email: string) {
    this.firebaseAuth.auth.fetchSignInMethodsForEmail(email).then((methods) => {
      console.log(methods);
      this.toastrService.error(`Your Account exists with ${methods[0]}. Please login with that.`, 'Login Error', {
        timeOut: 5000
      });
      if (methods.length > 0)
        return methods[0];
    });
  }

  private handleAuthentication(
    id: string,
    name: string,
    email: string,
    photoUrl: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(expiresIn + +expiresIn.toString().substr(0, 10))
    const user = new User(id, name, email, photoUrl, token, expirationDate);
    this.userDetail.next(user);
    this.saveUser({ uid: id, name: name, email: email, photoUrl: photoUrl }, id);
    // this.autoLogout(expiresIn + +expiresIn.toString().substr(0, 10));
    localStorage.setItem('user', JSON.stringify(user));
  }

  autoLogin() {
    const userData: {
      id: string,
      name: string,
      email: string,
      photoURL: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.id, userData.name, userData.email, userData.photoURL, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.userDetail.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime()
      new Date().getTime();
      console.log(expirationDuration);
      // this.autoLogout(expirationDuration);
    }
  }

  saveUser(data, id: string) {
    if (id) {
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection('users')
          .doc(id)
          .set(data, { merge: true })
          .then(res => { resolve(res) }, err => reject(err));
      });
    } else
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection('users')
          .add(data)
          .then(res => { resolve(res) }, err => reject(err));
      });
  }

  getUserData(id: string) {
    return this.firestore.collection('users').doc(id).snapshotChanges().pipe(
      take(1),
      map((rawdata) => {
        let post = rawdata.payload.data();
        return post;
      })
    );
  }
}
