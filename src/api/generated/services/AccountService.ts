/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrentUserResponse } from '../models/CurrentUserResponse';
import type { UpdateProfileRequest } from '../models/UpdateProfileRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountService {
    /**
     * @param requestBody
     * @returns CurrentUserResponse OK
     * @throws ApiError
     */
    public static putAccountProfile(
        requestBody: UpdateProfileRequest,
    ): CancelablePromise<CurrentUserResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/account/profile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
