// To deploy to github:
// ng deploy --base-href=https://edcourtney74.github.io/
import { Component, OnInit } from '@angular/core';
import { PointsService } from './services/points.service';

type View = 'standings' | 'scores' | 'ranks' | 'playoffs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LPH';
  // view: View = 'playoffs'
  view: View = 'scores'
  // view: View = 'standings'
  years = ['2024', '2023'];
  latestWeek: number;

  constructor(private pointsService: PointsService) { }

  async ngOnInit() {
    await this.pointsService.getPoints();
    this.pointsService.latestStatWeek$.subscribe((response) => {
      this.latestWeek = response;
    });
  }

  setView(view: View) {
    this.view = view;
  }

  setYear(year: string) {
    this.pointsService.currentYear = year;
    this.pointsService.getPoints();
  }

  get lastUpdated(): string {
    return this.pointsService.lastUpdated;
  }

  get currentYear(): string {
    return this.pointsService.currentYear;
  }

  get regularSeasonWeeks(): number {
    return this.pointsService.getRegularSeasonWeeks();
  }
}
