importScripts('./ngsw-worker.js');

indexedAPIs = ['https://reqres.in/api/posts', 
'https://api.dictionaryapi.dev/api/v2/entries/en/', 
'https://api.api-ninjas.com/v1/thesaurus?word='
];

self.addEventListener('sync', (event) => {
  if (event.tag === 'post-data') {
    // call method
    console.log('The sync event has been fired');
    event.waitUntil(getDataAndSend());
  }
});

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
  const transaction = db.transaction(indexedAPIs);
  indexedAPIs.forEach(api => {
    const objectStore = transaction.objectStore(api);
    const request = objectStore.getAllKeys();
    request.onerror = (event) => {
      // Handle errors!
    };
    request.onsuccess = (event) => {
      addData(request, objectStore);
      console.log('Name of the user is ' + request.result);
    };
  });
}

function addData(keys, objectStore) {
  //indexDb
  for(let key of keys.result) {
    const data = objectStore.get(key);
    data.onsuccess = (event) => {
      const jsonData = JSON.parse(data.result);
      switch(jsonData.method) {
        case 'GET':
          fetchGetAPI(jsonData, objectStore.name, key);
          break;
        case 'POST':
          fetchPostAPI(jsonData, objectStore.name, key);
          break;
        default:
          console.log(`unsupported API request method ${jsonData.method}`);
      }
    };
  } 
}

function fetchGetAPI(jsonData, url, key) {
  jsonData.options.method = 'GET';
  fetch(url+jsonData.payload, jsonData.options)
  .then(() => {
    deleteData(url, key);
  })
  .catch(() => {
    //error block
  });
}

function fetchPostAPI(jsonData, url, key) {
  jsonData.options.method = 'POST';
  jsonData.options.body = JSON.stringify(jsonData.payload)
  fetch(url, jsonData.options)
  .then(() => {
    deleteData(url, key);
  })
  .catch(() => {
    //error block
  });
}

function deleteData(url, key) {
  let db;
  const request = indexedDB.open('my-db');
  request.onerror = (event) => {
    console.log('Failed to open Db');
  };
  request.onsuccess = (event) => {
    db = event.target.result;
    const transaction = db.transaction(url, 'readwrite');
    const objectStore = transaction.objectStore(url);
    const request = objectStore.delete(key);
    request.onerror = (event) => {
      console.log('Deleted Error');
    };
    request.onsuccess = (event) => {
      console.log('Deleted successfully');
    };
  };
}

  