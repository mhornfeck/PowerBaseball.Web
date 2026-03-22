export type TeamSlot = {
  teamId: string;
  player?: GamePlayer;
};

export type GamePlayer = {
  id: string;
  handle: string;
};

export class TeamSetup {
  public homeTeam: TeamSlot;
  public awayTeam: TeamSlot;

  constructor(
    homeTeam: TeamSlot = { teamId: "" },
    awayTeam: TeamSlot = { teamId: "" },
  ) {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
  }
}
