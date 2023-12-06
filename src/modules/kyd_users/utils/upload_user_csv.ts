import fs from 'fs';
import csvParser from 'csv-parser';
import { MongoClient } from 'mongodb';
import { environment } from '@/config/environment';

// Function to upload CSV data to MongoDB
export async function uploadCSVToMongoDB(fielpath:string) {
  const client = new MongoClient(environment.database.url);

  try {
    await client.connect();

    const db = client.db();
    const collection = db.collection("KYD_User");

    // Read CSV file
    fs.createReadStream(fielpath)
      .pipe(csvParser())
      .on('data', async (row: Record<string, any>) => {
        // Insert each row as a document to MongoDB collection
        await collection.insertOne(row);
      })
      .on('end', () => {
        console.log('CSV data successfully uploaded to MongoDB');
        client.close();
      });
  } catch (err) {
    console.error('Error:', err);
    client.close();
  }
}
