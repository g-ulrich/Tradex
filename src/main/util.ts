/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import fs from 'fs'; // saves file to root.
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}


export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function writeTokenResponseToJSONFile(data: TokenResponse, fileName: string): void {
  try {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf-8');
    // console.log(`Data saved to ${fileName}`);
  } catch (error) {
    console.error(`Error writing data to ${fileName}:`, error);
  }
}

export function readTokenResponseFromJSONFile(fileName: string): TokenResponse | null {
  try {
    const data = fs.readFileSync(fileName, 'utf-8');
    const parsedData = JSON.parse(data);
    // console.log(`Data read from ${fileName}:`, parsedData);
    return parsedData;
  } catch (error) {
    console.error(`Error reading data from ${fileName}:`, error);
    return null;
  }
}


export function TSTokenfileProcess() {
  // Example usage
  const tokenResponse = {
      access_token: "eGlhc2xv...MHJMaA",
      refresh_token: "eGlhc2xv...wGVFPQ",
      id_token: "vozT2Ix...wGVFPQ",
      token_type: "Bearer",
      scope: "openid profile MarketData ReadAccount Trade Crypto offline_access",
      expires_in: 1200
    };
    
    writeTokenResponseToJSONFile(tokenResponse, 'tsToken.json');
    
    return( readTokenResponseFromJSONFile('tsToken.json'));
  }