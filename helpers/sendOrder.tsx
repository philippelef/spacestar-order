export default async function sendOrder(orderInfo) {
    const { MongoClient } = require("mongodb");
    let newStockQty = -1
    const uri =
        "mongodb+srv://freddies:freddies@cluster0.paf77.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    // Create a new MongoClient
    try {
        const client = new MongoClient(uri);
        await client.connect()

        // Check Stock
        let cdItem = await client.db("cryptenstore").collection("items").findOne()
        const currentQty = cdItem.stock
        if (currentQty < orderInfo.qty) {
            console.log("Not enough stock")
            return 0;
        }


        var myobj = { orderInfo };
        await client.db("cryptenstore").collection("orders").insertOne(myobj)

        // Reduce Stock
        const myQuery = { name: "CD SPACESTAR" }
        newStockQty = currentQty - orderInfo.qty
        const newValues = { $set: { stock: newStockQty } }
        await client.db("cryptenstore").collection("items").updateOne(myQuery, newValues)

    }
    catch (err) {
        console.log("Send Order API error: ", err)
        return -1
    }

    try {
        //DISCORD BOT
        const { Client, Intents } = require("discord.js");
        const discordClient = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
        });


        const message = `${orderInfo.firstName} ${orderInfo.lastName} à commandé ${orderInfo.qty} CD à ${orderInfo.city}`

        discordClient.login("OTQ4OTQ2Njc4NzAwOTY1OTE5.YiDNdg.va3SXH9kBvuaaytTTg5w2ivr27k");


        discordClient.once('ready', () => {
            discordClient.user.setActivity(`Stock: ${newStockQty}`, { type: 'WATCHING' });
            discordClient.channels.cache.get('948955981369466960').send(message);
        });

    }
    catch (e) {
        console.log("DISCORD ERROR:", e)
    }


    return 1;
}