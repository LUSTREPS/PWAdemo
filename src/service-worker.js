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
          })
          .catch(() => {
            //error block
          });
          };
    }
    
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