import { environment } from 'environments/environment';
/**
 * Angular 2
 */
import {
  enableDebugTools,
  disableDebugTools,
} from '@angular/platform-browser';
import {
  ApplicationRef,
  enableProdMode,
} from '@angular/core';

/**
 * Environment Providers
 */
const PROVIDERS: any[] = [
  /**
   * Common env directives
   */
];

/**
 * Angular debug tools in the dev console
 * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
 */
let _decorateModuleRef: <T>(T: any) => T;

/* istanbul ignore if */
if ('production' === environment.NODE_ENV) {
  enableProdMode();

  /**
   * Production
   */
  _decorateModuleRef = (modRef: any) => {
    disableDebugTools();

    return modRef;
  };

} else {

  /* istanbul ignore next */
  _decorateModuleRef = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    enableDebugTools(cmpRef);
    return modRef;
  };

}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS,
];
