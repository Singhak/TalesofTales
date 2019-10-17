import { PostRoutingModule } from './posts/post.routing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AuthModule } from './auth/auth.module';
import { AboutModule } from './about/about.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { ThemeModule } from './theme/theme.module';
import { HeaderComponent } from './header/header.component';
// import { PostModule } from './posts/post.module';
import { SharedModule } from './shared/shared.modules';
import { PostModule } from './posts/post.module';


@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    PostModule,
    AboutModule,
    AppRoutingModule,
    ThemeModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
