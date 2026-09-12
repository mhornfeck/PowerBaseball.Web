import { describe, expect, it } from "vitest";
import type { Batter, GamePlayer, GameTeam, Team } from "../api/generated";
import { AtBatResultType, GameTeamMode, InningHalf } from "../api/generated";
import type { GameState } from "../context/GameContext";
import {
  mapBaseRunners,
  mapFinalScore,
  mapLineups,
  mapRosters,
  mapScoreboard,
  mapTurnState,
} from "./game.mapper";

function makeBatter(overrides: Partial<Batter> = {}): Batter {
  return {
    firstName: "Jane",
    lastName: "Doe",
    jerseyNumber: 1,
    attributes: { contact: 50, power: 50 },
    ...overrides,
  };
}

function makeGamePlayer(overrides: Partial<GamePlayer> = {}): GamePlayer {
  return {
    id: "player-1",
    username: "player-one",
    ...overrides,
  };
}

function makeTeam(overrides: Partial<Team> = {}): Team {
  return {
    city: "Testville",
    ...overrides,
  };
}

function makeGameTeam(overrides: Partial<GameTeam> = {}): GameTeam {
  return {
    id: "team-1",
    team: makeTeam(),
    mode: GameTeamMode.COMPUTER,
    players: [],
    ...overrides,
  };
}

function makeGame(overrides: Partial<GameState> = {}): GameState {
  return {
    gameId: "game-1",
    home: makeGameTeam({ id: "home-team" }),
    away: makeGameTeam({ id: "away-team" }),
    game: {},
    currentStateData: {},
    currentAtBatInput: {},
    ...overrides,
  };
}

describe("mapBaseRunners", () => {
  it("returns all nulls when there is no game", () => {
    expect(mapBaseRunners(null)).toEqual({
      first: null,
      second: null,
      third: null,
    });
  });

  it("maps populated bases to jerseyNumber/displayName", () => {
    const game = makeGame({
      game: {
        firstBase: makeBatter({ jerseyNumber: 12, name: "Al Kaline" }),
        secondBase: makeBatter({ jerseyNumber: 24 }),
      },
    });

    const result = mapBaseRunners(game);

    expect(result.first).toEqual({ jerseyNumber: 12, displayName: "Al Kaline" });
    expect(result.third).toBeNull();
  });

  it("falls back to first/last name when name is missing", () => {
    const game = makeGame({
      game: {
        thirdBase: makeBatter({
          firstName: "Willie",
          lastName: "Mays",
          name: null,
        }),
      },
    });

    expect(mapBaseRunners(game).third?.displayName).toBe("Willie Mays");
  });
});

describe("mapScoreboard", () => {
  it("returns zeroed state when there is no game", () => {
    expect(mapScoreboard(null)).toEqual({
      inning: null,
      isFinal: false,
      outs: 0,
      away: { city: null, boxScore: [], score: 0, hits: 0 },
      home: { city: null, boxScore: [], score: 0, hits: 0 },
    });
  });

  it("maps inning number/half and isFinal/outs", () => {
    const game = makeGame({
      game: {
        inning: { inningNumber: 7, inningHalf: InningHalf.BOTTOM },
        isFinal: true,
        outs: 2,
      },
    });

    const result = mapScoreboard(game);

    expect(result.inning).toEqual({ number: 7, half: "Bottom" });
    expect(result.isFinal).toBe(true);
    expect(result.outs).toBe(2);
  });

  it("reads city/boxScore from game.awayTeam but score/hits from away.team", () => {
    const game = makeGame({
      game: {
        awayTeam: makeTeam({ city: "Away City", boxScore: [1, 0, 2] }),
      },
      away: makeGameTeam({
        team: makeTeam({
          city: "Away City",
          score: 5,
          statistics: { hits: 8 },
        }),
      }),
    });

    expect(mapScoreboard(game).away).toEqual({
      city: "Away City",
      boxScore: [1, 0, 2],
      score: 5,
      hits: 8,
    });
  });
});

describe("mapTurnState", () => {
  it("returns all nulls when there is no game", () => {
    expect(mapTurnState(null)).toEqual({
      battingTeamName: null,
      battingTeamActivePlayer: null,
      pitchingTeamActivePlayer: null,
    });
  });

  it("assigns the active player to the batting side when home is at bat", () => {
    const game = makeGame({
      game: { battingTeam: makeTeam({ id: "home-team", city: "Home City" }) },
      home: makeGameTeam({
        id: "home-team",
        activePlayer: makeGamePlayer({ id: "p-home", username: "homer" }),
      }),
      away: makeGameTeam({
        id: "away-team",
        activePlayer: makeGamePlayer({ id: "p-away", username: "awayer" }),
      }),
    });

    const result = mapTurnState(game);

    expect(result.battingTeamName).toBe("Home City");
    expect(result.battingTeamActivePlayer).toEqual({ id: "p-home", name: "homer" });
    expect(result.pitchingTeamActivePlayer).toEqual({ id: "p-away", name: "awayer" });
  });

  it("assigns the active player to the batting side when away is at bat", () => {
    const game = makeGame({
      game: { battingTeam: makeTeam({ id: "away-team" }) },
      home: makeGameTeam({
        id: "home-team",
        activePlayer: makeGamePlayer({ id: "p-home" }),
      }),
      away: makeGameTeam({
        id: "away-team",
        activePlayer: makeGamePlayer({ id: "p-away" }),
      }),
    });

    const result = mapTurnState(game);

    expect(result.battingTeamActivePlayer?.id).toBe("p-away");
    expect(result.pitchingTeamActivePlayer?.id).toBe("p-home");
  });
});

describe("mapLineups", () => {
  it("returns empty lineups when there is no game", () => {
    expect(mapLineups(null)).toEqual({
      home: { teamName: "", players: [], currentBatter: null },
      away: { teamName: "", players: [], currentBatter: null },
    });
  });

  it("maps batters to PlayerLine, defaulting hits/atBats when statistics is missing", () => {
    const game = makeGame({
      away: makeGameTeam({
        team: makeTeam({
          city: "Away City",
          lineup: {
            batters: [
              makeBatter({
                jerseyNumber: 7,
                name: "Mickey Mantle",
                statistics: { hits: 2, atBats: 4 },
              }),
              makeBatter({ jerseyNumber: 8, name: "No Stats Guy" }),
            ],
          },
        }),
      }),
    });

    const result = mapLineups(game);

    expect(result.away.teamName).toBe("Away City");
    expect(result.away.players).toEqual([
      { jerseyNumber: 7, name: "Mickey Mantle", hits: 2, atBats: 4 },
      { jerseyNumber: 8, name: "No Stats Guy", hits: 0, atBats: 0 },
    ]);
  });

  it("maps currentBatter to a BatterCardInfo with log entries and season fallbacks", () => {
    const game = makeGame({
      home: makeGameTeam({
        team: makeTeam({
          currentBatter: makeBatter({
            jerseyNumber: 3,
            firstName: "Babe",
            lastName: "Ruth",
            log: {
              entries: [{ inning: 1, resultType: AtBatResultType.SINGLE }],
            },
          }),
        }),
      }),
    });

    const result = mapLineups(game);

    expect(result.home.currentBatter).toEqual({
      jerseyNumber: 3,
      firstName: "Babe",
      lastName: "Ruth",
      todayHits: 0,
      todayAtBats: 0,
      log: [{ inning: 1, resultType: "Single" }],
      seasonAvgDisplay: "",
      seasonSlgDisplay: "",
      seasonHomeruns: 0,
      seasonRbi: 0,
    });
  });
});

describe("mapFinalScore", () => {
  it("returns null when home or away team data is missing", () => {
    expect(mapFinalScore(makeGame())).toBeNull();
    expect(mapFinalScore(null)).toBeNull();
  });

  it("picks the home team as the winner when home scores higher", () => {
    const game = makeGame({
      game: {
        homeTeam: makeTeam({ city: "Home City", score: 5 }),
        awayTeam: makeTeam({ city: "Away City", score: 3 }),
      },
    });

    expect(mapFinalScore(game)).toEqual({
      winningTeamName: "Home City",
      winningScore: 5,
      losingScore: 3,
    });
  });

  it("picks the away team as the winner when away scores higher", () => {
    const game = makeGame({
      game: {
        homeTeam: makeTeam({ city: "Home City", score: 2 }),
        awayTeam: makeTeam({ city: "Away City", score: 9 }),
      },
    });

    expect(mapFinalScore(game)).toEqual({
      winningTeamName: "Away City",
      winningScore: 9,
      losingScore: 2,
    });
  });

  it("treats a tie as an away win, matching the >-comparison in the source", () => {
    const game = makeGame({
      game: {
        homeTeam: makeTeam({ city: "Home City", score: 4 }),
        awayTeam: makeTeam({ city: "Away City", score: 4 }),
      },
    });

    expect(mapFinalScore(game)?.winningTeamName).toBe("Away City");
  });
});

describe("mapRosters", () => {
  it("defaults to COMPUTER mode with no human players when there is no game", () => {
    expect(mapRosters(null)).toEqual({
      home: { mode: GameTeamMode.COMPUTER, humanPlayers: [], activePlayerId: null },
      away: { mode: GameTeamMode.COMPUTER, humanPlayers: [], activePlayerId: null },
    });
  });

  it("maps GamePlayer (id/username) to HumanPlayer (id/handle) and carries the active player id", () => {
    const game = makeGame({
      home: makeGameTeam({
        mode: GameTeamMode.HUMAN,
        players: [makeGamePlayer({ id: "p1", username: "alice" })],
        activePlayer: makeGamePlayer({ id: "p1", username: "alice" }),
      }),
    });

    expect(mapRosters(game).home).toEqual({
      mode: GameTeamMode.HUMAN,
      humanPlayers: [{ id: "p1", handle: "alice" }],
      activePlayerId: "p1",
    });
  });
});
