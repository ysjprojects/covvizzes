import { MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb'

const uri: string | undefined = process.env.MONGODB_URI

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local')
}


let cachedClient: any;
let cachedDbs: any;


export async function connectToDatabase() {
    // check the cached.
    if (cachedClient && cachedDbs) {
        console.log("load from cache")
        return {
            client: cachedClient,
            dbDaily: cachedDbs[0],
            dbTs: cachedDbs[1],

        };
    }

    // set the connection options
    const opts: MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 };

    // Connect to cluster
    let client: MongoClient = new MongoClient(uri as string, opts);
    console.log("connecting...")
    await client.connect();
    console.log("connected!")

    let db1 = client.db('covvizzes_daily');
    let db2 = client.db('covvizzes_ts');

    // set cache
    cachedClient = client;
    cachedDbs = [db1, db2];

    return {
        client: cachedClient,
        dbDaily: cachedDbs[0],
        dbTs: cachedDbs[1],

    };
}

