import { NuxtAuthHandler } from "#auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoClient, ServerApiVersion } from 'mongodb'

const user = import.meta.env.VITE_USER
const password = encodeURIComponent(`${import.meta.env.VITE_PASSWORD}`)
const remote = `mongodb+srv://${user}:${password}@developmentdb.g1e4gym.mongodb.net/?retryWrites=true&w=majority`
const local = "mongodb://127.0.0.1:27017"
const client = new MongoClient(local, { serverApi: ServerApiVersion.v1 })

let database: any
let userAuth: any
let collection: any

(async () => {
  await client.connect().then(res => console.log('Connected to database.')).catch(err => console.log(err))
  database = client.db(`${import.meta.env.VITE_DB}`)
  collection = database.collection("admin")
})()

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  pages: {
    signIn: '/login'
  },
  secret: `${import.meta.env.VITE_SECRET_HASH}`,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      authorize (credentials: any) {
        (async () => {
          const find = collection.find({ email: credentials.email })
          userAuth = await find.toArray()
        })()

        if (!userAuth.length) return null

        if (credentials.password === userAuth[0].password) return credentials
        else return null
      }
    })
  ]
})