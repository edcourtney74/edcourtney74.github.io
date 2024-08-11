import { Component, OnInit } from '@angular/core';
import { TeamStats } from 'src/app/interfaces';
import { PointsService } from 'src/app/services/points.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  selectedWeek: number;
  currentWeek: number;
  currentYear = new Date().getFullYear();
  allWeeksTeams: TeamStats[];
  selectedWeekTeams: TeamStats[];
  allWeeks: number[];

  constructor(private pointsService: PointsService) { }

  ngOnInit(): void {
    this.pointsService.teamsWithPoints$.subscribe((response) => {
      this.allWeeksTeams = response;
      this.getDistinctWeeks();
      this.setTeams();
    })
  }

  getDistinctWeeks(): void {
    const allWeeksWithDupes = this.allWeeksTeams.map((team) => team.week);
    this.allWeeks = allWeeksWithDupes
      .filter((item, index) => allWeeksWithDupes.indexOf(item) === index)
      .filter((week) => week <= this.pointsService.getRegularSeasonWeeks())
      .sort((a, b) => b - a);
    if (this.allWeeks[0] <= this.pointsService.getRegularSeasonWeeks()) {
      this.currentWeek, this.selectedWeek = this.allWeeks[0];
    } else {
      this.currentWeek, this.selectedWeek = this.pointsService.getRegularSeasonWeeks();
    }
  }

  setWeek($event: number): void {
    this.selectedWeek = $event;
    this.setTeams();
  }

  setTeams(): void {
    this.selectedWeekTeams = this.allWeeksTeams.filter((team) => team.week === this.selectedWeek)
      .sort((a, b) => a.weekRank - b.weekRank)
      ;
  }
}
