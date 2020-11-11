import Web3 from 'web3'

export default async function loadAccount() {
    const web3 = window.web3
        // Load account
        const account = await web3.eth.getAccounts()
        console.log(account)
        const userAccount = account[0]
        console.log(userAccount)
        return userAccount
}