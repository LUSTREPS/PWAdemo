import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

@Injectable({
  providedIn: 'root'
})


export class IndexedDBService {

  private db!: IDBPDatabase<MyDB>;
  constructor() { 
    this.connectToDb();
  }

  async connectToDb() {
    this.db = await openDB<MyDB>('my-db', 1, {
      upgrade(db) {
        db.createObjectStore('https://reqres.in/api/posts');
        db.createObjectStore('https://api.dictionaryapi.dev/api/v2/entries/en/');
      },
    });
  }

  addUser(api: string, name: string) {
    switch(api) {
      case API.REQRES:
        return this.db.add('https://reqres.in/api/posts', name, new Date().toString());
      case API.DICTIONARY:
        return this.db.add('https://api.dictionaryapi.dev/api/v2/entries/en/', name, new Date().toString());
      default:
        return Promise.reject();
    }

    
  }

  deleteUser(key:string) {

    return this.db.delete('https://api.dictionaryapi.dev/api/v2/entries/en/', key);
  }
}

enum API {
  REQRES = 'https://reqres.in/api/posts',
  DICTIONARY = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
}

interface MyDB extends DBSchema {
  'https://reqres.in/api/posts': {
    key: string;
    value: string;
  };
  'https://api.dictionaryapi.dev/api/v2/entries/en/': {
    key: string;
    value: string;
  };
}
