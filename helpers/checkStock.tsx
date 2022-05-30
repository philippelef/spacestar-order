export default async function checkStock() {
    const { MongoClient } = require("mongodb");
    const uri =
        "mongodb+srv://freddies:freddies@cluster0.paf77.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    // Create a new MongoClient
    const client = new MongoClient(uri);
    async function run() {
        try {
            await client.connect();
            const cursor = client.db("cryptenstore").collection("orders").find({})
            const itemArray = await cursor.toArray()
            return itemArray[0]?.stock
        }
        catch {
            console.log("Could not check item stock.")
            return -1;
        }
        finally {
            await client.close();
        }
    }

    const stock = await run()
    console.log("return stock", stock)
    return stock
}
