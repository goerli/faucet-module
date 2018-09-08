
const express = require("express");
const ethers = require('ethers');
const app = express();
const cors = require("cors");
require('dotenv').config()
const utils = ethers.utils;
var config = require("../config/config.json");
const mkdirp = require("mkdirp");
const level = require("level");


let provider, faucetWallet;

function connect() {
    provider =  new ethers.providers.JsonRpcProvider('http://40.114.122.81:8545')
    faucetWallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    faucetWallet.provider = provider;    
    console.log("Provider Created");
}

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
  
 async function getFaucetBalance() {
    let etherString;
    await provider.getBalance(faucetWallet.address).then(function (balance) {
        etherString = utils.formatEther(balance);
        console.log('faucet Balance: ' + etherString);
    });
    return etherString.toString(10); 
  }

  async function getTxCount() {
    var transactionCount = await faucetWallet.getTransactionCount();
    console.log('Transaction Count: ' + transactionCount)
    return transactionCount
  }

  async function sendTestEth(address) {
    let txHash;
    try {
        const trimmedAddress = address.trim();
        var transactionCount = await faucetWallet.getTransactionCount();
        console.log(transactionCount  +  " - transaction count");
        const transaction  = {
            nonce: transactionCount,
            gasLimit: utils.bigNumberify(30000),
            gasPrice: utils.bigNumberify("20000000000000"),
            to: trimmedAddress,
            value: utils.parseEther("1.0"),
            data: "0x"
        };
        console.log(transaction)
        const signedTransaction = await faucetWallet.sign(transaction);
        console.log('tx signed');
        const sendRes = await provider.sendTransaction(signedTransaction);
        console.log(sendRes)
        return "x";
    } catch(e) {
        console.log(e);   
        return "error";     
    }
  }

app.listen(3000, function() {
    console.log("faucet listening on port 3000");
});

module.exports = {connect, getFaucetBalance, getTxCount, sendTestEth}

