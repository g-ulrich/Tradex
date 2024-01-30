/**
 * @fileoverview
 * This file contains the implementation of the Accounts class that interacts with the TradeStation API.
 * It utilizes the OpenAPI specification version 3.0.3.
 *
 * @description
 * # Authentication
 * For more information on authorization and gaining an access/refresh token,
 * please visit: [Authentication](/docs/fundamentals/authentication/auth-overview).
 * <SecurityDefinitions />
 *
 * @version V3
 *
 * @termsOfService
 * [TradeStation API Guidelines for Acceptance](http://elasticbeanstalk-us-east-1-525856068889.s3.amazonaws.com/wp-content/uploads/2014/03/Guidelines_For_Acceptance.pdf)
 *
 * @contact
 * - Name: TradeStation API Team
 * - Email: ClientServices@tradestation.com
 * - URL: [TradeStation API Developer Portal](https://developer.tradestation.com/webapi)
 *
 * @license
 * - Name: Services Agreement For Application Developers
 * - URL: [Agreement for WebAPI Developers](https://s3.amazonaws.com/elasticbeanstalk-us-east-1-525856068889/wp-content/uploads/2016/02/Agreement-for-WebAPI-Developers_v5C.pdf)
 *
 * @server
 * - URL: https://api.tradestation.com
 */
import axios from 'axios';
import {TS} from './main';

export class Accounts {
  constructor() {
    this.ts = new TS();
    this.baseUrl = 'https://api.tradestation.com/v3/brokerage';
    // this.token = token;
  }

  /**
   * Fetches the list of Brokerage Accounts available for the current user.
   * @returns {Promise<Array>} - Promise resolving to the list of brokerage accounts.
   */
  async getAccounts() {
    const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/accounts`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    }).then(response => response.data.Accounts)
    .catch(error => {
      this.ts.error(`getAccounts() - ${error}`);
      throw error;
    });
    return response;
  }

  setAccounts(setter, type='Cash'){
    (async () => {
      try {
        const arr = await this.getAccounts();
        if (type === '') {
          setter(arr);
        } else {
          arr.forEach((i)=>{
            if (i.AccountType === type) {
              setter(i);
            }
          });
        }
      } catch (error) {
        this.ts.error(`setAccounts() ${error}`);
      }
    })();
  }

  setAccountID(setter, type="Cash"){
    (async () => {
      try {
        const arr = await this.getAccounts();
        arr.forEach((i)=>{
          if (i.AccountType === type) {
          const id_token = this.ts.getTokenId();
            setter(i.AccountID);
          }
        });
      } catch (error) {
        this.ts.error(`setAccountID() ${error}`);
      }
    })();
  }


/**
   * Fetches brokerage account balances for one or more given accounts.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma-separated format.
   * @returns {Promise<Array>} - Promise resolving to the list of account balances.
   */
  async getAccountBalances(accountIds) {
    const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/accounts/${accountIds}/balances`;
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    })
    .then(response => response.data.Balances)
    .catch(error => {
      this.ts.error(`getAccountBalances() ${error}`);
      throw error;
    });
}

setAccountBalances(setter, accountIds, type='Cash'){
  if (accountIds !== null || typeof accountIds !== 'undefined') {
    const id_token = this.ts.getTokenId();
    (async () => {
      try {
        const arr = await this.getAccountBalances(accountIds);
        if (type === '') {
          setter(arr);
        } else {
          arr.forEach((obj, index)=>{
            if (obj.AccountType === type) {
              setter(obj);
            }
          });
        }
      } catch (error) {
        this.ts.error(`setAccountBalances() ${error}`);
      }
    })();
  }
}

  /**
   * Fetches the Beginning of Day Balances for the given Accounts.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma separated format.
   * @returns {Promise<Array>} - Promise resolving to the list of Beginning of Day Balances.
   */
  getBalancesBOD(accountIds) {
    const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/accounts/${accountIds}/bodbalances`;
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    })
      .then(response => response.data.BODBalances)
      .catch(error => {
        this.ts.error(`getBalancesBOD() ${error}`);
        throw error;
      });
  }


 /**
   * Fetches Historical Orders for the given Accounts except open orders, sorted in descending order of time closed.
   * @param {string} accounts - List of valid Account IDs for the authenticated user in a comma-separated format.
   * @param {string} since - Historical orders since date (format: "YYYY-MM-DD").
   * @param {number} pageSize - The number of requests returned per page when paginating responses (optional).
   * @param {string} nextToken - An encrypted token with a lifetime of 1 hour for use with paginated order responses (optional).
   * @returns {Promise<Object>} - Promise resolving to the historical orders.
   */
 getHistoricalOrders(accounts, since, pageSize = 600, nextToken = null) {
          const id_token = this.ts.getTokenId();
  const url = `${this.baseUrl}/accounts/${accounts}/historicalorders`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
    params: {
      since,
      pageSize,
      nextToken,
    },
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching historical orders:', error);
      throw error;
    });
}

/**
   * Fetches Historical Orders for the given Accounts except open orders,
   * filtered by given Order IDs prior to the current date, sorted in descending order of time closed.
   * @param {string} accounts - List of valid Account IDs for the authenticated user in a comma-separated format.
   * @param {string} orderIds - List of valid Order IDs for the authenticated user for given accounts in a comma-separated format.
   * @param {string} since - Historical orders since date.
   * @returns {Promise<Object>} - Promise resolving to the historical orders.
   */
  getHistoricalOrdersByOrderID(accounts, orderIds, since) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/accounts/${accounts}/historicalorders/${orderIds}?since=${since}`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    })
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching historical orders:', error);
        throw error;
      });
  }

  /**
   * Fetches today's orders and open orders for the given Accounts, sorted in descending order of time placed for open and time executed for closed.
   * @param {string} accounts - List of valid Account IDs for the authenticated user in comma-separated format; for example "61999124,68910124".
   * @param {number} [pageSize=600] - The number of requests returned per page when paginating responses.
   * @param {string} [nextToken] - An encrypted token with a lifetime of 1 hour for use with paginated order responses.
   * @returns {Promise<Object>} - Promise resolving to the list of orders.
   */
  getOrders(accounts, pageSize = 600, nextToken) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/accounts/${accounts}/orders`;

    const params = {
      pageSize,
      nextToken,
    };

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
      params,
    })
      .then(response => response.data.Orders)
      .catch(error => {
        console.error('Error fetching orders:', error);
        throw error;
      });
  }

 /**
   * Fetches today's orders and open orders for the given Accounts, filtered by given Order IDs.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma-separated format.
   * @param {string} orderIds - List of valid Order IDs for the authenticated user for given accounts in comma-separated format.
   * @returns {Promise<Array>} - Promise resolving to the list of orders.
   */
 getOrdersByOrderID(accountIds, orderIds) {
          const id_token = this.ts.getTokenId();
  const url = `${this.baseUrl}/accounts/${accountIds}/orders/${orderIds}`;

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  })
    .then(response => response.data.Orders)
    .catch(error => {
      console.error('Error fetching orders:', error);
      throw error;
    });
}


  /**
   * Fetches positions for the given Accounts.
   * @param {string} accounts - List of valid Account IDs for the authenticated user in a comma-separated format.
   * @param {string} [symbol] - List of valid symbols in a comma-separated format for filtering positions.
   * @returns {Promise<Array>} - Promise resolving to the list of positions.
   */
  getPositions(accounts, symbol) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/accounts/${accounts}/positions`;

    // Optional query parameter for symbol
    const params = symbol ? { symbol } : {};

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
      params,
    })
      .then(response => response.data.Positions)
      .catch(error => {
        console.error('Error fetching positions:', error);
        throw error;
      });
  }

   /**
   * Fetches wallet information for a specific crypto account.
   * @param {string} accountID - The ID of the crypto account.
   * @returns {Promise<Array>} - Promise resolving to the list of wallets for the specified crypto account.
   */
   getWallets(accountID) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/accounts/${accountID}/wallets`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    })
      .then(response => response.data.Wallets)
      .catch(error => {
        console.error('Error fetching wallets:', error);
        throw error;
      });
  }

  /**
   * Streams wallet information for the specified crypto account.
   * @param {string} account - A valid crypto Account ID for the authenticated user.
   * @returns {Promise<Stream>} - Promise resolving to the stream of wallet information.
   */
  streamWallets(account) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/stream/accounts/${account}/wallets`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
        Accept: 'application/vnd.tradestation.streams.v2+json',
      },
      responseType: 'stream',
    })
      .then(response => response.data)
      .catch(error => {
        console.error('Error streaming wallets:', error);
        throw error;
      });
  }

   /**
   * Streams orders for the given accounts.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma-separated format.
   * @returns {Promise<Array>} - Promise resolving to the streamed orders.
   */
   streamOrders(accountIds) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/stream/accounts/${accountIds}/orders`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
      responseType: 'stream', // To handle streaming response
    })
      .then(response => {
        // Handle the streamed data here
        response.data.on('data', data => {
          console.log(data.toString());
          // Process the streamed data as needed
        });
      })
      .catch(error => {
        console.error('Error streaming orders:', error);
        throw error;
      });
  }


   /**
   * Streams orders for the given accounts and orders.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma-separated format.
   * @param {string} ordersIds - List of valid Order IDs for the account IDs in comma-separated format.
   * @returns {Promise<Array>} - Promise resolving to the list of streamed orders.
   */
   streamOrdersByOrderId(accountIds, ordersIds) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/stream/accounts/${accountIds}/orders/${ordersIds}`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    })
      .then(response => response.data.Orders)
      .catch(error => {
        console.error('Error streaming orders by order ID:', error);
        throw error;
      });
  }


  /**
   * Streams positions for the given accounts.
   * @param {string} accountIds - List of valid Account IDs for the authenticated user in comma separated format.
   * @param {boolean} [changes=false] - A boolean value that specifies whether or not position updates are streamed as changes.
   * @returns {Promise<Array>} - Promise resolving to the streamed positions.
   */
  streamPositions(accountIds, changes = false) {
          const id_token = this.ts.getTokenId();
    const url = `${this.baseUrl}/stream/accounts/${accountIds}/positions`;

    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
      params: {
        changes,
      },
    })
      .then(response => response.data)
      .catch(error => {
        console.error('Error streaming positions:', error);
        throw error;
      });
  }


}

