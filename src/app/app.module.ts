import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpInterceptorService } from './services/http-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    FormsModule,HttpClientModule],
  providers: [{
    provide: HTTP_INTERCEPTORS,   // Register the interceptor
    useClass: HttpInterceptorService,  // Use your custom interceptor
    multi: true,  // Important: multiple interceptors can be chained
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
