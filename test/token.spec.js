const PandaToken = artifacts.require("PandaToken");
const Airdrop = artifacts.require("Airdrop");

const toToken = (num) => {
   return web3.utils.toWei(num.toString(), 'ether')
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

contract("PandaToken test", async accounts => {
    it("assert base token data", async () => {
        const instance = await PandaToken.deployed();
        const totalSupply = await instance.totalSupply();
        assert.equal(totalSupply.toString(), '10000000000000000000000'); // 10_000_000_000 * 10**3 * 10 ** 9
        const name = await instance.name();
        assert.equal(name, 'Hungry Panda Token');
        const symbol = await instance.symbol();
        assert.equal(symbol, 'HUNGRYPANDA');
        const balance = await instance.balanceOf(accounts[0]);
        assert.equal(balance.toString(), '10000000000000000000000');
    });

    it("token must be paused after deployed", async () => {
        const instance = await PandaToken.deployed();
        const isPaused = await instance.paused();
        assert.equal(isPaused, true);
    });

    it("while token on pause no one except airdrop has permissions to transfer", async () => {
        const instance = await PandaToken.deployed();
        // owner transfer to another account
        let response = await instance.transfer(accounts[5], toToken(100), { from: accounts[0] });
        assertEventOfType(response, "Transfer", 0);
        assertThrow(() => {
            return instance.transfer(accounts[6], toToken(10), { from: accounts[5] });
        });
        const balance = await instance.balanceOf(accounts[5]);
        assert.equal(balance.toString(), toToken(100).toString(), 'balance must remain same');
    });

    it("test airdrop is able to allocate tokens", async () => {
        const instance = await PandaToken.deployed();
        const totalSupply = await instance.totalSupply();
        const airdrop = await Airdrop.deployed();
        
        const initial = await airdrop.maxAirdropAmount();
        assert.equal('0', initial.toString(), 'initial amount must be 0');
        const maxAmount = await airdrop.maxAirdropAmount();
        assert.equal(totalSupply.div(20).toString(),maxAmount.toString());
    });

    // it("should call a function that depends on a linked library", async () => {
    //     const meta = await MetaCoin.deployed();
    //     const outCoinBalance = await meta.getBalance.call(accounts[0]);
    //     const metaCoinBalance = outCoinBalance.toNumber();
    //     const outCoinBalanceEth = await meta.getBalanceInEth.call(accounts[0]);
    //     const metaCoinEthBalance = outCoinBalanceEth.toNumber();
    //     assert.equal(metaCoinEthBalance, 2 * metaCoinBalance);
    // });

    // it("should send coin correctly", async () => {
    //     // Get initial balances of first and second account.
    //     const account_one = accounts[0];
    //     const account_two = accounts[1];

    //     const amount = 10;

    //     const instance = await MetaCoin.deployed();
    //     const meta = instance;

    //     const balance = await meta.getBalance.call(account_one);
    //     const account_one_starting_balance = balance.toNumber();

    //     balance = await meta.getBalance.call(account_two);
    //     const account_two_starting_balance = balance.toNumber();
    //     await meta.sendCoin(account_two, amount, { from: account_one });

    //     balance = await meta.getBalance.call(account_one);
    //     const account_one_ending_balance = balance.toNumber();

    //     balance = await meta.getBalance.call(account_two);
    //     const account_two_ending_balance = balance.toNumber();

    //     assert.equal(
    //         account_one_ending_balance,
    //         account_one_starting_balance - amount,
    //         "Amount wasn't correctly taken from the sender"
    //     );
    //     assert.equal(
    //         account_two_ending_balance,
    //         account_two_starting_balance + amount,
    //         "Amount wasn't correctly sent to the receiver"
    //     );
    // });
});