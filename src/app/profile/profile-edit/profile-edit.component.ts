import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityFun } from 'src/app/shared/utility';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styles: []
})
export class ProfileEditComponent implements OnInit {

  id: string;
  @ViewChild('profile', { static: true }) editform: NgForm;

  constructor(private authService: AuthService, private router: ActivatedRoute, private toastService: ToastrService) { }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      if (params.id) {
        this.id = params.id;
        this.authService.getUserData(this.id).subscribe((profile) => {
          if (profile) {
            this.setDefaults(profile);
          }
        })
      }
    });
  }

  setDefaults(profile: any) {
    setTimeout(() => {
      this.editform.form.patchValue({
        fb: profile.fb,
        insta: profile.insta,
        twitter: profile.twitter,
        bio: profile.bio
      });
    });
  }

  onSubmit(pf: NgForm) {
    if (this.id) {
      this.authService.saveUser(pf.value, this.id).then((res) => {
        this.toastService.success('Your profile successfully updated', 'Success', { timeOut: 5000 })
      }).catch((err) => {
        let code = UtilityFun.fireStoreCode(err.code);
        this.toastService.warning(code, 'Warning', { timeOut: 5000 })
      })
    }
  }

}
