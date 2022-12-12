import web3 = require('@solana/web3.js')
import Dotenv = require('dotenv')
Dotenv.config() 

async function main() {
    const payer = initializeKeypair()
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    await sendSol(connection, 0.1*web3.LAMPORTS_PER_SOL, web3.Keypair.generate().publicKey, payer)
}

function initializeKeypair(): web3.Keypair {
    const secret = JSON.parse(process.env.PRIVATE_KEY?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey)
    return keypairFromSecretKey
}

async function sendSol(connection: web3.Connection, amount: number, to: web3.PublicKey, sender: web3.Keypair) {
    const transaction = new web3.Transaction()

    const sendSolInstruction = web3.SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: to,
        lamports: amount
    })
    transaction.add(sendSolInstruction)

    const sig = await web3.sendAndConfirmTransaction(connection, transaction, [sender])
    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`);

}



main().then(() => {
    console.log('Finished successfully')
}).catch((err) => {
    console.error(err)
})