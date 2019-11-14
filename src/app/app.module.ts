import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AuthModule } from './auth/auth.module';
import { AboutModule } from './about/about.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.modules';
import { PostModule } from './posts/post.module';
import { NotfoundComponent } from './notfound/notfound.component';
import { ForbidenComponent } from './forbiden/forbiden.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'projects/landing/src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { MessagingService } from './messaging.service';


@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    FooterComponent,
    HeaderComponent,
    NotfoundComponent,
    ForbidenComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    SharedModule,
    PostModule,
    AboutModule,
    AppRoutingModule,
    AuthModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireMessagingModule
  ],
  providers: [MessagingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
