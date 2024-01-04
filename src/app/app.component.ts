import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IndexedDBService } from './services/indexed-db.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'PWIdemo';
  meaning: string = '';
  bookId?: number;

  constructor(
    private readonly http: HttpClient,
    private indexedDBService: IndexedDBService,
    private readonly router: Router
  ) { }

  word = '';
  articleName = '';


  navHome() {
    this.router.navigate(['home']).catch(() => {});
  }

  navAbout() {
    this.router.navigate(['about']).catch(() => {});
  }

  navView() {
    this.router.navigate(['view']).catch(() => {});
  }
  /* onSubmit() {
    console.log('Form submitted:', this.userName);
    // Here, you can add logic to authenticate the user
  } */

  callGetApi() {
    this.http.get<Word[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`).pipe(map(res=>res)).subscribe(data => {
        this.meaning = data[0].word;
    },
    ()=> {
      this.meaning = '';
      console.log("Failed response");
      this.indexedDBService
        .addUser(`https://api.dictionaryapi.dev/api/v2/entries/en/`, this.word)
        .then(this.backgroundSync)
        .catch(console.log);
    });
  }

  callPostApi() {
    this.http.post<Article>('https://reqres.in/api/posts', { title: this.articleName }).subscribe(data => {
        this.bookId = data.id;
    },
    ()=> {
      console.log("Failed response");
      this.bookId = undefined;
      this.indexedDBService
        .addUser('https://reqres.in/api/posts', this.articleName)
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

interface Word {
  word: string,
  phonetic: string,
  phonetics: Object[]
}

interface Article {
  id:number;
  title: string;
}