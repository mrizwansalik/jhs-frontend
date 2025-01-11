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

const colors = [
    { background: 'rgba(52, 203, 121, 0.3)', borderColor: 'rgba(42, 159, 94, 0.5)' }, // #34CB79
    { background: 'rgba(30, 129, 206, 0.3)', borderColor: 'rgba(30, 129, 206, 0.5)' }, // rgba(30, 129, 206, 0.2)
    { background: 'rgba(207, 50, 207, 0.3)', borderColor: 'rgba(154, 36, 154, 0.5)' }, // #CF32CFE5
    { background: 'rgba(255, 99, 71, 0.3)', borderColor: 'rgba(204, 79, 57, 0.5)' }, // #FF6347
    { background: 'rgba(123, 104, 238, 0.3)', borderColor: 'rgba(94, 79, 180, 0.5)' }, // #7B68EE
    { background: 'rgba(60, 179, 113, 0.3)', borderColor: 'rgba(46, 139, 87, 0.5)' }, // #3CB371
    { background: 'rgba(255, 160, 122, 0.3)', borderColor: 'rgba(228, 136, 106, 0.5)' }, // #FFA07A
    { background: 'rgba(147, 112, 219, 0.3)', borderColor: 'rgba(117, 89, 176, 0.5)' }, // #9370DB
    { background: 'rgba(0, 206, 209, 0.3)', borderColor: 'rgba(0, 156, 158, 0.5)' }, // #00CED1
    
    { background: 'rgba(255, 165, 0, 0.3)', borderColor: 'rgba(255, 140, 0, 0.5)' }, // #FFA500
    { background: 'rgba(255, 105, 180, 0.3)', borderColor: 'rgba(255, 20, 147, 0.5)' }, // #FF69B4
    { background: 'rgba(0, 191, 255, 0.3)', borderColor: 'rgba(0, 0, 205, 0.5)' }, // #00BFFF
    { background: 'rgba(255, 99, 71, 0.3)', borderColor: 'rgba(255, 69, 0, 0.5)' }, // #FF6347 (Extra variation)
    
    { background: 'rgba(255, 105, 180, 0.3)', borderColor: 'rgba(255, 20, 147, 0.5)' }, // Soft pink
    { background: 'rgba(34, 193, 195, 0.3)', borderColor: 'rgba(253, 187, 45, 0.5)' }, // Mint to gold gradient effect
    { background: 'rgba(75, 0, 130, 0.3)', borderColor: 'rgba(139, 0, 255, 0.5)' }, // Indigo to purple
    { background: 'rgba(255, 215, 0, 0.3)', borderColor: 'rgba(255, 140, 0, 0.5)' }, // Gold
    { background: 'rgba(255, 0, 255, 0.3)', borderColor: 'rgba(255, 105, 180, 0.5)' }, // Fuchsia
    { background: 'rgba(0, 128, 128, 0.3)', borderColor: 'rgba(0, 139, 139, 0.5)' }, // Teal
    { background: 'rgba(255, 223, 186, 0.3)', borderColor: 'rgba(255, 140, 0, 0.5)' }, // Light peach
    { background: 'rgba(70, 130, 180, 0.3)', borderColor: 'rgba(0, 0, 128, 0.5)' }, // Steel blue
  ];
  


export const getHighlightColorById = (id) => {
    const idString = String(id); // Ensure the ID is treated as a string
    const hash = idString
        .split('')
        .reduce((acc, char) => char.charCodeAt(0) + acc, 0); // Hash the ID
    const index = Math.abs(hash) % colors.length; // Ensure index is within bounds
    return colors[index];
};


