import { Component, OnInit } from '@angular/core';
import { TeamStandings, TeamStats } from 'src/app/interfaces';
import { PointsService } from 'src/app/services/points.service';

type StandingsView = 'current' | 'projected';
type Averages = 'wins' | 'losses';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements OnInit {
  rawTeamsWithPoints: TeamStats[];
  standings: TeamStandings[] = [];
  view: StandingsView = 'current';

  constructor(public pointsService: PointsService) { }

  ngOnInit() {
    this.pointsService.teamsWithPoints$.subscribe((response) => {
      this.rawTeamsWithPoints = response;
      this.calculateStandings();
    })
  }

  // For current standings, removing the most recent week for the calculations. For projected, leave all weeks in. Might need to eventually use the Yahoo API to grab the current week, but that would be a pain.
  calculateStandings(): void {
    const latestWeek = Math.max(...this.rawTeamsWithPoints.map((team) => team.week));
    const teamTracking: { [key: number]: TeamStandings } = {};
    this.standings = [];
    this.rawTeamsWithPoints.forEach((rec) => {
      const { teamId, teamName, wins, losses, ties, points, hitting, pitching, week, weekRank } = rec;
      if (week === 1) {
        teamTracking[teamId] = {
          teamId,
          teamName,
          wins: 0,
          losses: 0,
          ties: 0,
          points: 0,
          hitting: 0,
          pitching: 0,
          rank: 0,
          topTeams: 0,
          bombs: 0,
          averageWins: 0,
          averageLosses: 0,
          gamesBack: 0,
          weekRanks: [],
          stDev: 0,
        }
      }
      if (this.addToTotals(week, latestWeek)) {
        const team = teamTracking[teamId];
        team.wins += wins;
        team.losses += losses;
        team.ties += ties;
        team.points += points;
        team.hitting += hitting;
        team.pitching += pitching;
        team.weekRanks.push(weekRank);
        if (weekRank === 1) {
          team.topTeams += 1;
        }
        if (weekRank === 14) {
          team.bombs += 1;
        }
      }
    });
    for (const team in teamTracking) {
      teamTracking[team].averageWins = this.calculateAverages(latestWeek, teamTracking[team], 'wins');
      teamTracking[team].averageLosses = this.calculateAverages(latestWeek, teamTracking[team], 'losses');
      teamTracking[team].stDev = this.calculateStDev(teamTracking[team]);
      this.standings.push(teamTracking[team]);
    }
    this.standings.sort(this.pointsService.sortByRecord);
    this.standings.forEach((item, i) => {
      // Ignoring hasSameRecord because sorting by total points
      // if (this.hasSameRecord(i)) {
      //   item.rank = this.standings[i - 1].rank;
      // } else {
      //   item.rank = i + 1
      // // }
      // if (this.hasSameRecord(i)) {
      //   item.rank = this.standings[i - 1].rank;
      // } else {
      // }
      item.rank = i + 1
      const lastTeamIn = this.standings[6];
      const lastTeamOut = this.standings[7];
      if (i < 6) {
        item.gamesBack = ((item.wins - lastTeamOut.wins) + (lastTeamOut.losses - item.losses)) / 2;
      } else if (i > 6) {
        item.gamesBack = 0 - (((lastTeamIn.wins - item.wins) + (item.losses - lastTeamIn.losses)) / 2);
      }
    });
    this.pointsService.regularSeasonStandings$.next(this.standings);
  }

  addToTotals(week: number, latestWeek: number): boolean {
    if (this.view === 'projected' && week <= this.pointsService.getRegularSeasonWeeks()) {
      return true;
    }
    if (week <= this.pointsService.getRegularSeasonWeeks() && week < latestWeek) {
      return true
    }
    return false;
  }

  calculateAverages(latestWeek: number, team: TeamStandings, type: Averages): number {
    const totalWeeks = this.getWeeksDividedBy(latestWeek);
    const average = team[type] / totalWeeks;
    return average < 0 ? 0 : average
  }

  getWeeksDividedBy(latestWeek: number) {
    let weeksDividedBy = latestWeek > this.pointsService.getRegularSeasonWeeks() ? this.pointsService.getRegularSeasonWeeks() : latestWeek;
    if (this.view === 'current' && latestWeek < this.pointsService.getRegularSeasonWeeks()) {
      weeksDividedBy -= 1;
    }
    return weeksDividedBy;
  }

  calculateStDev(team: TeamStandings): number {
    const mean = team.weekRanks.reduce((a, b) => a + b) / team.weekRanks.length;
    return Math.sqrt(team.weekRanks.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / team.weekRanks.length);
  }

  // hasSameRecord(index: number): boolean {
  //   if (index === 0) {
  //     return false;
  //   }
  //   const currentTeam = this.standings[index];
  //   const previousTeam = this.standings[index - 1];
  //   if (currentTeam.wins === previousTeam.wins && currentTeam.losses === previousTeam.losses) {
  //     return true;
  //   }
  //   return false;
  // }

  changeView(view: StandingsView): void {
    this.view = view;
    this.calculateStandings();
  }

  onNavChange(args: any) {
    this.view = args.nextId === 1 ? 'current' : 'projected';
    this.calculateStandings();
  }
}
