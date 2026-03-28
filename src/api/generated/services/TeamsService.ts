/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TeamListingModel } from '../models/TeamListingModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TeamsService {
    /**
     * @returns TeamListingModel OK
     * @throws ApiError
     */
    public static getTeams(): CancelablePromise<Array<TeamListingModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teams',
        });
    }
}
