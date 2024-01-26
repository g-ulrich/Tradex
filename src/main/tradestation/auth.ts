import { BrowserWindow} from 'electron';
import axios from 'axios';
import fs from 'fs'; // saves file to root.
import {currentESTDatetime} from '../util';


interface fullTokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  scope: string;
  timeStamp: number;
  expires_in: number;
}

interface rawAuthTokenResponse {
    access_token: string;
    refresh_token: string;
    id_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
  }

interface rawRefreshTokenResponse {
    access_token: string;
    id_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
}

const TOKEN_FILE_NAME = 'tsToken.json';
export const CALLBACK_URL = 'http://localhost:3001';
const API_URL = 'https://api.tradestation.com';
const SINGIN_URL = 'https://signin.tradestation.com/';
const TOKEN_URL = `${SINGIN_URL}oauth/token`;
const API_KEY = process.env.TS_CLIENT_ID;
const SECRET_KEY = process.env.TS_CLIENT_SECRET;

export const GET_AUTH_URL = () => {
  const scope = "openid offline_access profile MarketData ReadAccount Trade";
  const encodedScope = scope;//encodeURIComponent(scope);
  const encodedRedirectUrl = CALLBACK_URL;//encodeURIComponent(CALLBACK_URL);
  const encodedApiUrl = API_URL;//encodeURIComponent(API_URL);

  return `${SINGIN_URL}authorize?response_type=code&client_id=${API_KEY}&redirect_uri=${encodedRedirectUrl}&audience=${encodedApiUrl}&scope=${encodedScope}`;
}

export async function triggerRefresh() {
    try {
        if (isTokenExpired()) {
            console.log(`${currentESTDatetime()} [INFO] - Refreshing Tradestation Token.`);
            const tokenDataFromStore = await readTokenResponseFromJSONFile(TOKEN_FILE_NAME);
            if (typeof tokenDataFromStore?.refresh_token !== 'undefined') {
              const newData = await getTokenFromRefresh(tokenDataFromStore?.refresh_token);
              const success : boolean = await updateTSTokenData(newData);
              console.log(`${currentESTDatetime()} [INFO] - Token Refreshed ${success ? 'Successfully!' : 'Un-successfully.'}.`);
            }else{
              console.error(`${currentESTDatetime()} [ERROR] triggerRefresh() - refresh_token is undefined.`);
            }
          const tokenObj = await readTokenResponseFromJSONFile(TOKEN_FILE_NAME);
          return tokenObj;
        } else {
              const tokenObj = await readTokenResponseFromJSONFile(TOKEN_FILE_NAME);
              return tokenObj;
        }
    } catch (error) {
          console.error(`${currentESTDatetime()} [ERROR] triggerRefresh() - ${error}`);
          const tokenObj = await readTokenResponseFromJSONFile(TOKEN_FILE_NAME);
          return tokenObj;
    }
  }

export async function getTokenFromAuthCode(authorizationCode:string):Promise<rawAuthTokenResponse>{
try {
    const response = await axios.post(TOKEN_URL, {
        grant_type: 'authorization_code',
        client_id: API_KEY,
        client_secret: SECRET_KEY,
        code: authorizationCode,
        redirect_uri: CALLBACK_URL,
    },{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
} catch (error) {
    console.error(`${currentESTDatetime()} [ERROR] getTokenFromAuthCode() - ${error}`);
    throw error;
}
}

export async function getTokenFromRefresh(refresh_token:string) : Promise<rawRefreshTokenResponse> {
    // Refresh tokens are valid forever *unless otherwise noted.
    try {
        const response = await axios.post(TOKEN_URL, {
              grant_type: 'refresh_token',
              client_id: API_KEY,
              client_secret: SECRET_KEY,
              refresh_token: refresh_token,
          },{
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          }
        });

      return response.data;
    } catch (error) {
      console.error(`${currentESTDatetime()} [ERROR] getTokenFromRefresh() - ${error}`);
      throw error;
    }
  }

function getCodeFromURL(url: String){
  var code = null;
  if (url.indexOf("code") !== -1){
    const spl =url.split("?code=");
    return spl[spl.length-1].split("&")[0];
  }
  return code;
}

export async function getAuthCode(fullUrl: string) {
    try {
        const authCode = getCodeFromURL(fullUrl);
        const resp = await getTokenFromAuthCode(authCode);
        insertTSTokenData(resp);
    } catch (error) {
      console.error(`${currentESTDatetime()} [ERROR] getAuthCode() - ${error}`);
    }
}

export function writeTokenResponseToJSONFile(data: rawAuthTokenResponse, fileName: string): boolean {
  try {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`${currentESTDatetime()} [ERROR] writeTokenResponseToJSONFile() - ${error}`);
    return false;
  }
}

export function readTokenResponseFromJSONFile(fileName: string): rawAuthTokenResponse | null {
  try {
    const data = fs.readFileSync(fileName, 'utf-8');
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.error(`${currentESTDatetime()} [ERROR] readTokenResponseFromJSONFile() - ${error}`);
    return null;
  }
}

export function insertTSTokenData(data:rawAuthTokenResponse): boolean {
  try {
      if (typeof data?.timeStamp === 'undefined') {
          (data as any).timeStamp = Date.now();
      }
      return writeTokenResponseToJSONFile(data, TOKEN_FILE_NAME);
  } catch (error) {
    console.error(`${currentESTDatetime()} [ERROR] insertTSTokenData() - ${error}`);
      return false;
  }
}

export function isTokenExpired(): boolean {
  var obj = readTokenResponseFromJSONFile(TOKEN_FILE_NAME);
  if (obj != null) {
      var token_ts = obj?.timeStamp;
      if (typeof token_ts === 'undefined') {
          return false;
      } else {
          // if timedelta for the timestamp is > than 15 minutes its expired, this is called every 10seconds
          return (Date.now() - token_ts) / 1000 / 60 > 15 ? true : false;
      }
  } else {
      return false;
  }
}

export function updateTSTokenData(refreshTokenData: rawRefreshTokenResponse): boolean{
  const tokenDataFromStore = readTokenResponseFromJSONFile(TOKEN_FILE_NAME);
  if (tokenDataFromStore === null) {
      console.error(`${currentESTDatetime()} [ERROR] updateTSTokenData() - Need AuthCode & Refresh Token`);
      return false;
  } else {
      try {
          const updatedObject: fullTokenResponse = {
              access_token: refreshTokenData.access_token,
              refresh_token: tokenDataFromStore.refresh_token,
              id_token: refreshTokenData.id_token,
              token_type: refreshTokenData.token_type,
              scope: tokenDataFromStore.scope,
              timeStamp: Date.now(),
              expires_in: refreshTokenData.expires_in
          };
          return writeTokenResponseToJSONFile(updatedObject, TOKEN_FILE_NAME);
      } catch (error) {
          return false;
      }
    return false;
  }
}
