import { AuthComponent } from './login/auth.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.modules';



@NgModule({
  declarations: [AuthComponent],
  imports: [
    SharedModule
  ],
  exports: [AuthComponent]
})
export class AuthModule { }
