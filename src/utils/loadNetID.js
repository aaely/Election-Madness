import Web3 from 'web3'

export default async function loadNetID() {
    const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        console.log(networkId)
        return networkId
}