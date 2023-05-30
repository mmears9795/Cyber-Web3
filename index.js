const { Client, Intents, Guild } = require("discord.js");
const Web3 = require("web3");
const require = 'dotenv/config';

console.log(Web3.version);
const web3 = new Web3(process.env.INFURA_URL);

const bot = new Client({intents:[Intents.FLAGS.GUILDS]});

// bot.on('ready', () => {
//     console.log('The bot is ready');

//     const priceCheckInterval = setInterval (async function () {

//         let price = await getCYBRprice();
//         price = "$" + parseFloat(price).toFixed(8);
//         bot.user.setActivity(price, {type: 'WATCHING'});
//     }, 1000);
// })

const tokens = {
    "USDC": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "WETH": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "CYBR": "0x438a6E42813118548C065336844239b63ad4Fcfd",
    "USDT": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
};

const ABI = [{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]

async function getTokenBalance(token, walletAddress)
{
    let contract = new web3.eth.Contract(ABI, token);

    let b = await contract.methods.balanceOf(walletAddress).call();

    if (token == tokens["USDC"] || token == tokens["USDT"])
    {
        var balance = b / 1e6;
    }
    else
    {
        var balance = b / 1e18;
    }

    return balance;
}

async function getCYBRprice()
{
    try 
    {
        let WETHinLP = await getTokenBalance(tokens["WETH"], "0xC36442b4a4522E871399CD717aBDD847Ab11FE88");

        console.log(WETHinLP);

        let USDCinLP = await getTokenBalance(tokens["USDC"], "0xC36442b4a4522E871399CD717aBDD847Ab11FE88");

        console.log(USDCinLP);

        let mp = USDCinLP / WETHinLP;
        let ETHprice = mp.toFixed(2);

        let CYBRbalance = await getTokenBalance(tokens["CYBR"], "0x1316e0655428840Dba61Bd75980cBE43488C35fd");

        let WETHbalance = await getTokenBalance(tokens["WETH"], "0x1316e0655428840Dba61Bd75980cBE43488C35fd");

        let x = WETHbalance / CYBRbalance;
        let y = x * ETHprice;

        let CYBRprice = y;

        //console.log(`price; $${CYBRprice}`);
        return CYBRprice;
    } 
    catch (error) 
    {
        console.error(error);
        //getCYBRprice();
    }
}

getCYBRprice();

//bot.login("");