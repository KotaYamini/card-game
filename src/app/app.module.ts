import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchingGameComponent } from './matching-game/matching-game.component';
import { Game1Component } from './game1/game1.component';
import { Game2Component } from './game2/game2.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchingGameComponent,
    Game1Component,
    Game2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
