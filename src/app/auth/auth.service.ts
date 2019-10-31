import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private tokenExpirationTimer: any;
  public userDetail = new BehaviorSubject<User>(null);
  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {
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

            this.handleAuthentication(user.uid, user.displayName, user.email, user.photoURL, token, expiresIn);
          })
        } else {
          this.userDetails = null;
          localStorage.setItem('user', null);
        }
      }
    );
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
    this.autoLogout(expiresIn + +expiresIn.toString().substr(0, 10));
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
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      console.log(expirationDuration);
      this.autoLogout(expirationDuration);
    }
  }
}
