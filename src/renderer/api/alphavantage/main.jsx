import axios from 'axios';
import Cookies from 'js-cookie';


class Alpha {
  constructor() {
    this.api_key = null;
  }

  getApiKey(){
      if (!this.api_key) {
        try {
          const apikey = Cookies.get('AlphaAPI');
          this.api_key = apikey;
          return apikey;
        } catch (error) {
          console.error(error);
          return null
        }
      }else{
        return this.api_key;
      }
  }

  getNews = async (symbols) => {
    try {
      const response = await axios.get(
        'https://www.alphavantage.co/query',
        {
          params: {
            function: 'NEWS_SENTIMENT',
            tickers: 'AAPL', // Replace with your desired ticker
            apikey: this.getApiKey(),
            limit: '100',
          },
        }
      );
      return response.data;
      // return [];
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }
}


export default Alpha;
