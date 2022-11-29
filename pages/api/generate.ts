// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const proc = require('child_process').spawn('openssl', ['version']);
  const toString = require('stream-to-string');

  res.status(200).json(await toString(proc.stdout));
}
