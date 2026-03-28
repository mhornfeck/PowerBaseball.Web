/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Batter2 } from './Batter2';
import type { BattingStatistics } from './BattingStatistics';
import type { Lineup } from './Lineup';
export type Team = {
    id?: string | null;
    city?: string;
    name?: string;
    overall?: number;
    lineup?: Lineup;
    statistics?: BattingStatistics;
    currentBatter?: Batter2;
    score?: number;
    boxScore?: Array<number | null>;
};

