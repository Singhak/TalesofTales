import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  accepted = false;
  constructor(private authService: AuthService, private router: Router,
    private toastrService: ToastrService) {
  }

  ngOnInit() {
  }

  signInWithTwitter() {
    if (this.accepted) {
      this.authService.signInWithTwitter()
        .then((res) => {
          this.toastrService.success('Thanks for login', 'Success', {
            timeOut: 5000
          });
          this.router.navigate(['posts']);
        })
        .catch((err) => {
          console.log(err);
          this.handelError(err)
        });
    }
  }


  signInWithFacebook() {
    if (this.accepted) {
      this.authService.signInWithFacebook()
        .then((res) => {
          this.toastrService.success('Thanks for login', 'Success', {
            timeOut: 5000
          });
          this.router.navigate(['posts']);
        })
        .catch((err) => {
          console.log(err);
          this.handelError(err)
        });
    }
  }


  signInWithGoogle() {
    if (this.accepted) {
      this.authService.signInWithGoogle()
        .then((res) => {
          this.toastrService.success('Thanks for login', 'Success', {
            timeOut: 5000
          });
          this.router.navigate(['posts']);
        })
        .catch((err) => {
          console.log(err);
          this.handelError(err)
        });
    }
  }

  handelError(error: any) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      this.authService.getSignInMethodsForEmail(error.email);
    } else {
      this.toastrService.error(error.message, 'Login Error', {
        timeOut: 5000
      });
    }
  }
}
