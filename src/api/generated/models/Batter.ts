/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatterAttributes } from './BatterAttributes';
import type { BattingLog } from './BattingLog';
import type { BattingStatistics } from './BattingStatistics';
export type Batter = {
    firstName: string;
    lastName: string;
    jerseyNumber: number;
    attributes: BatterAttributes;
    statistics?: BattingStatistics;
    log?: BattingLog;
    name?: string | null;
};

