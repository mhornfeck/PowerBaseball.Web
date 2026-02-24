export type TeamSlot = {
  teamId: string;
  playerId?: string; // optional
};

export class TeamSetup {
  public homeTeam: TeamSlot;
  public awayTeam: TeamSlot;

  constructor(
    homeTeam: TeamSlot = { teamId: "" },
    awayTeam: TeamSlot = { teamId: "" }
  ) {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
  }
}