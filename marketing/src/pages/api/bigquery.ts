import type { NextApiRequest, NextApiResponse } from 'next'
import { BigQuery, BigQueryOptions } from '@google-cloud/bigquery'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method === 'GET') {
    console.log("heree??")
  const optionsQuery = {
      keyFilename: 'keyfile.json',
      projectId: 'bigdaddylens',
    } as BigQueryOptions;
  const client = new BigQuery(optionsQuery)
  console.log("client", client)
  const query = `
  SELECT * 
  FROM lens-public-data.v2_polygon.profile_interest
  WHERE profile_id IN (
      SELECT profile_follower_id 
      FROM lens-public-data.v2_polygon.profile_follower
      WHERE profile_id = '0x28a2'
      LIMIT 3
  );
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