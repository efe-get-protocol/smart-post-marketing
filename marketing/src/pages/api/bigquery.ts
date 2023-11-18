import type { NextApiRequest, NextApiResponse } from 'next'
import { BigQuery, BigQueryOptions } from '@google-cloud/bigquery'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method === 'GET') {
    console.log("heree??")
  const optionsQuery = {
      keyFilename: 'keyfile.json',
    } as BigQueryOptions;
  const client = new BigQuery(optionsQuery)
  const query = `
  select table_name from lens-public-data.v2_polygon.INFORMATION_SCHEMA.TABLES
  `

  const options = {
    query: query,
    location: 'US',
  }

   await client.query(options);
  // console.log('Rows:', rows);
  res.status(200).json({ text: 'Hello' });

  // return rows


  

}