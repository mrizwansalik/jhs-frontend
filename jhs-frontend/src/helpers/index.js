/* eslint-disable */

export const num = (number = 0.0, fix) => {
    let decimalPlaces = fix;
    if (!fix) {
        if (number <= 0.000001) decimalPlaces = 9;
        else if (number <= 0.00001) decimalPlaces = 8;
        else if (number <= 0.0001) decimalPlaces = 7;
        else if (number <= 0.001) decimalPlaces = 6;
        else if (number < 1) decimalPlaces = 4;
        else if (number < 10) decimalPlaces = 3;
        else decimalPlaces = 2;
    }
    return Number(number).toLocaleString('en-US', {
        maximumFractionDigits: decimalPlaces,
    });
};

export const convertDateTime = (dateTime, returnType = 'dateTime') => {
    // {'date', 'dateTime'}
    if (!dateTime) return;
    const createdDate = new Date(dateTime);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = createdDate.getFullYear();
    const month = months[createdDate.getMonth()];
    const date = createdDate.getDate();
    const hour = createdDate.getHours();
    const min = createdDate.getMinutes();
    const sec = createdDate.getSeconds();
    let time = null;
    if (returnType === 'dateTime') {
        time = `${date},${month} ${year} ${hour}:${min}:${sec}`;
    } else if (returnType === 'time') {
        return `${hour}:${min}:${sec}`;
    } else {
        time = `${date}-${month}-${year}`;
    }

    return time;
};

export const sysDate = (dateTime, returnType = 'dateTime') => {
    if (!dateTime) return;
    const createdDate = new Date(dateTime);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = createdDate.getFullYear();
    const month = months[createdDate.getMonth()];
    const date = createdDate.getDate();
    const hour = createdDate.getHours();
    const min = createdDate.getMinutes();
    const sec = createdDate.getSeconds();
    let time = null;
    if (returnType === 'dateTime') {
        time = `${date},${month} ${year} ${hour}:${min}:${sec}`;
    } else {
        time = `${date}-${month}-${year}`;
    }
    // eslint-disable-next-line consistent-return
    return time;
};


