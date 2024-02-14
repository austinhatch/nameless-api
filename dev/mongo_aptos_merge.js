const axios = require('axios');
const mongodb = require('mongodb')

async function getAllTransactions(address) {
    // Define your custom headers
    var limit = 100
    var transactions = []
    const params = {
        'start':0,
        'limit': limit
    };

    try {
        while(true){
            const response = await axios.get(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/transactions`, { params: params });
            transactions = transactions.concat(response.data);
            if(response.data.length < limit){
                break
            }
            else{
                params.start = params.start+limit
            }
        }
        const successful_txs = transactions.filter(obj => obj.success === true)
        console.log("Found", successful_txs.length, "successful transactions")
        return successful_txs
    } catch (error) {
        console.error('Error:', error);
    }
}

function filterTransactionsByType(txs, type){
    const filteredTxs = txs.filter(obj => obj.payload && obj.payload.function === type)
    console.log("Found", filteredTxs.length, type)
    return filteredTxs
}

//Use on create_ticket tx's to get a json of rewardCollectionAddress: num_tx's
function getCreatedTicketsByEvent(txs){
    let countMap = {};

    txs.forEach(obj => {
        if (obj.payload && obj.payload.arguments[1] && obj.payload.arguments[1].inner) {
            const innerValue = obj.payload.arguments[1].inner
            if (countMap[innerValue]) {
                countMap[innerValue]++;
            } 
            else {
                countMap[innerValue] = 1;
            }
        }
    });
    return countMap
}

//Use on redeem_ticket tx's to get a json of rewardCollectionAddress: num_tx's
function getRedeemedTicketsByEvent(txs){
    let countMap = {};

    txs.forEach(obj => {
        if (obj.changes) {
            obj.changes.forEach(change =>{
                if(change.data && change.data.data && change.data.data.event){
                    const innerValue = change.data.data.event.inner
                    if (countMap[innerValue]) {
                        countMap[innerValue]++;
                    } 
                    else {
                        countMap[innerValue] = 1;
                    }
                }
            })
        }
    });
    return countMap
}

async function getMongoEvents(){
    const uri = "mongodb+srv://admin_dashboard:1ww6wAjeLlBs8Kgt@nameless-prod.gnad7.mongodb.net/?retryWrites=true&w=majority"
    const client = new mongodb.MongoClient(uri)
    try{
        const database = client.db("proddb");
        const events = database.collection("Event");
        const cursor = events.find({});

    }
    catch(e){
        console.log("Could not geMongoEvents", e)
    }
    finally {
        await client.close();
    }

}

async function main() {
    const address = '0x446bf99aae1f79ccb52df29e083c971d96e49c9bb088834b939a1f0ef341cf13'
    const txs = await getAllTransactions(address);
    if (txs) {
        //Filter transactions into types
        const createTicketType = `${address}::my_management::create_ticket`
        const createTicketTxs = filterTransactionsByType(txs, createTicketType)
        const createTxsByEvent = getCreatedTicketsByEvent(createTicketTxs)
        console.log(createTxsByEvent)
        
        const redeemTicketType = `${address}::my_management::redeem_ticket`
        const redeemTicketTxs = filterTransactionsByType(txs, redeemTicketType)
        const redeemTxsByEvent = getRedeemedTicketsByEvent(redeemTicketTxs)
        console.log(redeemTxsByEvent)
    }

    const events = await getMongoEvents()
    console.log(events)
}

main();
