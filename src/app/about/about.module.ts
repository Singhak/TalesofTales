import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { TeamMemberComponent } from './team-member/team-member.component';
import { NgModule } from '@angular/core';
import { AboutRoutingModule } from './about.routing';
import { SharedModule } from '../shared/shared.modules';



@NgModule({
  declarations: [TeamMemberComponent, AboutComponent],
  imports: [
    SharedModule,
    AboutRoutingModule,
    // CommonModule
  ]
})
export class AboutModule { }
