export interface TeamStats {
  teamId: number;
  teamName: string;
  points: number;
  wins: number;
  losses: number;
  ties: number;
  weekRank: number;
  hitting: number;
  pitching: number;
  week: number;
  year: number;
  last_updated: string;
}

export interface RawTeamStats {
  team_id: number;
  team_name: string;
  points: number;
  wins: number;
  losses: number;
  ties: number;
  week_rank: number;
  week: number;
  stat_year: number;
  hitting: number;
  pitching: number;
  last_updated: string;
}

export interface TeamStandings {
  teamId: number;
  teamName: string;
  points: number;
  wins: number;
  losses: number;
  ties: number;
  rank: number;
  hitting: number;
  pitching: number;
  topTeams: number;
  bombs: number;
  averageWins: number;
  averageLosses: number;
  gamesBack: number;
  weekRanks: number[];
  stDev: number;
  [index: string]: any;
}

export interface MinimalStandings {
  teamId: number;
  teamName: string;
  points: number;
  wins: number;
  losses: number;
  ties: number;
}

type SortDirectionType = 'asc' | 'desc';
export interface SortDirection {
  column: string;
  direction: SortDirectionType;
}