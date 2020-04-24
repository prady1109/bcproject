// JavaScript source code
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'flavor under camera immune vocal place rubber meat fashion nut palace hollow',
    'https://rinkeby.infura.io/v3/d40ac622743448939e0e6fcc497d2e0d'
);
let inbox;
let accounts;
const web3 = new Web3(provider);
const deploy = async() => {
    accounts = await web3.eth.getAccounts();
    console.log('attempting to deploy from accounts', accounts[0]);
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode})
        .send({ from: accounts[0], gas: '1000000' });
    console.log(interface);
    console.log('contract deployed to', inbox.options.address);
    
};
deploy();