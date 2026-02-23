/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GameEventRequest } from '../models/GameEventRequest';
import type { LoadGameRequest } from '../models/LoadGameRequest';
import type { StartGameRequest } from '../models/StartGameRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GameEngineService {
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postGameEngineNew(
        requestBody: StartGameRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/game-engine/new',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postGameEngineLoad(
        requestBody: LoadGameRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/game-engine/load',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postGameEngineEvent(
        requestBody: GameEventRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/game-engine/event',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
