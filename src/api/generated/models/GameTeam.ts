/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GamePlayer } from './GamePlayer';
import type { GameTeamMode } from './GameTeamMode';
import type { Team } from './Team';
export type GameTeam = {
    id?: string | null;
    team: Team;
    mode: GameTeamMode;
    players: Array<GamePlayer> | null;
};

