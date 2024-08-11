import { Component, OnInit } from '@angular/core';
import { MinimalStandings, TeamStats } from 'src/app/interfaces';
import { PointsService } from 'src/app/services/points.service';


@Component({
  selector: 'app-playoffs',
  templateUrl: './playoffs.component.html',
  styleUrls: ['./playoffs.component.scss']
})
export class PlayoffsComponent implements OnInit {
  playoffTeamIdsByRound: number[][] = [];
  playoffStandingsByRound: TeamStats[][] = [];
  weekDifference: number;
  rawTeamsWithPoints: TeamStats[];

  constructor(public pointsService: PointsService) { }

  ngOnInit() {
    this.pointsService.teamsWithPoints$.subscribe((response) => {
      if (response.length > 0) {
        this.rawTeamsWithPoints = response;
        const fullStandings = this.calculateRegularSeasonStandings();
        this.weekDifference = this.pointsService.latestStatWeek - this.pointsService.getRegularSeasonWeeks();
        for (let i = 1; i < this.weekDifference + 1; i++) {
          // First round will use overall standings, then previous week's 
          const standingsToUse = i === 1 ? fullStandings : this.playoffStandingsByRound[i - 2];
          this.setPlayoffTeams(standingsToUse, i);
          this.calculatePlayoffStandings(i);
        }
      }
    })
  }

  calculateRegularSeasonStandings(): MinimalStandings[] {
    const teamTracking: { [key: number]: MinimalStandings } = {};
    const regularSeasonStandings = [];
    this.rawTeamsWithPoints.forEach((rec) => {
      const { teamId, teamName, wins, losses, ties, points, week } = rec;
      if (week === 1) {
        teamTracking[teamId] = {
          teamId,
          teamName,
          wins: 0,
          losses: 0,
          ties: 0,
          points: 0,
        }
      }
      if (week <= this.pointsService.getRegularSeasonWeeks()) {
        const team = teamTracking[teamId];
        team.wins += wins;
        team.losses += losses;
        team.ties += ties;
        team.points += points;
      }
    });
    for (const team in teamTracking) {
      regularSeasonStandings.push(teamTracking[team]);
    }
    return regularSeasonStandings.sort(this.pointsService.sortByRecord);
  }

  calculatePlayoffStandings(round: number) {
    const week = this.pointsService.getRegularSeasonWeeks() + round;
    this.playoffStandingsByRound[round - 1] = this.rawTeamsWithPoints
      .filter((team) => team.week === week)
      .filter((item) => this.playoffTeamIdsByRound[round - 1].includes(item.teamId))
      .sort((a, b) => b.points - a.points);
  }

  setPlayoffTeams(standings: MinimalStandings[], round: number): void {
    this.playoffTeamIdsByRound.push([]);
    for (let i = 0; i < this.getNumberOfTeams(round); i++) {
      this.playoffTeamIdsByRound[this.playoffTeamIdsByRound.length - 1].push(standings[i].teamId)
    }
  }

  getNumberOfTeams(round: number): number {
    // In 2024, only had 14 teams. Other years had 16.
    const firstRound = this.pointsService.currentYear === '2024' ? 7 : 8;
    return round === 1 ? firstRound : round === 2 ? 4 : 2;
  }
}
