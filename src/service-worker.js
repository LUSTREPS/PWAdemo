importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
  if (event.tag === 'post-data') {
    // call method
    console.log('The sync event has been fired');
    event.waitUntil(getDataAndSend());
  }
});
  function addData(name, objectStore) {
    //indexDb
    for(let word of name.result) {
      const data = objectStore.get(word);
      data.onsuccess = (event) => {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${data.result}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(() => {
            // success block
            this.deleteData(word);
          })
          .catch(() => {
            //error block
          });
          };
    }
    
  }
  function addData1(name, objectStore) {
    //indexDb
    for(let word of name.result) {
      const data = objectStore.get(word);
      data.onsuccess = (event) => {
        fetch(`https://reqres.in/api/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: { title: this.articleName }
        })
          .then(() => {
            // success block
            //this.deleteData(word);
          })
          .catch(() => {
            //error block
          });
          };
    }
    
  }

  function deleteData(key) {
    let db;
    const request = indexedDB.open('my-db');
    request.onerror = (event) => {
      console.log('Failed to open Db');
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      const transaction = db.transaction('https://api.dictionaryapi.dev/api/v2/entries/en/', 'readwrite');
      const objectStore = transaction.objectStore('https://api.dictionaryapi.dev/api/v2/entries/en/');
      const request = objectStore.delete(key);
      request.onerror = (event) => {
        console.log('Deleted Error');
      };
      request.onsuccess = (event) => {
        console.log('Deleted successfully');
      };
    };
  }

  function getDataAndSend() {
    let db;
    const request = indexedDB.open('my-db');
    request.onerror = (event) => {
      console.log('Failed to open Db');
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('The sync event has been fired');
      getData(db);
    };
  }
  
  function getData(db) {
    const transaction = db.transaction(['https://api.dictionaryapi.dev/api/v2/entries/en/']);
    const objectStore = transaction.objectStore('https://api.dictionaryapi.dev/api/v2/entries/en/');
    const request = objectStore.getAllKeys();
    request.onerror = (event) => {
      // Handle errors!
    };
    request.onsuccess = (event) => {
      addData(request, objectStore);
      console.log('Name of the user is ' + request.result);
    };
  }

  function getData1(db) {
    const transaction = db.transaction(['https://reqres.in/api/posts']);
    const objectStore = transaction.objectStore('https://reqres.in/api/posts');
    const request = objectStore.getAllKeys();
    request.onerror = (event) => {
      // Handle errors!
    };
    request.onsuccess = (event) => {
      addData1(request, objectStore);
      console.log('Name of the user is ' + request.result);
    };
  }