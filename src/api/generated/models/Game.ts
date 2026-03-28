/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Batter2 } from './Batter2';
import type { Inning } from './Inning';
import type { Team } from './Team';
export type Game = {
    homeTeam?: Team;
    awayTeam?: Team;
    inning?: Inning;
    firstBase?: Batter2;
    secondBase?: Batter2;
    thirdBase?: Batter2;
    battingTeam?: Team;
    pitchingTeam?: Team;
    currentBatter?: Batter2;
    isFinal?: boolean;
    outs?: number;
};

