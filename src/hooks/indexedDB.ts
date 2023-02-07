
interface Note {
  title: string
  chapter: string
  question: string
  answer: string
}

const DEFAULT_NOTES: Note[] = [
  {
    title: "Sobre los macarrones",
    chapter: 'cocina',
    question: '¿Cuánto tiempo se tienen que cocer los macarrones para estar al dente?',
    answer: 'Entre 10 y 12 minutos'
  },
  {
    title: "Sobre los pepinos",
    chapter: 'cocina',
    question: '¿Cuánto tiempo se tienen que cocer los pepinos para estar al dente?',
    answer: 'Los pepinos ya están al dente'
  },
]

export async function checkDB() {
  const response = await window.indexedDB.databases()
  console.log(response)
  return response
}

export function connectDB(subject: string = 'subject 1'): Boolean {
  const name = 'notes'
  // open or create if not exists db
  const request = window.indexedDB.open(name, 1)
  let db: IDBDatabase

  // TODO if error because not permission, ask
  request.onerror = (event) => console.log(`errored => ${(event.target as IDBOpenDBRequest).error}`)

  request.onupgradeneeded = (event) => {
    db = request.result

    const subject1Store = db.createObjectStore(subject, { keyPath: 'title' })
    // set custom identifiers to search by
    subject1Store.createIndex(subject, 'chapter', { unique: false })

  }

  request.onsuccess = (event) => {
    db = request.result
    console.log(`successed ${db.name} - ${db.version}`)
  }
  return true
}


async function queryDB() {
  // open or create if not exists db
  const request = window.indexedDB.open('notes', 1)
  let db: IDBDatabase

  // TODO if error because not permission, ask
  request.onerror = (event) => console.log(`errored => ${(event.target as IDBOpenDBRequest).error}`)
  /*
    when new db or new version this is triggered
    if good, the onsuccess triggers
  */
  request.onupgradeneeded = (ev) => {
    const database = request.result
    // record identifier - more useful to use a guid or something similar
    const subject1Store = database.createObjectStore('subject 1', { keyPath: 'title' })
    // set custom identifiers to search by
    subject1Store.createIndex('subject', 'subject', { unique: false })

    // before adding data we must check if the objectStore is created
    subject1Store.transaction.oncomplete = (event) => {
      const noteObjectStore = database
        .transaction('subject 1', 'readwrite')
        .objectStore('subject 1')

      DEFAULT_NOTES.forEach(note => {
        console.log(note.title)
        noteObjectStore.add(note)
      })
    }
  }
  /* triggers if
    - the version we're trying to access is the one found already
    - onupgradeneeded exits successfully
  */
  request.onsuccess = (event: Event) => {
    // db = event.target?.result
    db = request.result
    console.log(`successed ${request.result.version}`)
  }
}