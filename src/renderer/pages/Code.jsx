import React from 'react';

function Code() {
  const info = [
    { key: "Browser", value: window.navigator.appName },
    { key: "Version", value: window.navigator.appVersion },
    { key: "Operating System", value: window.navigator.platform },
    { key: "Language", value: window.navigator.language },
    { key: "Cookies Enabled", value: window.navigator.cookieEnabled },
    { key: "User Agent", value: window.navigator.userAgent },
    { key: "Current URL", value: window.location.href },
  ];


  return (
    <div>
      <div className="text-lg">Code</div>
      <ul>
        {info.map((obj, index) => (
          <li key={index}><strong>{obj.key}: </strong>{obj.value}</li>
        ))}
      </ul>
    </div>
  );
}

export default Code;
