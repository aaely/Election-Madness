import React, { Component } from 'react'
import Web3 from 'web3'
import loadWeb3 from '../utils/loadWeb3'
import loadAccount from '../utils/loadAccount'
import { Link } from 'react-router-dom'
import { Table, Button } from 'reactstrap'
import img1 from '../Images/Metamask.png'
import img2 from '../Images/Metamask2.png'
import img3 from '../Images/Metamask3.png'
import Ethereum from '../Images/Ethereum.jpg'
import Bitcoin from '../Images/Bitcoin.jpg'
import getLiveCoinPrice from '../queries/getLiveCoinPrice'
import getLiveETHUSD from '../queries/getLiveETHUSD'
  


export default class Dashboard extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            tabId: 0,
            account: '',
            bitcoinPrice: 0,
            ethereumPrice: 0
        }
    }

    async componentDidMount() {
        try {
            await loadWeb3();
            const account = await loadAccount();
            const bitcoinPrice = await getLiveCoinPrice();
            const ethereumPrice = await getLiveETHUSD();
            this.setState({
                account, bitcoinPrice, ethereumPrice
            })
        }
        catch(error) {
            console.log(error);
        }
    }

    incrementTab = () => {
        this.setState({
            tabId: this.state.tabId + 1
        })
    }

    decrementTab = () => {
        this.setState({
            tabId: this.state.tabId - 1
        })
    }

    renderMetamaskLink = () => {
        return(
            <div style={{textAlign: 'center'}} >
                <h3>You will need MetaMask in order to participate. It is a simple browser extension and can be found here:</h3> 
                <br />
                <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' target='_blank' rel="noreferrer" style={{fontSize: '24px', marginBottom: '10px'}} >MetaMask</a>
                <br />
                <p style={{marginTop: '10px'}} >Due to necessity, below this text is a picture of what you will see if you click the Metamask link above</p>
                <img src={img1} alt='Metamask' style={{marginLeft: 'auto', marginRight: 'auto', borderStyle: 'solid', borderColor: 'black', borderWidth: '3px', marginTop: '10px'}} />
                <br />
                <p>Due to necessity, above this text is a picture of what you will see if you click the Metamask link above</p>
                <Button onClick={this.incrementTab} color='success' style={{margin: '0 auto', marginTop: '10px'}} >I Have Metamask</Button>
                <h5 style={{marginTop: '10%'}}>Tip Ethereum</h5>
                <img src={Ethereum} alt='ethereum' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', height: '20%', width: '20%'}} />
                <h5 style={{marginTop: '10%'}}>Tip Bitcoin</h5>
                <img src={Bitcoin} alt='ethereum' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', height: '20%', width: '20%'}} />
            </div>
        )
    }

    renderGoerli = () => {
        return(
            <div>
                <h3>You will need to set metamask to the Goerli Network</h3>
                <br />
                <h5>Step 1:</h5>
                <br />
                <img src={img2} alt='Metamask 2' style={{marginLeft: 'auto', marginRight: 'auto', borderStyle: 'solid', borderColor: 'black', borderWidth: '3px', marginTop: '10px'}} />
                <br />
                <h5>Step 2:</h5>
                <br />
                <img src={img3} alt='Metamask 3' style={{marginLeft: 'auto', marginRight: 'auto', borderStyle: 'solid', borderColor: 'black', borderWidth: '3px', marginTop: '10px'}} />
                <br />
                <Button onClick={this.decrementTab} color='danger' style={{margin: '0 auto', marginRight: '5px', marginLeft: '5px', marginTop: '5px'}} >Go Back</Button>
                <Button onClick={this.incrementTab} color='success' style={{margin: '0 auto', marginRight: '5px', marginLeft: '5px', marginTop: '5px'}} >I Have Metamask</Button>
            </div>
        )
    }

    renderLink = () => {
        return(
            <div style={{textAlign: 'center', justifyContent: 'center'}} >
                <h1 style={{textAlign: 'center'}}>Welcome to Election-Madness</h1>
                <h3>You will need funds in order to register, and to vote. Funds can be acquired here:</h3> 
                <a href='https://goerli-faucet.slock.it/' target='_blank' rel="noreferrer" style={{fontSize: '24px'}} >Goerli Faucet</a>
                <br />
                <h3>Copy this value:</h3> 
                <br />
                <strong style={{fontSize: '30px', backgroundColor: 'yellow'}} >{this.state.account}</strong> 
                <br />
                <br />
                <h3>into the input field to request funds!</h3>
                <Button onClick={this.decrementTab} color='danger' style={{margin: '0 auto', marginTop: '5px', marginRight: '5px', marginLeft: '5px'}} >Go Back</Button>
                <Button onClick={this.incrementTab} color='success' style={{margin: '0 auto', marginTop: '5px', marginRight: '5px', marginLeft: '5px'}} >I Have Funds</Button>
            </div>
        )
    }

    renderTipTable = () => {
        return(
            <Table striped>
                <thead>
                    <tr>
                        <th>Crypto Coin</th>
                        <th>QR Code</th>
                        <th>Exchange Rate</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>BTC</td>
                        <td>{Bitcoin}</td>
                        <td> ${this.state.bitcoinPrice} </td>
                    </tr>
                </tbody>
            </Table>
        )
    }
    
    render() {
        
          return(
            <div style={{marginLeft: '5%', marginRight: '5%', marginTop: '3%'}} >
                <h1 style={{textAlign: 'center'}}>Welcome to Election-Madness</h1>
                <br />
                <div style={{textAlign: 'center'}} >
                    {this.state.tabId === 0 && this.renderMetamaskLink()}
                    {this.state.tabId === 1 && this.renderGoerli()}
                    {this.state.tabId === 2 && this.renderLink()}
                    {this.state.tabId === 3 && <Link to='/Dashboard' style={{fontSize: '40px'}} >Proceed to Register</Link>}
                    {this.renderTipTable()}
                </div>
            </div>
        )
    }
}