import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResultsComponent } from './views/results/results.component';
import { ResultsGridComponent } from './views/results/results-grid/results-grid.component';
import { SelectorComponent } from './views/results/week-selector/week-selector.component';
import { StandingsComponent } from './views/standings/standings.component';
import { StandingsGridComponent } from './views/standings/standings-grid/standings-grid.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RanksComponent } from './views/ranks/ranks.component';
import { PlayoffsComponent } from './views/playoffs/playoffs.component';


@NgModule({
  declarations: [
    AppComponent,
    ResultsComponent,
    ResultsGridComponent,
    SelectorComponent,
    StandingsComponent,
    StandingsGridComponent,
    RanksComponent,
    PlayoffsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
