// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import { v4 } from 'uuid';
import config from '../../src/config';

type Data =
  | {
      key: string;
      csr: string;
    }
  | { error: string };

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

  const generateFiles = async () =>
    new Promise((resolve, reject) => {
      const process = spawn('openssl', [
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
        process.stdin.write('\n');
      }
      process.on('exit', (status) => {
        status === 0 ? resolve(status) : reject();
      });
    });

  await generateFiles()
    .then(() => res.status(200).send({ key: keyFilename, csr: csrFilename }))
    .catch(() =>
      res.status(500).send({
        error:
          'A server error has occurred and your files could not be generated. Please contact support.',
      }),
    );
}
