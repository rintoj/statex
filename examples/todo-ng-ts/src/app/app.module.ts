import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { INITIAL_STATE } from '../state'
import { NgModule } from '@angular/core';
import { environment } from './../environments/environment';
import { initialize } from 'statex';

initialize(INITIAL_STATE, {
  hotLoad: !environment.production,
  domain: 'todo'
})

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
