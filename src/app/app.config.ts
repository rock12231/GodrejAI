import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideRouter(routes, withRouterConfig({})),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideHttpClient(),
    provideHttpClient(withFetch()),
    importProvidersFrom(MarkdownModule.forRoot())
  ]
};
