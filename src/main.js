const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block{
    constructor(timestamp, transactions, previousHash=''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    minBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined = " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransaction = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2021", "Genesis Block", 0);
    }

    // createGenesisBlock => new Block(0, "01/01/2021", "Genesis Block", 0);

    getLastesBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransaction);
        block.minBlock(this.difficulty);

        console.log("Block Success fully mine!!");
        this.chain.push(block);

        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLastesBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();;
    //     newBlock.minBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    isChainValid(){
        for(let i=1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let savejeeCoin = new Blockchain();
savejeeCoin.createTransaction(new Transaction('address1', 'address2', 100))
savejeeCoin.createTransaction(new Transaction('address2', 'address1', 50))

console.log("Start the miner");
savejeeCoin.minePendingTransactions("sone-address");

console.log("Get balance", savejeeCoin.getBalanceOfAddress("sone-address"));


console.log("Start the miner again...");
savejeeCoin.minePendingTransactions("sone-address");

console.log("Get balance", savejeeCoin.getBalanceOfAddress("sone-address"));




