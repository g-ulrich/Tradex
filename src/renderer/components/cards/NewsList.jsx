import {IconRefresh, IconTriangleDown, IconTriangleUp } from '../Icons';
import {formatCurrency} from '../util';
import {useState, useEffect} from 'react';
import Alpha from '../alphavantage/main';

/*
feed
:
Array(50)
0
:
authors
:
['Neil Dennis']
banner_image
:
"https://cdn.benzinga.com/files/images/story/2023/Girl-Music-Shutterstock.jpeg?width=1200&height=800&fit=crop"
category_within_source
:
"General"
overall_sentiment_label
:
"Neutral"
overall_sentiment_score
:
0.100756
source
:
"Benzinga"
source_domain
:
"www.benzinga.com"
summary
:
"The global music industry has grown rapidly in the past five years as increasing numbers of listeners head for streaming services, but traditional areas of investment such as revenues from royalties have suffered in the face of high interest rates."
ticker_sentiment
:
Array(5)
0
:
{ticker: 'SNEJF', relevance_score: '0.274834', ticker_sentiment_score: '0.134698', ticker_sentiment_label: 'Neutral'}
1
:
{ticker: 'WMG', relevance_score: '0.093289', ticker_sentiment_score: '0.060151', ticker_sentiment_label: 'Neutral'}
2
:
{ticker: 'AAPL', relevance_score: '0.185306', ticker_sentiment_score: '0.108009', ticker_sentiment_label: 'Neutral'}
3
:
{ticker: 'GS', relevance_score: '0.093289', ticker_sentiment_score: '0.0', ticker_sentiment_label: 'Neutral'}
4
:
{ticker: 'SPOT', relevance_score: '0.274834', ticker_sentiment_score: '0.147249', ticker_sentiment_label: 'Neutral'}
length
:
5
[[Prototype]]
:
Array(0)
time_published
:
"20231212T175558"
title
:
"KKR Looks To Sell Music Catalog As Royalty Valuations Drop But Spotify Soars On Streaming Success - Apple  ( NASDAQ:AAPL ) , Amazon.com  ( NASDAQ:AMZN ) "
topics
:
(3) [{…}, {…}, {…}]
url
:
"https://www.benzinga.com/general/entertainment/23/12/36203126/kkr-looks-to-sell-music-catalog-as-royalty-valuations-drop-but-spotify-soars-on-streaming-s"
[[Prototype]]
:
Object
*/

export default function NewsList(props) {
  const alpha = new Alpha();
  const [news, setNews] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('useEffect block called', props.symbols);
        const newsData = await alpha.getNews(props.symbols);
        console.log(newsData.feed);
        setNews(newsData.feed);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchData();
    return;
  }, []);

return (
  <>
  {
    news === null ? (
      <div>Loading...</div>
    ) : (
      <div className="w-full bg-discord-darkestGray border border-discord-black rounded shadow-lg">
          <div className="flex p-2 items-center justify-between mb-[4px]">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{props.title}</h5>
              <a href="#" className="text-sm font-medium text-discord-blurple2">
                  <IconRefresh/>
              </a>
        </div>
        <div className="flow-root">
              <ul role="list" className="divide-y divide-discord-darkerGray">
                {news.map((obj, i) => (
                  <li className='py-[4px] px-2'>
                  <div className="flex items-center">
                    {obj.title}
                      {/* <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium ">
                          {obj.icon} {obj.accountName}
                              <span className="ml-2 text-sm text-gray-500">
                                {obj.accountId}
                                </span>
                          </p>

                          <p className=" text-lg font-medium text-discord-blurple2">
                          {formatCurrency(obj.total)}
                          </p>

                      </div>
                      <div className={`text-right flex-1 items-center text-base font-semibold ${obj.val > 0 ? 'text-discord-softGreen' : 'text-discord-softRed'}`}>
                          <p className={`text-sm==lg font-medium ${obj.val > 0 ? 'text-discord-softGreen' : 'text-discord-softRed'}`}>
                            {formatCurrency(obj.val)} {obj.val >= 0 ? (<IconTriangleUp/>) : (<IconTriangleDown/>)} ({formatCurrency(obj.val)})
                          </p>
                      </div> */}
                  </div>
              </li>
              ))}
              </ul>
        </div>
      </div>

    )
  }
  </>
);
}
