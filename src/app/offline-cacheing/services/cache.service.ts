import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor(
    private http: HttpClient
  ) { }

  exportCache() {
    //let obj = new Map<Request, Response | undefined>();
    const sto1 = window.caches.open('ngsw:/:1:data:api-fresh:cache').then((cache: Cache) => {
      const key = cache.keys().then(keys => {
        for(let key of keys) {
          const mat = cache.match(key).then(res => {
            res?.json().then(bod => {
              let url = key.url.split('/');
              let blob = new Blob([JSON.stringify({
                url: key.url,
                body: bod
              })]);
              FileSaver.saveAs(blob, `${url[url.length-1]}.json`);
            });
          });
        }
      });
      const sto = window.caches.open('post-cache').then(cache => {
        const key = cache.keys();
      });
    });
  }
}
