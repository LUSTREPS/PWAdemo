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
        db.createObjectStore('https://api.api-ninjas.com/v1/thesaurus?word=');
      },
    });
  }

  addUser(api: API, payload: any, method: method, options: RequestInit = {}) {

    return this.db.add(api, JSON.stringify({ payload, method, options }), new Date().toString()).catch(error => {console.log(error)});
  }
}

export enum method {
  GET = 'GET',
  POST = 'POST'
}

export enum API {
  REQRES = 'https://reqres.in/api/posts',
  DICTIONARY = 'https://api.dictionaryapi.dev/api/v2/entries/en/',
  ANTONYM = 'https://api.api-ninjas.com/v1/thesaurus?word='
}

export interface MyDB extends DBSchema {
  'https://reqres.in/api/posts': {
    key: string;
    value: string;
  };
  'https://api.dictionaryapi.dev/api/v2/entries/en/': {
    key: string;
    value: string;
  };
  'https://api.api-ninjas.com/v1/thesaurus?word=': {
    key: string;
    value: string;
  };
}
