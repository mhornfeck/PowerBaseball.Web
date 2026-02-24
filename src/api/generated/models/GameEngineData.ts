/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AtBatInput } from './AtBatInput';
import type { Game } from './Game';
import type { GameEngineStateData } from './GameEngineStateData';
import type { GameTeam } from './GameTeam';
export type GameEngineData = {
    gameId: string;
    home: GameTeam;
    away: GameTeam;
    game: Game;
    currentState: GameEngineStateData;
    currentAtBatInput: AtBatInput;
};

