import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { NguiMapModule} from '@ngui/map';
import { Ng2OrderModule } from 'ng2-order-pipe';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    Ng2OrderModule,
    NguiMapModule.forRoot(environment.googlemaps)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
