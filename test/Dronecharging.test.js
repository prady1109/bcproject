const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require( 'web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode}=require('../compile'); 
let dronecharging;

let accounts;

beforeEach(async () => {
accounts= await web3.eth.getAccounts();
dronecharging= await new web3.eth.Contract(JSON.parse(interface))
	.deploy({data: bytecode})
	.send({from:accounts[0], gas:'3000000'});
});


describe('Dronechargning',() => { 
  it('deploys a contract', async() => {
	assert.ok(dronecharging.options.address);
 });
   it('allow a drone to enter', async () => {
	await dronecharging.methods.drone_enter('pr',8,5,24,10,10).send({from:accounts[1],gas:'3000000',value:web3.utils.toWei((26*8).toString(),'finney')});
	const drones = await dronecharging.methods.getdrones().call({from:accounts[0]});
	assert.equal(1,drones);
   });
   it('allow a station to enter', async () => {
	await dronecharging.methods.station_enter('ij',24,1,1).send({from:accounts[2],gas:'3000000'});
	const station = await dronecharging.methods.getstations().call({from:accounts[0]});
	//console.log(station);
   });
   it('dont enter with valid amount', async () => {
	try{
	await dronecharging.methods.drone_enter('pr',8,5,20,10,10).send({from:accounts[1],gas:'3000000',value:web3.utils.toWei((20).toString(),'finney')});
	assert(false);
	} catch(err){
		assert(err);
		console.log('invalid amount entered');
	}
   });

   it('authorised access only to the manager', async () => {
	try{
	await dronecharging.methods.pickwinner().send({from:accounts[1],gas:'3000000'});
	assert(false);
	} catch(err){
		assert(err);
		console.log('called by non-authorised person');
	}
   });
   it('checking whether transactions are done successfully', async () => {
   	const dib= await web3.eth.getBalance(accounts[1]);
	await dronecharging.methods.drone_enter('pr',2,5,20,1,1).send({from:accounts[1],gas:'3000000',value:web3.utils.toWei((20*5).toString(),'finney')});
	const sib=await web3.eth.getBalance(accounts[2]);
	await dronecharging.methods.station_enter('ij',24,2,2).send({from:accounts[2],gas:'3000000'});
	await dronecharging.methods.pickwinner().send({from:accounts[0],gas:'3000000'});
	const dfb=await web3.eth.getBalance(accounts[1]);
	const sfb=await web3.eth.getBalance(accounts[2]);
	const ddiff=dib-dfb;
	const sdiff=sfb-sib;
	assert(ddiff>=web3.utils.toWei((18*5).toString(),'finney') && sdiff>=web3.utils.toWei((18*5).toString(),'finney'));
   });

});