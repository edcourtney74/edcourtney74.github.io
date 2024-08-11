import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MinimalStandings, RawTeamStats, TeamStandings, TeamStats } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PointsService {

  teamsWithPoints$ = new BehaviorSubject<TeamStats[]>([]);
  regularSeasonStandings$ = new BehaviorSubject<TeamStandings[]>([]);
  latestStatWeek$ = new BehaviorSubject<number>(1);
  private _currentYear = '2024';
  private _lastUpdated: string;
  private _latestStatWeek: number;

  constructor() { }

  get currentYear(): string {
    return this._currentYear;
  }

  set currentYear(year: string) {
    this._currentYear = year;
  }

  getRegularSeasonWeeks(): number {
    // One week less because of lockout
    if (this._currentYear === '2022') {
      return 20;
    }
    return 21;
  }

  get lastUpdated(): string {
    return this._lastUpdated;
  }

  get latestStatWeek(): number {
    return this._latestStatWeek;
  }

  // Points are retrieved for the current year, including playoffs, and sorted by week, week_rank
  async getPoints(): Promise<void> {
    const response = await fetch(`https://qey5k2as68.execute-api.us-east-1.amazonaws.com/api-points?year=${this._currentYear}`);
    const rawData = await response.json();
    if (rawData.Items.length === 0) {
      this.teamsWithPoints$.next([]);
      return;
    }
    const formattedTeams: TeamStats[] = rawData.Items.map((rec: RawTeamStats) => {
      const { team_id, team_name, points, wins, losses, ties, week_rank, hitting, pitching, week, stat_year, last_updated } = rec;
      return {
        teamId: team_id,
        teamName: team_name,
        points,
        wins,
        losses,
        ties,
        weekRank: week_rank,
        hitting,
        pitching,
        week,
        year: stat_year,
        last_updated
      }
    })
    formattedTeams.sort((a, b) => a.week - b.week);
    this._latestStatWeek = formattedTeams[formattedTeams.length - 1].week;
    this.latestStatWeek$.next(this._latestStatWeek);
    this._lastUpdated = this.formatLastUpdated(formattedTeams[formattedTeams.length - 1].last_updated);
    this.teamsWithPoints$.next(formattedTeams);
  }

  formatLastUpdated(value: string): string {
    const date = new Date(value);
    const dayString = date.toLocaleDateString('en-US', { weekday: 'long' });
    const hours = (date.getHours() - 5).toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${dayString} ${date.getMonth() + 1}/${date.getDate()}, ${hours}:${minutes}`;
  }

  truncateTeamName(name: string): string {
    const limit = 11;
    return name.length < limit
      ? name
      : name.slice(0, limit) + '...';
  }

  sortByRecord(a: TeamStandings | MinimalStandings, b: TeamStandings | MinimalStandings): number {
    const aPct = (a.wins + (a.ties * .5)) / (a.wins + a.losses + a.ties);
    const bPct = (b.wins + (b.ties * .5)) / (b.wins + b.losses + b.ties);
    if (aPct > bPct) {
      return -1;
    }
    if (aPct < bPct) {
      return 1;
    }
    // If record is tied
    if (a.points > b.points) {
      return -1;
    }
    if (a.points < b.points) {
      return 1;
    }
    return 0;
  }
}
