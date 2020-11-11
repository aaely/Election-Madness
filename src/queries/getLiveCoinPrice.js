import axios from 'axios'

export default async function getLiveCoinPrice() {
    let response = await axios.get('https://rest.coinapi.io/v1/exchangerate/BTC/USD?apikey=B64054B0-6E32-4765-83C6-6E29BF4BE732');
    console.log(response)
    return response.data.rate;
}    