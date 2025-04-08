import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient, ServerApiVersion } from "mongodb";

const user = import.meta.env.VITE_USER;
const password = encodeURIComponent(`${import.meta.env.VITE_PASSWORD}`);
const remote = `mongodb+srv://${user}:${password}@developmentdb.g1e4gym.mongodb.net/?retryWrites=true&w=majority`;
const local = "mongodb://127.0.0.1:27017";
const client = new MongoClient(remote, { serverApi: ServerApiVersion.v1 });

(async () => {
  await client.connect().then(res => console.log('Connected to DB from Auth.')).catch(err => console.log(err));
})()

const database: any = client.db(`${import.meta.env.VITE_DB}`);
const collection: any = database.collection("admin");
let userAuth: any;

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  pages: {
    signIn: '/login'
  },
  secret: `${import.meta.env.VITE_SECRET_HASH}`,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      async authorize (credentials: any) {
        const search = collection.find({ email: credentials.email });
        userAuth = await search.toArray();

        if (userAuth.length !== 0) {
          if (credentials.password === userAuth[0].password) return credentials
          else return null
        } else return null
      }
    })
  ]
})