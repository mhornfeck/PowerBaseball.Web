/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrentUserResponse } from '../models/CurrentUserResponse';
import type { SendLoginCodeRequest } from '../models/SendLoginCodeRequest';
import type { VerifyLoginCodeRequest } from '../models/VerifyLoginCodeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postAuthEmailSend(
        requestBody: SendLoginCodeRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/email/send',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns CurrentUserResponse OK
     * @throws ApiError
     */
    public static postAuthEmailVerify(
        requestBody: VerifyLoginCodeRequest,
    ): CancelablePromise<CurrentUserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/email/verify',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param returnUrl
     * @returns any OK
     * @throws ApiError
     */
    public static getAuthGoogleLogin(
        returnUrl?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/google/login',
            query: {
                'returnUrl': returnUrl,
            },
        });
    }
    /**
     * @param returnUrl
     * @returns any OK
     * @throws ApiError
     */
    public static getAuthGoogleCallback(
        returnUrl?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/google/callback',
            query: {
                'returnUrl': returnUrl,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postAuthLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
        });
    }
    /**
     * @returns CurrentUserResponse OK
     * @throws ApiError
     */
    public static getAuthMe(): CancelablePromise<CurrentUserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
        });
    }
}
