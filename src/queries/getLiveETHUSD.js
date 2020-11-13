import axios from 'axios'

export default async function getLiveETHUSD() {
    let response = await axios.get('https://rest.coinapi.io/v1/exchangerate/ETH/USD?apikey=B64054B0-6E32-4765-83C6-6E29BF4BE732');
    response = response.replace(',', '');
    return parseFloat(response).toFixed(2);
}