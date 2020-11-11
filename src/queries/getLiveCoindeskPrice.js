import axios from 'axios'

export default async function getLiveCoindeskPrice() {
    const livePrice = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
    let currentprice = livePrice.data.bpi.USD.rate
    return currentprice.replace(',', '');
}