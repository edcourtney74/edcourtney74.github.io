import { Component, OnInit } from '@angular/core';
import { TeamStats } from 'src/app/interfaces';
import { PointsService } from 'src/app/services/points.service';

@Component({
  selector: 'app-ranks',
  templateUrl: './ranks.component.html',
  styleUrls: ['./ranks.component.scss']
})
export class RanksComponent implements OnInit {

  teams: TeamStats[][] = [];

  constructor(public pointsService: PointsService) { }

  ngOnInit() {
    this.pointsService.teamsWithPoints$.subscribe((response) => {
      if (response.length > 0) {
        response.sort((a, b) => a.teamName.localeCompare(b.teamName) || a.week - b.week);
        this.teams = [];
        let currentName = response[0].teamName;
        let teamGroup: TeamStats[] = [];
        for (let i = 0; i < response.length; i++) {
          const stat = response[i];
          if (stat.teamName === currentName) {
            teamGroup.push(stat);
          } else {
            // Don't want current week
            teamGroup.pop();
            this.teams.push(teamGroup);
            teamGroup = [stat];
            currentName = stat.teamName;
          }
        }
        teamGroup.pop();
        this.teams.push(teamGroup);
      }
    })
  }



}
