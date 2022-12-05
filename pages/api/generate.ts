// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import { v4 } from 'uuid';
import config from '../../src/config';

export type Data = {
  key?: Buffer;
  csr?: Buffer;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const data = JSON.parse(req.body);
  const keys = Object.keys(data);

  const uuid = v4();
  const cnfPathname = `/tmp/${uuid}.cnf`;
  const keyPathname = `/tmp/${uuid}.key`;
  const csrPathname = `/tmp/${uuid}.csr`;

  const fs = require('fs/promises');
  await fs.writeFile(cnfPathname, config(keys, data), 'utf8');

  /* @TODO: Missing error handling, should return Buffer | void */
  const getFileContent = async (pathname: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const cat = spawn('cat', [pathname]);
      cat.stdout.on('data', function (data) {
        resolve(data);
      });
      cat.stderr.on('data', function () {
        reject();
      });
      cat.on('exit', async (status) => {
        if (status === 1) reject();
      });
    });
  };

  const generateFiles = async (): Promise<
    { key: Buffer; csr: Buffer } | { error: string }
  > =>
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
      process.on('exit', async (status) => {
        if (status === 0) {
          Promise.all([
            await getFileContent(keyPathname),
            await getFileContent(csrPathname),
          ])
            .then(([key, csr]) => {
              return resolve({ key, csr });
            })
            .catch(() =>
              reject({ error: 'Error trying to get files content.' }),
            );
        } else reject({ error: 'Error generating files' });
      });
    });

  await generateFiles()
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((error) => res.status(500).send(error));
}
