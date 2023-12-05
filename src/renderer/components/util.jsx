import React, {} from 'react';

export const getHeightFromClass = (classStr) => {
    const ele = document.getElementsByClassName(classStr)[0];
    return ele.offsetHeight;
}
