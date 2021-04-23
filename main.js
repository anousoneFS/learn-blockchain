const SHA256 = require('crypto-js/sha256');
class Block{
    constructor(index, timestamp, data, previousHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2021", "Genesis Block", 0);
    }

    // createGenesisBlock => new Block(0, "01/01/2021", "Genesis Block", 0);

    getLastesBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLastesBlock().hash;
        newBlock.hash = newBlock.calculateHash();;
        this.chain.push(newBlock);
    }

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
savejeeCoin.addBlock(new Block(1, "02/01/2021", {amount: 4} ));
savejeeCoin.addBlock(new Block(2, "04/01/2021", {amount: 10} ));
savejeeCoin.addBlock(new Block(3, "05/01/2021", {amount: 21} ));

console.log("is blockchain valid? " + savejeeCoin.isChainValid());
console.log(JSON.stringify(savejeeCoin, null, 4));

savejeeCoin.chain[1].data = {amount: 100};

console.log("is blockchain valid? " + savejeeCoin.isChainValid());
console.log(JSON.stringify(savejeeCoin, null, 4));





