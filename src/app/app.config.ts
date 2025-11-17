import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { definePreset } from '@primeuix/themes';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token-interceptor';

const MoneyPreset = definePreset(Lara, {
  semantic: {
    colorScheme: {
      light: {
        semantic: {
          primary: {
            50: '#f1f3fe',
            100: '#e5e9fd',
            200: '#d1d8fc',
            300: '#b5c0fa',
            400: '#93a3f9',
            500: '#607AFB', // Tu color base
            600: '#4b65f2',
            700: '#3c52d9',
            800: '#3346b3',
            900: '#2d3c94',
            950: '#1e2865',
          },
        },
      },
      dark: {
        semantic: {
          primary: {
            50: '{violet.50}',
            100: '{violet.100}',
            200: '{violet.200}',
            300: '{violet.300}',
            400: '{violet.400}',
            500: '{violet.500}',
            600: '{violet.600}',
            700: '{violet.700}',
            800: '{violet.800}',
            900: '{violet.900}',
            950: '{violet.950}',
          }
        }
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor]),
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MoneyPreset,
        options: {
          darkModeSelector: '.dark-mode',
        }
      },
    }),
  ],
};
