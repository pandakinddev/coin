const fs = require("fs");
const ethers = require('ethers');
// contracts ...
const PandaToken = artifacts.require("PandaToken");
const Airdrop = artifacts.require("SimpleAirdrop");



const toToken = (num) => {
   return web3.utils.toWei(num.toString(), 'gwei')
}

const assertEventOfType = function(response, eventName, index) {
    assert.equal(response.logs[index].event, eventName, eventName + ' event should fire.');
}

const assertThrow = async function (action) {
    try {
        await action();
        assert.equal(true, false);
    } catch (error) {
        assert.equal(true, true);
    }
}

const createSignature = (recipient,amount,privKey) => {
    const message = web3.utils.soliditySha3(
        { t: 'address', v: recipient },
        { t: 'uint256', v: amount }
    ).toString('hex');
    const { signature } = web3.eth.accounts.sign(
        message,
        privKey
    );
    return { signature, recipient, amount };
};




contract("PandaToken test", async accounts => {
    const tokenOwner = accounts[0];
    const airdropOwner = accounts[1];
    const whiteListOwner = accounts[2];

    it("assert base token data", async () => {
        const instance = await PandaToken.deployed();
        const totalSupply = await instance.totalSupply();
        assert.equal(totalSupply.toString(), '10000000000000000000000'); // 10_000_000_000 * 10**3 * 10 ** 9
        const name = await instance.name();
        assert.equal(name, 'Hungry Panda Token');
        const symbol = await instance.symbol();
        assert.equal(symbol, 'HUNGRYPANDA');
        const airdrop = await Airdrop.deployed();
        const airBalance = await instance.balanceOf(airdrop.address);
        const maxAmount = totalSupply.div(web3.utils.toBN('100'));
        assert.equal(airBalance.toString(), maxAmount);
        const leftBalance = await instance.balanceOf(tokenOwner);
        assert.equal(leftBalance.toString(), totalSupply.sub(maxAmount).toString());
    });

    it("while token on pause no one except airdrop has permissions to transfer", async () => {
        const instance = await PandaToken.deployed();
        assertThrow(() => {
            return instance.transfer(accounts[5], toToken(100), { from: tokenOwner });
        });
    });

    it("test airdrop is able to allocate tokens", async () => {
        const mnemonic = fs.readFileSync(".secret").toString()
        const airdropAdmin = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/1`);
        assert.equal(airdropOwner, airdropAdmin.address.toString(),'must be same');
        const instance = await PandaToken.deployed();
        const totalSupply = await instance.totalSupply();
        const airdrop = await Airdrop.deployed();
        
        const initial = await airdrop.currentAirdropAmount();
        assert.equal('0', initial.toString(), 'initial amount must be 0');
        const maxAmount = await airdrop.maxAirdropAmount();
        const shouldBe = totalSupply.div(web3.utils.toBN('100')).toString();
        assert.equal(shouldBe, maxAmount.toString(),"max amount should be same");
        // lets transfer some tokens
        // first we need to sign payload (recipient address + amount)
        const hundred = toToken(100);
        var { recipient, amount, signature } = createSignature(
            accounts[9],
            web3.utils.numberToHex(toToken(100)),
            airdropAdmin.privateKey);
        assert.equal(recipient, accounts[9], "must be same");
        
        let result = await airdrop.claimTokens(amount, signature, { from: recipient });
        assertEventOfType(result, 'AirdropProcessed', 0);
        // verify ballance ...
        let balance = await instance.balanceOf(recipient);
        assert.equal(hundred.toString(), balance.toString(), "balance must be 100 tokens");
        // let's check that we can't transfer twice
        assertThrow(() => {
            return airdrop.claimTokens(amount, signature, { from: recipient });
        });
        balance = await instance.balanceOf(recipient);
        assert.equal(hundred.toString(), balance.toString(), "balance must be same");
        // wrong sign
        var { recipient, amount, signature } = createSignature(
            accounts[8],
            web3.utils.numberToHex(toToken(100)),
            ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/2`).privateKey);
        assert.equal(recipient, accounts[8], "must be same");
        assertThrow(() => {
            return airdrop.claimTokens(amount, signature, { from: recipient });
        });
        balance = await instance.balanceOf(recipient);
        assert.equal('0', balance.toString(), "balance must be zero");
        // more then maximum ...
        var { recipient, amount, signature } = createSignature(
            accounts[8],
            web3.utils.numberToHex(maxAmount),
            airdropAdmin.privateKey);
        assert.equal(recipient, accounts[8], "must be same");
        assertThrow(() => {
            return airdrop.claimTokens(amount, signature, { from: recipient });
        });
        balance = await instance.balanceOf(recipient);
        assert.equal('0', balance.toString(), "balance must be zero");
    });

});