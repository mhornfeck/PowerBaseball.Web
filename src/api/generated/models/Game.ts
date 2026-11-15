/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Batter } from './Batter';
import type { Inning } from './Inning';
import type { Team } from './Team';
export type Game = {
    homeTeam: Team;
    awayTeam: Team;
    inning?: Inning;
    firstBase?: (null | Batter);
    secondBase?: (null | Batter);
    thirdBase?: (null | Batter);
    battingTeam?: Team;
    pitchingTeam?: Team;
    currentBatter?: Batter;
    isFinal?: boolean;
    outs?: number;
};

