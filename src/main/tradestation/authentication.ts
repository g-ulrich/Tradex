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


export class TSAuthentication {
  tokenFileName: string;
  callBackUrl: string;
  apiUrl: string;
  signInUrl: string;
  tokenUrl: string;
  apiKey: string | undefined;
  secretKey: string | undefined;
  tradingScope: string;

  constructor(){
    // endpoint and TS variables
    this.tokenFileName = 'tsToken.json';
    this.callBackUrl = 'http://localhost:3001';
    this.apiUrl = 'https://api.tradestation.com';
    this.signInUrl = 'https://signin.tradestation.com/';
    this.tokenUrl = `${this.signInUrl}oauth/token`;
    this.apiKey = process.env?.TS_CLIENT_ID || undefined;
    this.secretKey = process.env?.TS_CLIENT_SECRET || undefined;
    this.tradingScope = "openid offline_access profile MarketData ReadAccount Trade";
  }

  info(msg:any){
    console.log(`${currentESTDatetime()} [INFO] ${msg}`);
  }

  error(msg:any){
    console.error(`${currentESTDatetime()} [ERROR] ${msg}`);
  }

  /*
    A space-separated list of scopes (case sensitive).
    openid scope is always required. offline_access is
    required for Refresh Tokens.
      Example: openid profile offline_access MarketData ReadAccount Trade Crypto
    See Scopes for more information.
    https://api.tradestation.com/docs/fundamentals/authentication/scopes
  */
  getAuthUrl(){
      // the encodeURI works, I was testing and never uncommented them out.
      const encodedScope = this.tradingScope;//encodeURIComponent(this.tradingScope);
      const encodedRedirectUrl = this.callBackUrl;//encodeURIComponent(this.callBackUrl);
      const encodedApiUrl = this.apiUrl;//encodeURIComponent(this.apiUrl);
      return `${this.signInUrl}authorize?response_type=code&client_id=${this.apiKey}&redirect_uri=${encodedRedirectUrl}&audience=${encodedApiUrl}&scope=${encodedScope}`;
    }

  /**
    Retrieves a new access token by refreshing the Tradestation token.
    If a refresh token is available, it obtains a new token and updates the token data.
    Logs the token refresh status and returns the token object.
    If an error occurs, logs the error and returns the token object.
    @returns {Promise<object>} The token object.
  */
  async getNewAccessToken(){
    try {
      // const lastRefresh: number | any = this.getLastRefreshTime();
      // if ((Date.now() - lastRefresh) / 1000 / 60 > 19) {
        this.info(`Refreshing Tradestation Token.`);
        const tokenData = await this.readTSTokenFile(this.tokenFileName);
        if (typeof tokenData?.refresh_token !== 'undefined') {
          const newTokenData = await this.getTokenFromRefresh(tokenData?.refresh_token);
          const success : boolean = await this.updateTSTokenData(newTokenData);
          this.info(`Token Refreshed ${success ? 'Successfully!' : 'Un-successfully.'}.`);
        }else{
          this.error(`getNewAccessToken() - refresh_token is undefined.`);
        }
      // }
      const tokenObj = await this.readTSTokenFile(this.tokenFileName);
      return tokenObj;
    } catch (error) {
        this.error(`getNewAccessToken() - ${error}`);
        const tokenObj = await this.readTSTokenFile(this.tokenFileName);
        return tokenObj;
    }
  }

  /**
   * This function is used to get a new access token using a refresh token.
   *  It takes in a refresh token as a parameter and returns a Promise that
   * resolves to a rawRefreshTokenResponse object.
   */
  async getTokenFromRefresh(refresh_token:string) : Promise<rawRefreshTokenResponse> {
    // Refresh tokens are valid forever *unless otherwise noted.
    try {
        const response = await axios.post(this.tokenUrl, {
              grant_type: 'refresh_token',
              client_id: this.apiKey,
              client_secret: this.secretKey,
              refresh_token: refresh_token,
          },{
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
      return response.data;
    } catch (error) {
      this.error(`getTokenFromRefresh() - ${error}`);
      throw error;
    }
  }

  /**
    triggers a refresh of the access token.
    It checks if the token is expired and either retrieves
    a new access token or returns the existing token object.
    @returns {token<object>}
  */
  async triggerRefresh() {
    try {
        if (this.isTokenExpired()) {
            return await this.getNewAccessToken();
        } else {
            const tokenData = await this.readTSTokenFile(this.tokenFileName);
            return tokenData;
        }
    } catch (error) {
          this.error(`triggerRefresh() - ${error}`);
          const tokenData = await this.readTSTokenFile(this.tokenFileName);
          return tokenData;
    }
  }

  /**
    Retrieves an access token from an authorization code.
    @param {string} authorizationCode - The authorization code obtained from the user.
    @returns {Promise<rawAuthTokenResponse>} - A promise that resolves with the raw access token response.
    @throws {Error} - If there is an error while retrieving the access token.
  */
  async getTokenFromAuthCode(authorizationCode:string):Promise<rawAuthTokenResponse>{
      try {
          const response = await axios.post(this.tokenUrl, {
              grant_type: 'authorization_code',
              client_id: this.apiKey,
              client_secret: this.secretKey,
              code: authorizationCode,
              redirect_uri: this.callBackUrl,
          },{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          return response.data;
      } catch (error) {
          this.error(`getTokenFromAuthCode() - ${error}`);
          throw error;
      }
    }

  /**
    Extracts the authorization code from a URL.
    @param {string} url - The URL containing the authorization code.
    @returns {string|null} - The extracted authorization code, or null if not found.
  */
  getCodeFromURL(url: String){
    var code = null;
    if (url.indexOf("code") !== -1){
      const spl =url.split("?code=");
      return spl[spl.length-1].split("&")[0];
    }
    return code;
  }

  /**
    Retrieves the authorization code from a full URL, obtains an access token using the code, and inserts the token data.
    @param {string} fullUrl - The full URL containing the authorization code.
    @returns {Promise<void>} - A promise that resolves when the token data is inserted successfully.
    @throws {Error} - If there is an error while retrieving the authorization code or obtaining the access token.
  */
  async getAuthCode(fullUrl: string) {
    try {
        const authCode = this.getCodeFromURL(fullUrl);
        const resp = await this.getTokenFromAuthCode(authCode);
        this.insertTSTokenData(resp);
    } catch (error) {
      this.error(`getAuthCode() - ${error}`);
    }
  }

  /**
  Inserts token data into a file.
  @param {rawAuthTokenResponse} data - The token data to be inserted.
  @returns {boolean} - True if the token data is inserted successfully, false otherwise.
  */
  insertTSTokenData(data:rawAuthTokenResponse): boolean {
    try {
        if (typeof data?.timeStamp === 'undefined') {
            (data as any).timeStamp = Date.now();
        }
        return this.writeTSTokenFile(data, this.tokenFileName);
    } catch (error) {
      this.error(`insertTSTokenData() - ${error}`);
        return false;
    }
  }

  /**
  Checks if the access token is expired.
  It reads the token data from the tokenFile and calculates
  the time difference between the current time and the token timestamp.
  If the time difference is greater than 15 minutes, it returns
  true indicating that the token is expired.
  Otherwise, it returns false indicating that the token is not expired.
  */
  isTokenExpired(): boolean {
    const tokenData = this.readTSTokenFile(this.tokenFileName);
    if (tokenData != null) {
        var token_ts = tokenData?.timeStamp;
        if (typeof token_ts === 'undefined') {
            return false;
        } else {
            // if timedelta for the timestamp is > than minutes its expired.
            // Called everytime its needed from renderer.
            const minutes = 15;
            return (Date.now() - token_ts) / 1000 / 60 > minutes ? true : false;
        }
    } else {
        return false;
    }
  }

  getLastRefreshTime(): number | null{
    const tokenData = this.readTSTokenFile(this.tokenFileName);
    if (tokenData != null) {
      var token_ts = tokenData?.timeStamp;
      if (typeof token_ts === 'undefined') {
          return 0;
      } else {
          return token_ts;
      }
    } else {
        return 0;
    }
  }

  /**
  Updates the token data with the provided refresh token data.
  @param refreshTokenData - The raw refresh token response data.
  @returns True if the token data was successfully updated, false otherwise.
  */
  updateTSTokenData(refreshTokenData: rawRefreshTokenResponse): boolean{
    const tokenData = this.readTSTokenFile(this.tokenFileName);
    if (tokenData === null) {
        this.error(`updateTSTokenData() - Need Authorization Code & Refresh Token.`);
        return false;
    } else {
        try {
            const updatedObject: fullTokenResponse = {
                access_token: refreshTokenData.access_token,
                refresh_token: tokenData.refresh_token,
                id_token: refreshTokenData.id_token,
                token_type: refreshTokenData.token_type,
                scope: tokenData.scope,
                timeStamp: Date.now(),
                expires_in: refreshTokenData.expires_in
            };
            return this.writeTSTokenFile(updatedObject, this.tokenFileName);
        } catch (error) {
            return false;
        }
    }
  }

  /**
  Reads the token data from the specified file.
  @param fileName - The name of the file to read the token data from.
  @returns The parsed token data if the file was successfully read, null otherwise.
  */
  readTSTokenFile(fileName: string): rawAuthTokenResponse | null {
    try {
      const data = fs.readFileSync(fileName, 'utf-8');
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      this.error(`readTSTokenFile() - ${error}`);
      return null;
    }
  }

  /**
  Writes token data to a file.
  @param {rawAuthTokenResponse} data - The token data to be written.
  @param {string} fileName - The name of the file to write the data to.
  @returns {boolean} - True if the token data is written successfully, false otherwise.
  */
  writeTSTokenFile(data: rawAuthTokenResponse, fileName: string): boolean {
    try {
      fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (error) {
      this.error(`writeTSTokenFile() - ${error}`);
      return false;
    }
  }

}
