/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HalfInningSummary } from './HalfInningSummary';
import type { InningHalf } from './InningHalf';
import type { Team } from './Team';
export type SideChangeOccurredSnapshot = {
    inningNumber: number;
    inningHalf: InningHalf;
    battingTeam: Team;
    pitchingTeam: Team;
    summary: HalfInningSummary;
    dueUp: Array<any>;
    gameId: string;
};

