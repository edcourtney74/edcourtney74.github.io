import { Component, Input, OnInit } from '@angular/core';
import { PointsService } from 'src/app/services/points.service';
import { SortDirection, TeamStandings } from 'src/app/interfaces';
import { faTrophy, faBomb } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-standings-grid',
  templateUrl: './standings-grid.component.html',
  styleUrls: ['./standings-grid.component.scss']
})
export class StandingsGridComponent implements OnInit {
  @Input() standings: TeamStandings[] = [];
  faTrophy = faTrophy;
  faBomb = faBomb;
  clinchedTeamIds: number[] = [];
  knockedOutTeamIds: number[] = [];

  sortDirections: SortDirection[] = [
    {
      column: 'wins',
      direction: 'asc',
    },
    {
      column: 'losses',
      direction: 'asc',
    },
    {
      column: 'ties',
      direction: 'asc',
    },
    {
      column: 'points',
      direction: 'asc',
    },
    {
      column: 'rank',
      direction: 'asc',
    },
    {
      column: 'hitting',
      direction: 'asc',
    },
    {
      column: 'pitching',
      direction: 'asc',
    },
    {
      column: 'topTeams',
      direction: 'asc',
    },
    {
      column: 'bombs',
      direction: 'asc',
    },
    {
      column: 'averageWins',
      direction: 'asc',
    },
    {
      column: 'averageLosses',
      direction: 'asc',
    },
    {
      column: 'gamesBack',
      direction: 'asc',
    },
    {
      column: 'stDev',
      direction: 'asc',
    },
  ];

  constructor(public pointsService: PointsService) { }

  ngOnInit(): void {
    this.checkPlayoffChances();
  }

  sort(param: string): void {
    const obj = this.sortDirections.find((item) => item.column === param);
    if (obj) {
      if (obj.direction === 'asc') {
        this.standings.sort((a, b) => b[param] - a[param]);
        obj.direction = 'desc';
      } else {
        this.standings.sort((a, b) => a[param] - b[param]);
        obj.direction = 'asc';
      }
    }
  }

  checkPlayoffChances(): void {
    if (this.pointsService.latestStatWeek <= this.pointsService.getRegularSeasonWeeks()) {
      const gameSpan = 13;
      const remainingWeeks = this.pointsService.getRegularSeasonWeeks() - this.pointsService.latestStatWeek + 1;
      const possibleWins = gameSpan * remainingWeeks;
      const firstTeamOut = this.standings[7];
      const lastTeamIn = this.standings[6];
      // Check for clinched teams
      for (let i = 0; i < 7; i++) {
        if ((firstTeamOut.wins + possibleWins) < this.standings[i].wins) {
          this.clinchedTeamIds.push(this.standings[i].teamId);
        } else {
          break;
        }
      }
      // Check for knocked out teams
      for (let j = 13; j > 7; j--) {
        if ((this.standings[j].wins + possibleWins) < lastTeamIn.wins) {
          this.knockedOutTeamIds.push(this.standings[j].teamId)
        } else {
          break;
        }
      }
    }
  }
}
