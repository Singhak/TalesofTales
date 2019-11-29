import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';
import { ForbidenComponent } from './forbiden/forbiden.component';
import { TermsOfUsesComponent } from './terms-of-uses/terms-of-uses.component';


const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: 'forbidden', component: ForbidenComponent },
  { path: 'termsofuses', component: TermsOfUsesComponent },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
