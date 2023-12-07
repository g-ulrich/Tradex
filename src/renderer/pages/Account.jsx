import React, { useEffect, useState } from 'react';
import TS from '../components/tradestation/main';

function Account() {
  const ts = new TS();
  ts.getAccessToken()

    return (
    <div>
       <div className="text-lg">Account</div>
       <p>{ts.endpoints.baseURL}</p>
    </div>
    );
}

export default Account;
