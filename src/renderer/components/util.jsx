import React, {} from 'react';

export const getHeightFromClass = (classStr) => {
    const ele = document.getElementsByClassName(classStr)[0];
    return ele.offsetHeight;
}

export const currentESTDatetime = () => {
  // '12/06/2023, 11:39:12 AM'
  const dt = new Date();
  return dt.toLocaleString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'EST'});
}
