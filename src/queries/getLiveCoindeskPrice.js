import axios from 'axios'

export default async function getLiveEthereumPrice() {
    const livePrice = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
    let currentprice = livePrice.data.bpi.USD.rate
    return currentprice;
}