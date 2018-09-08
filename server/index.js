
const express = require("express");
const ethers = require('ethers');
const app = express();
const cors = require("cors");
const utils = ethers.utils;
var config = require("../config/config.json");
const mkdirp = require("mkdirp");
const level = require("level");


let provider, faucetWallet;

let connect = () => {
    provider =  new ethers.providers.JsonRpcProvider('http://40.114.122.81:8545')
    faucetWallet = new ethers.Wallet('0x938c57c1b1e3c43407e86e38dddd4f4a92e90fb0c1d55a21c8c66e907cc84a2a');
    faucetWallet.provider = provider;    

}

connect()

mkdirp.sync(require("os").homedir() + "/.ethfaucetssl/queue");
mkdirp.sync(require("os").homedir() + "/.ethfaucetssl/exceptions");
const dbQueue = level(require("os").homedir() + "/.ethfaucetssl/queue");
const dbExceptions = level(
  require("os").homedir() + "/.ethfaucetssl/exceptions"
);

const greylistduration = 1000 * 60 * 60 * 24;

/**
 * Helper functions
 */

function isAddress(address) {
    return /^(0x)?[0-9a-f]{40}$/i.test(address);
}
  
function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function fixaddress(address) {
    address = address.replace(" ", "");
    address = address.toLowerCase();
    if (!strStartsWith(address, "0x")) {
        return "0x" + address;
    }
    return address;
}
  
/**
 * getFaucetBalance function rewritten, returns ether balance string converted
 */
getFaucetBalance = async () => {
    let etherString;
    await provider.getBalance(faucetWallet.address).then(function (balance) {
        etherString = utils.formatEther(balance);
        console.log('faucet Balance: ' + etherString);
    });
    return etherString.toString(10); 
  }


/**
 * This endpoint is only triggered when the address and user has been verified and valid.
 * 1 eth will be given
 */

app.get("/gitterAddress/:address", async function(req, res) {
    let etherbalance = -1;
    const toAddress =  req.params.address;

    try {
        if(toAddress != "") {
            var transactionCount = await faucetWallet.getTransactionCount();
            var signedTransaction;
            var transaction  = {
                nonce: transactionCount,
                gasLimit: 21000,
                gasPrice: utils.bigNumberify("20000000000"),
                to: toAddress,
                value: utils.parseEther("1.0"),
                data: "0x"
            };
            //  chainId: 6283
            console.log('tx constructed.')
            signedTransaction = faucetWallet.sign(transaction);
            console.log('tx signed');
            provider.sendTransaction(signedTransaction).then(function(hash) {
                console.log('Hash: ' + hash);
                //console.log(getFaucetBalance());
            });
        }

        
    } catch (e) {
      console.log(e);
      res.sendStatus(404);
    }
    res.sendStatus(200)      
});



app.listen(3000, function() {
    console.log("faucet listening on port 3000");
});


