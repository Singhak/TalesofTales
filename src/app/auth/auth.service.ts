import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import { User } from './user.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private tokenExpirationTimer: any;
  public userDetail = new BehaviorSubject<User>(null);
  constructor(private firebaseAuth: AngularFireAuth, private router: Router, private toastrService: ToastrService) {
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
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      console.log(expirationDuration);
      // this.autoLogout(expirationDuration);
    }
  }

  /***
   * 
// Step 1.
// User tries to sign in to Facebook.
auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).catch(function(error) {
  // An error happened.
  if (error.code === 'auth/account-exists-with-different-credential') {
    // Step 2.
    // User's email already exists.
    // The pending Facebook credential.
    var pendingCred = error.credential;
    // The provider account's email address.
    var email = error.email;
    // Get sign-in methods for this email.
    auth.fetchSignInMethodsForEmail(email).then(function(methods) {
      // Step 3.
      // If the user has several sign-in methods,
      // the first method in the list will be the "recommended" method to use.
      if (methods[0] === 'password') {
        // Asks the user their password.
        // In real scenario, you should handle this asynchronously.
        var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
        auth.signInWithEmailAndPassword(email, password).then(function(user) {
          // Step 4a.
          return user.linkWithCredential(pendingCred);
        }).then(function() {
          // Facebook account successfully linked to the existing Firebase user.
          goToApp();
        });
        return;
      }
      // All the other cases are external providers.
      // Construct provider object for that provider.
      // TODO: implement getProviderForProviderId.
      var provider = getProviderForProviderId(methods[0]);
      // At this point, you should let the user know that they already has an account
      // but with a different provider, and let them validate the fact they want to
      // sign in with this provider.
      // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
      // so in real scenario you should ask the user to click on a "continue" button
      // that will trigger the signInWithPopup.
      auth.signInWithPopup(provider).then(function(result) {
        // Remember that the user may have signed in with an account that has a different email
        // address than the first one. This can happen as Firebase doesn't control the provider's
        // sign in flow and the user is free to login using whichever account they own.
        // Step 4b.
        // Link to Facebook credential.
        // As we have access to the pending credential, we can directly call the link method.
        result.user.linkAndRetrieveDataWithCredential(pendingCred).then(function(usercred) {
          // Facebook account successfully linked to the existing Firebase user.
          goToApp();
        });
      });
    });
  }
});
   */
}
