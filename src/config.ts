import React from 'react';

export const config = (keys: string[], data: Record<string, string>) => {
  return `[req]

distinguished_name = dn

req_extensions = v3_req

[dn]

countryName = NO

countryName_default = NO

stateOrProvinceName = Rogaland

stateOrProvinceName_default = Rogaland

localityName = Stavanger

localityName_default = Stavanger

organizationName = Equinor ASA

organizationName_default = Equinor ASA

emailAddress = dnsregistry@equinor.com

emailAddress_default = dnsregistry@equinor.com

commonName = ${data['domain']}

commonName_default = ${data['domain']}

commonName_max = 64

[v3_req]

basicConstraints = CA:TRUE

keyUsage = nonRepudiation, digitalSignature, keyEncipherment

subjectAltName = @alt_names

[alt_names]

${keys.map((key, i) => `DNS.${i + 1} = ${data[key]}`).join('\n\n')}`;
};

export default config;
