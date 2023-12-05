import React from 'react';
import TSEndpoints from '../components/tradestation/endpoints';

function Account() {
    const tsEndpoints = new TSEndpoints();
    console.log(tsEndpoints.baseURL);
    return (
    <div>
       <div className="text-lg">Account</div>
       <iframe
        title="External Content"
        src="https://www.phind.com/"
        width="100%"
        height="500px"
        frameBorder="0"
      />
    </div>
    );
}

export default Account;