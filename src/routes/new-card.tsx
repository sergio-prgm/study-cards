import { createEffect, createSignal, For } from "solid-js";
import { checkDB, connectDB } from "~/hooks/indexedDB";

type FormFields =  {
  title: string,
  description: string
}

export default function Page() {
  const [formC, setFormC] = createSignal<FormFields>({
    title: '',
    description: ''
  })

  const [databases, setDatabases] = createSignal<IDBDatabaseInfo[]>()

  const logit = (form: any) => {
    form.preventDefault()
    localStorage.setItem('form-data', JSON.stringify(formC()))
    console.log(formC())
  }

  // createEffect(() => console.log(databases(), databases().length))

  const dbStatus = async () => {
    const dbbs = await checkDB()
    setDatabases(dbbs)
  }

  return (
    <main>
      <h1 class="text-3xl">New Card</h1>
      <button class="block bg-sky-900 text-white py-2 px-4" onClick={dbStatus}>DB stuff</button>
      <button class="block bg-sky-900 text-white py-2 px-4" onClick={() => connectDB('note')}>Connect</button>
      <For each={databases()}>{(db, i) => 
        <p><span>Database: {i() + 1} </span>{db.name}</p>
      }
      </For>
      <form onSubmit={logit}>
        <label class="block">
          Title
          <input
            type="text"
            name="title"
            id="title"
            class="border border-black"
            value={formC().title}
            onChange={(e) => setFormC((prev) => ({...prev, title: e.currentTarget.value}))}
            />
        </label>
        <label class="block">
          Description
          <input
            type="text"
            name="description"
            id="description"
            class="border border-black"
            value={formC().description}
            onChange={(e) => setFormC((prev) => ({...prev, description: e.currentTarget.value}))}
            />
        </label>
        <button type="submit" class="block bg-black text-white py-2 px-4">Create Card</button>
      </form>
    </main>
  )
}
