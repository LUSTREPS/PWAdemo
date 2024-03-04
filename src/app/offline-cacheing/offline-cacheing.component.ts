import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from './services/cache.service';
import { IndexedDBService, API, method } from './services/indexed-db.service';

@Component({
  selector: 'app-offline-cacheing',
  templateUrl: './offline-cacheing.component.html',
  styleUrls: ['./offline-cacheing.component.sass']
})
export class OfflineCacheingComponent {
  word = '';
  meaning: string = '';
  opposit = '';
  antonym = '';
  articleName = '';
  bookId?: number;
  title = 'PWIdemo';

  constructor(
    private readonly http: HttpClient,
    private indexedDBService: IndexedDBService,
    private cacheService: CacheService,
    private readonly router: Router
  ) {}

  navHome() {
    this.router.navigate(['/offline/home']).catch(() => {});
  }

  navAbout() {
    this.router.navigate(['/offline/about']).catch(() => {});
  }

  navView() {
    this.router.navigate(['/offline/view']).catch(() => {});
  }

  exportCache() {
    this.cacheService.exportCache();
  }
  /* onSubmit() {
    console.log('Form submitted:', this.userName);
    // Here, you can add logic to authenticate the user
  } */

  callGetApi() {
    this.http.get<any[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`).subscribe(data => {
        this.meaning = data[0].word;
    },
    ()=> {
      this.meaning = '';
      console.log("Failed response");
      this.indexedDBService
        .addUser(API.DICTIONARY, this.word, method.GET)
        .then(this.backgroundSync)
        .catch(console.log);
    });
  }

  getOppositAPI() {
    this.http.get<any>(`https://api.api-ninjas.com/v1/thesaurus?word=${this.opposit}`, {headers: {
      'X-Api-Key': '/xe0OtQI2auzCbg9YMR6NQ==lH0J1FphYdRrVK7a'
    }}).subscribe(data => {
        this.antonym = data.antonyms[0];
    },
    ()=> {
      this.antonym = '';
      console.log("Failed response");
      this.indexedDBService
        .addUser(API.ANTONYM, this.opposit, method.GET, {headers: {
          'X-Api-Key': '/xe0OtQI2auzCbg9YMR6NQ==lH0J1FphYdRrVK7a'
        }})
        .then(this.backgroundSync)
        .catch(error => {
          console.log
        });
    });
  }

  callPostApi() {
    this.http.post<any>('https://reqres.in/api/posts', { title: this.articleName }).subscribe(data => {
        this.bookId = data.id;
        //this.cacheService.savePostRequest();
    },
    ()=> {
      console.log("Failed response");
      this.bookId = undefined;
      this.indexedDBService
        .addUser(API.REQRES, { title: this.articleName }, method.POST)
        .then(this.backgroundSync)
        .catch(console.log);
    });
  }

  backgroundSync() {
    console.log('test when the event is triggered')
    interface SyncManager {
      register(tag: string): Promise<void>;
    }
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then((registration) => {
          // Check if the 'sync' property exists on ServiceWorkerRegistration
          if ('sync' in registration) {
            // Explicitly cast to a type that includes the 'sync' property
            const syncRegistration = registration as ServiceWorkerRegistration & { sync: SyncManager };

            // Now you can use the 'sync' property
            return syncRegistration.sync.register('post-data');
          } else {
            throw new Error('Background Sync is not supported');
          }
        })
        .then(() => {
          console.log('Background sync registered successfully');
        })
        .catch((error) => {
          console.error('Error during background sync registration:', error);
        });
    } else {
      console.error('Service workers or Background Sync are not supported in this browser');
    }

  }
}
