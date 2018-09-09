const moment = require('moment');

IsEligible = (address,timestamp) => {
    let gitterMap = new Map();
    const newAddy = '0x292032093239049242';
    const time = Date.now()-1;
    gitterMap.set(newAddy, time);

    const invalidAddress = "Sorry this is address already got some tokens";
    const invalidTimestamp = "Sorry you can only receive 1 token per 24 hour period";
    const successMessage = "Token sent!";
    const OneDay = new Date().getTime() + (24 * 60 * 60 * 1000);

    let value = gitterMap.get(newAddy);
    if (gitterMap.has(address) && OneDay < value) {
        return invalidAddress
    } else if(OneDay < value) {
        return console.log(invalidTimestamp)
    } else {
        gitterMap.set(address,timestamp);
        return successMessage;
    }
};

const addy = "0x902384908234";
const tm = Date.now();
IsEligible(addy, tm);

