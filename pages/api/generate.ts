// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';
import config from '../../src/config';

type Data = {
  key: string;
  csr: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const data = JSON.parse(req.body);
  const keys = Object.keys(data);

  const fs = require('fs/promises');
  const fileUuid = v4();
  const resultUuid = v4();

  const cnfFilename = `${fileUuid}.cnf`;
  const keyFilename = `${resultUuid}.key`;
  const csrFilename = `${resultUuid}.csr`;

  const cnfPathname = `/tmp/${cnfFilename}`;
  const keyPathname = `public/${keyFilename}`;
  const csrPathname = `public/${csrFilename}`;

  await fs.writeFile(cnfPathname, config(keys, data), 'utf8');
  const proc = require('child_process').spawn('openssl', [
    'req',
    '-new',
    '-config',
    cnfPathname,
    '-keyout',
    keyPathname,
    '-out',
    csrPathname,
    '-nodes',
  ]);

  for (let i = 0; i < 6; i++) {
    proc.stdin.write('\n');
  }

  res.status(200).send({ key: keyFilename, csr: csrFilename });
}
