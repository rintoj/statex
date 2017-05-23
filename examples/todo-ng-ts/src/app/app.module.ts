import { AppComponent } from './app.component'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { INITIAL_STATE } from '../state'
import { NgModule } from '@angular/core'
import { SCREENS } from './index'
import { SERVICES } from './../service'
import { STORES } from '../store'
import { environment } from './../environments/environment'
import { initialize } from 'statex'

initialize(INITIAL_STATE, {
  hotLoad: !environment.production,
  domain: 'todo'
})

@NgModule({
  declarations: [
    AppComponent,
    ...SCREENS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [STORES, SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule { }
