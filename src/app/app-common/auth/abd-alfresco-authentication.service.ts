import { Injectable } from '@angular/core';
import { Observable, Subject, from, throwError, Observer } from 'rxjs';
/*
import { AlfrescoApiService } from './alfresco-api.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import { RedirectionModel } from '../models/redirection.model';
import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
import { JwtHelperService } from './jwt-helper.service';
import { StorageService } from './storage.service';
*/
import { UserRepresentation } from '@alfresco/js-api';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { RedirectionModel, AppConfigService, StorageService, AlfrescoApiService, CookieService, LogService, AppConfigValues, JwtHelperService } from '@alfresco/adf-core';


const REMEMBER_ME_COOKIE_KEY = 'ALFRESCO_REMEMBER_ME';
const REMEMBER_ME_UNTIL = 1000 * 60 * 60 * 24 * 30;

@Injectable()
export class AbdAlfrescoAuthenticationService {

    private redirectUrl: RedirectionModel = null;

    private bearerExcludedUrls: string[] = ['auth/realms', 'resources/', 'assets/'];

    onLogin: Subject<any> = new Subject<any>();
    onLogout: Subject<any> = new Subject<any>();

    constructor(
        private appConfig: AppConfigService,
        private storageService: StorageService,
        private alfrescoApi: AlfrescoApiService,
        private cookie: CookieService,
        private logService: LogService) {
    }

    // =============================================
    // STATIC
    // ======================================================

    public static isLoggedIn2(alfrescoApi: AlfrescoApiService, cookie: CookieService): boolean {
        if (!AbdAlfrescoAuthenticationService.isOauth2(alfrescoApi) &&
        cookie.isEnabled() && !AbdAlfrescoAuthenticationService.isRememberMeSet2(cookie)) {
            return false;
        }
        return alfrescoApi.getInstance().isLoggedIn();
    }

    public static isRememberMeSet2(cookie: CookieService): boolean {
      return (cookie.getItem(REMEMBER_ME_COOKIE_KEY) !== null);
    }

    public static isLoggedInWith2(provider: string, alfrescoApi: AlfrescoApiService, cookie: CookieService): boolean {
        if (provider === 'BPM') {
            return AbdAlfrescoAuthenticationService.isBpmLoggedIn2(alfrescoApi, cookie);
        } else if (provider === 'ECM') {
            return AbdAlfrescoAuthenticationService.isEcmLoggedIn2(alfrescoApi, cookie);
        } else {
            return AbdAlfrescoAuthenticationService.isLoggedIn2(alfrescoApi, cookie);
        }
    }

    public static isEcmLoggedIn2(alfrescoApi: AlfrescoApiService, cookie: CookieService): boolean {
        if (AbdAlfrescoAuthenticationService.isECMProvider2(alfrescoApi) || AbdAlfrescoAuthenticationService.isALLProvider2(alfrescoApi)) {
            if (!AbdAlfrescoAuthenticationService.isOauth2(alfrescoApi) &&
                cookie.isEnabled() &&
                !AbdAlfrescoAuthenticationService.isRememberMeSet2(cookie)) {
                return false;
            }
            return alfrescoApi.getInstance().isEcmLoggedIn();
        }
        return false;
    }

    public static isBpmLoggedIn2(alfrescoApi: AlfrescoApiService, cookie: CookieService): boolean {
        if (AbdAlfrescoAuthenticationService.isBPMProvider2(alfrescoApi) || AbdAlfrescoAuthenticationService.isALLProvider2(alfrescoApi)) {
            if (!AbdAlfrescoAuthenticationService.isOauth2(alfrescoApi) &&
              cookie.isEnabled() &&
              !AbdAlfrescoAuthenticationService.isRememberMeSet2(cookie)) {
                return false;
            }
            return alfrescoApi.getInstance().isBpmLoggedIn();
        }
        return false;
    }

    public static isOauth2(alfrescoApi: AlfrescoApiService): boolean {
        return alfrescoApi.getInstance().isOauthConfiguration();
    }

    public static isPublicUrl2(alfrescoApi: AlfrescoApiService): boolean {
        return alfrescoApi.getInstance().isPublicUrl();
    }

    public static isECMProvider2(alfrescoApi: AlfrescoApiService): boolean {
        return alfrescoApi.getInstance().isEcmConfiguration();
    }

    public static isBPMProvider2(alfrescoApi: AlfrescoApiService): boolean {
        return alfrescoApi.getInstance().isBpmConfiguration();
    }


    public static isALLProvider2(alfrescoApi: AlfrescoApiService): boolean {
        return alfrescoApi.getInstance().isEcmBpmConfiguration();
    }

    /**
     * Checks if the user logged in.
     * @returns True if logged in, false otherwise
     */
    public isLoggedIn(): boolean {
        if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
            return false;
        }
        return this.alfrescoApi.getInstance().isLoggedIn();
    }

    public isLoggedInWith(provider: string): boolean {
        if (provider === 'BPM') {
            return this.isBpmLoggedIn();
        } else if (provider === 'ECM') {
            return this.isEcmLoggedIn();
        } else {
            return this.isLoggedIn();
        }
    }

    /**
     * Does the provider support OAuth?
     * @returns True if supported, false otherwise
     */
    public isOauth(): boolean {
        return this.alfrescoApi.getInstance().isOauthConfiguration();
    }

    public isPublicUrl(): boolean {
        return this.alfrescoApi.getInstance().isPublicUrl();
    }

    /**
     * Does the provider support ECM?
     * @returns True if supported, false otherwise
     */
    public isECMProvider(): boolean {
        return this.alfrescoApi.getInstance().isEcmConfiguration();
    }

    /**
     * Does the provider support BPM?
     * @returns True if supported, false otherwise
     */
    public isBPMProvider(): boolean {
        return this.alfrescoApi.getInstance().isBpmConfiguration();
    }

    /**
     * Does the provider support both ECM and BPM?
     * @returns True if both are supported, false otherwise
     */
    public isALLProvider(): boolean {
        return this.alfrescoApi.getInstance().isEcmBpmConfiguration();
    }

    /**
     * Logs the user in.
     * @param username Username for the login
     * @param password Password for the login
     * @param rememberMe Stores the user's login details if true
     * @returns Object with auth type ("ECM", "BPM" or "ALL") and auth ticket
     */
    public login(username: string, password: string, rememberMe: boolean): Observable<{ type: string, ticket: any }> {
        return from(this.alfrescoApi.getInstance().login(username, password))
            .pipe(
                map((response: any) => {
                    this.saveRememberMeCookie(rememberMe);
                    this.onLogin.next(response);
                    return {
                        type: this.appConfig.get(AppConfigValues.PROVIDERS),
                        ticket: response
                    };
                }),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Logs the user in with SSO
     */
    public ssoImplicitLogin() {
        this.alfrescoApi.getInstance().implicitLogin();
    }

    /**
     * Saves the "remember me" cookie as either a long-life cookie or a session cookie.
     * @param rememberMe Enables a long-life cookie
     */
    private saveRememberMeCookie(rememberMe: boolean): void {
        let expiration = null;

        if (rememberMe) {
            expiration = new Date();
            const time = expiration.getTime();
            const expireTime = time + REMEMBER_ME_UNTIL;
            expiration.setTime(expireTime);
        }
        this.cookie.setItem(REMEMBER_ME_COOKIE_KEY, '1', expiration, null);
    }

    /**
     * Checks whether the "remember me" cookie was set or not.
     * @returns True if set, false otherwise
     */
    public isRememberMeSet(): boolean {
        return (this.cookie.getItem(REMEMBER_ME_COOKIE_KEY) !== null);
    }

    /**
     * Logs the user out.
     * @returns Response event called when logout is complete
     */
    public logout() {
        return from(this.callApiLogout())
            .pipe(
                tap((response) => {
                    this.onLogout.next(response);
                    return response;
                }),
                catchError((err) => this.handleError(err))
            );
    }

    private callApiLogout(): Promise<any> {
        if (this.alfrescoApi.getInstance()) {
            return this.alfrescoApi.getInstance().logout();
        }
        return Promise.resolve();
    }

    /**
     * Gets the ECM ticket stored in the Storage.
     * @returns The ticket or `null` if none was found
     */
    public getTicketEcm(): string | null {
        return this.alfrescoApi.getInstance().getTicketEcm();
    }

    /**
     * Gets the BPM ticket stored in the Storage.
     * @returns The ticket or `null` if none was found
     */
    public getTicketBpm(): string | null {
        return this.alfrescoApi.getInstance().getTicketBpm();
    }

    /**
     * Gets the BPM ticket from the Storage in Base 64 format.
     * @returns The ticket or `null` if none was found
     */
    public getTicketEcmBase64(): string | null {
        const ticket = this.alfrescoApi.getInstance().getTicketEcm();
        if (ticket) {
            return 'Basic ' + btoa(ticket);
        }
        return null;
    }

    /**
     * Checks if the user is logged in on an ECM provider.
     * @returns True if logged in, false otherwise
     */
    public isEcmLoggedIn(): boolean {
        if (this.isECMProvider() || this.isALLProvider()) {
            if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
                return false;
            }
            return this.alfrescoApi.getInstance().isEcmLoggedIn();
        }
        return false;
    }

    /**
     * Checks if the user is logged in on a BPM provider.
     * @returns True if logged in, false otherwise
     */
    public isBpmLoggedIn(): boolean {
        if (this.isBPMProvider() || this.isALLProvider()) {
            if (!this.isOauth() && this.cookie.isEnabled() && !this.isRememberMeSet()) {
                return false;
            }
            return this.alfrescoApi.getInstance().isBpmLoggedIn();
        }
        return false;
    }

    /**
     * Gets the ECM username.
     * @returns The ECM username
     */
    public getEcmUsername(): string {
        return this.alfrescoApi.getInstance().getEcmUsername();
    }

    /**
     * Gets the BPM username
     * @returns The BPM username
     */
    public getBpmUsername(): string {
        return this.alfrescoApi.getInstance().getBpmUsername();
    }

    /** Sets the URL to redirect to after login.
     * @param url URL to redirect to
     */
    public setRedirect(url: RedirectionModel) {
        this.redirectUrl = url;
    }

    /** Gets the URL to redirect to after login.
     * @returns The redirect URL
     */
    public getRedirect(): string {
        const provider = <string> this.appConfig.get(AppConfigValues.PROVIDERS);
        return this.hasValidRedirection(provider) ? this.redirectUrl.url : null;
    }

    /**
     * Gets information about the user currently logged into APS.
     * @returns User information
     */
    public getBpmLoggedUser(): Observable<UserRepresentation> {
        return from(this.alfrescoApi.getInstance().activiti.profileApi.getProfile());
    }

    private hasValidRedirection(provider: string): boolean {
        return this.redirectUrl && (this.redirectUrl.provider === provider || this.hasSelectedProviderAll(provider));
    }

    private hasSelectedProviderAll(provider: string): boolean {
        return this.redirectUrl && (this.redirectUrl.provider === 'ALL' || provider === 'ALL');
    }

    /**
     * Prints an error message in the console browser
     * @param error Error message
     * @returns Object representing the error message
     */
    public handleError(error: any): Observable<any> {
        this.logService.error('Error when logging in', error);
        return throwError(error || 'Server error');
    }

    /**
     * Gets the set of URLs that the token bearer is excluded from.
     * @returns Array of URL strings
     */
    public getBearerExcludedUrls(): string[] {
        return this.bearerExcludedUrls;
    }

    /**
     * Gets the auth token.
     * @returns Auth token string
     */
    public getToken(): string {
        return this.storageService.getItem(JwtHelperService.USER_ACCESS_TOKEN);
    }

    /**
     * Adds the auth token to an HTTP header using the 'bearer' scheme.
     * @param headersArg Header that will receive the token
     * @returns The new header with the token added
     */
    public addTokenToHeader(headersArg?: HttpHeaders): Observable<HttpHeaders> {
        return new Observable((observer: Observer<any>) => {
            let headers = headersArg;
            if (!headers) {
                headers = new HttpHeaders();
            }
            try {
                const token: string = this.getToken();
                headers = headers.set('Authorization', 'bearer ' + token);
                observer.next(headers);
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        });
    }
}
