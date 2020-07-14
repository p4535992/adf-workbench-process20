/* tslint:disable:no-console  */

import { Injectable } from '@angular/core';
//import { AppConfigService, AppConfigValues } from '../app-config/app-config.service';
//import { logLevels, LogLevelsEnum } from '../models/log-levels.model';
import { Subject } from 'rxjs';


export class LogLevelsEnum extends Number {
  static TRACE: number = 5;
  static DEBUG: number = 4;
  static INFO: number = 3;
  static WARN: number = 2;
  static ERROR: number = 1;
  static SILENT: number = 0;
}

export let logLevels: any[] = [
  {level: LogLevelsEnum.TRACE, name: 'TRACE'},
  {level: LogLevelsEnum.DEBUG, name: 'DEBUG'},
  {level: LogLevelsEnum.INFO, name: 'INFO'},
  {level: LogLevelsEnum.WARN, name: 'WARN'},
  {level: LogLevelsEnum.ERROR, name: 'ERROR'},
  {level: LogLevelsEnum.SILENT, name: 'SILENT'}
];

@Injectable({
    providedIn: 'root'
})
export class AbdLogService {

    get currentLogLevel() {
        const configLevel: string = 'DEBUG'; // this.appConfig.get<string>(AppConfigValues.LOG_LEVEL);

        if (configLevel) {
            return this.getLogLevel(configLevel);
        }

        return LogLevelsEnum.TRACE;
    }

    onMessage: Subject<any>;

    //constructor(private appConfig: AppConfigService) {
    //    this.onMessage = new Subject();
    //}

    constructor() {
      this.onMessage = new Subject();
    }

    /**
     * Logs a message at the "ERROR" level.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    error(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.ERROR) {

            this.messageBus(message, 'ERROR');

            console.error(message, ...optionalParams);
        }
    }

    /**
     * Logs a message at the "DEBUG" level.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    debug(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.DEBUG) {

            this.messageBus(message, 'DEBUG');

            console.debug(message, ...optionalParams);
        }
    }

    /**
     * Logs a message at the "INFO" level.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    info(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.INFO) {

            this.messageBus(message, 'INFO');

            console.info(message, ...optionalParams);
        }
    }

    /**
     * Logs a message at any level from "TRACE" upwards.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    log(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.TRACE) {

            this.messageBus(message, 'LOG');

            console.log(message, ...optionalParams);
        }
    }

    /**
     * Logs a message at the "TRACE" level.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    trace(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.TRACE) {

            this.messageBus(message, 'TRACE');

            console.trace(message, ...optionalParams);
        }
    }

    /**
     * Logs a message at the "WARN" level.
     * @param message Message to log
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    warn(message?: any, ...optionalParams: any[]) {
        if (this.currentLogLevel >= LogLevelsEnum.WARN) {

            this.messageBus(message, 'WARN');

            console.warn(message, ...optionalParams);
        }
    }

    /**
     * Logs a message if a boolean test fails.
     * @param test Test value (typically a boolean expression)
     * @param message Message to show if test is false
     * @param optionalParams Interpolation values for the message in "printf" format
     */
    assert(test?: boolean, message?: string, ...optionalParams: any[]) {
        if (this.currentLogLevel !== LogLevelsEnum.SILENT) {

            this.messageBus(message, 'ASSERT');

            console.assert(test, message, ...optionalParams);
        }
    }

    /**
     * Starts an indented group of log messages.
     * @param groupTitle Title shown at the start of the group
     * @param optionalParams Interpolation values for the title in "printf" format
     */
    group(groupTitle?: string, ...optionalParams: any[]) {
        if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
            console.group(groupTitle, ...optionalParams);
        }
    }

    /**
     * Ends a indented group of log messages.
     */
    groupEnd() {
        if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
            console.groupEnd();
        }
    }

    /**
     * Converts a log level name string into its numeric equivalent.
     * @param level Level name
     * @returns Numeric log level
     */
    getLogLevel(level: string): LogLevelsEnum {
        const referencedLevel = logLevels.find((currentLevel: any) => {
            return currentLevel.name.toLocaleLowerCase() === level.toLocaleLowerCase();
        });

        return referencedLevel ? referencedLevel.level : 5;
    }

    /**
     * Triggers notification callback for log messages.
     * @param text Message text
     * @param logLevel Log level for the message
     */
    messageBus(text: string, logLevel: string) {
        this.onMessage.next({ text: text, type: logLevel });
    }
}
