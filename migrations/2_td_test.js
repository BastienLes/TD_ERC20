const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var ExerciceSolution = artifacts.require("ExerciceSolution.sol");
var evaluator = artifacts.require("Evaluator.sol");
var ERC20 = artifacts.require("@openzeppelin/contracts/token/ERC20/ERC20.sol")

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        // await deployTDToken(deployer, network, accounts); 
        // await deployEvaluator(deployer, network, accounts); 
        // await setPermissionsAndRandomValues(deployer, network, accounts); 
        // await deployRecap(deployer, network, accounts); 
        await hardCodeContractAddress(deployer, network, accounts); 
        await testDeployment(deployer, network, accounts); 
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC20-101","TD-ERC20-101",web3.utils.toBN("20000000000000000000000000000"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	randomSupplies = []
	randomTickers = []
	for (i = 0; i < 20; i++)
		{
		randomSupplies.push(Math.floor(Math.random()*1000000000))
		randomTickers.push(Str.random(5))
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	console.log(randomTickers)
	console.log(randomSupplies)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomTickersAndSupply(randomSupplies, randomTickers);
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function hardCodeContractAddress(deplaoyer, network, accounts){
	TDToken = await TDErc20.at("0xbf23538e0c8AB87f517E2d296cb0E71D3d3AFE8F")
	Evaluator = await evaluator.at("0xcff8985FF63cDce92036A2747605FB7ead26423e")
}

async function testDeployment(deployer, network, accounts) {
	// init
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Init balance : " + getBalance.toString());


	// ex1
	await Evaluator.ex1_getTickerAndSupply({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex1 balance : " + getBalance.toString());


	// ex2
	assignedTicker = await Evaluator.assignedTicker(accounts[1]);
	console.log(assignedTicker);
	assignedSupply = new web3.utils.BN(await Evaluator.assignedSupply(accounts[1]));
	console.log(assignedSupply.toString());
	myERC20 = await TDErc20.new(assignedTicker, assignedTicker, assignedSupply.toString(), {from: accounts[1]});	
	await Evaluator.submitExercice(myERC20.address, {from: accounts[1]});
	await Evaluator.ex2_testErc20TickerAndSupply({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex2 balance : " + getBalance.toString());


	// ex3
	myExSol = await ExerciceSolution.new("ERC20_LES", "ERC20_LES", 1000000000000000, {from: accounts[1]});	
	await Evaluator.submitExercice(myExSol.address, {from: accounts[1]});
	await Evaluator.ex3_testGetToken({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex3 balance : " + getBalance.toString());


	// ex4
	await Evaluator.ex4_testBuyToken({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex4 balance : " + getBalance.toString());


}


