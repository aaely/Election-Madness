import React, { Component } from 'react'
import loadWeb3 from '../utils/loadWeb3'
import { Link } from 'react-router-dom'
import { BsPlus, BsFileText } from 'react-icons/bs'
import { RiExchangeDollarFill } from 'react-icons/ri'
import { Table, Image } from 'reactstrap'
import { Button, Form, FormGroup, Label, Input, Row, Col, Card, CardTitle, CardText } from 'reactstrap'
import getLiveCoindeskPrice from '../queries/getLiveCoindeskPrice'
import getLiveCoinPrice from '../queries/getLiveCoinPrice'
import getLiveETHUSD from '../queries/getLiveETHUSD'
import Election from '../abis/Election.json'
import Web3 from 'web3'
import Candidates from './Candidates'
import CandidateForm from './CandidateForm'
import RegistrationForm from './RegistrationForm'
  


export default class Dashboard extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            trimmedDataURL: null,
            coindeskPrice: 0,
            coinapiPrice: 0,
            ethUSD: 0,
            account: '',
            candidates: [],
            voters: [],
            election: null,
            candidateCount: 0,
            voterCount: 0,
            tabId: 0
        }
    }

    async componentDidMount() {
        try {
            const coindeskPrice = await getLiveCoindeskPrice();
            const coinapiPrice = await getLiveCoinPrice();
            const ethUSD = await getLiveETHUSD();
            await this.loadWeb3();
            await this.loadBlockchainData();
            this.setState({
                coindeskPrice,
                coinapiPrice,
                ethUSD
            })
        }
        catch(error) {
            console.log(error);
            this.setState({
                loadingItems: false
            })
        }
    }

    async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }

    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        // Network ID
        const networkId = await web3.eth.net.getId()
        console.log(networkId)
        //const networkData = SocialNetwork.networks[networkId]
        const networkData = Election.networks[networkId]
        if(networkData) {
          const election = new web3.eth.Contract(Election.abi, networkData.address)
          console.log(election)
          this.setState({ election })
          const voterCount = await election.methods.voterCount().call()
          const candidateCount = await election.methods.candidateCount().call()
          this.setState({ voterCount, candidateCount })
          for(let i = 1; i <= candidateCount; i++) {
              const candidate = await election.methods.candidates(i).call()
              this.setState({ candidates: [...this.state.candidates, candidate]})
          }
          for(let j = 1; j <= voterCount; j++) {
              const voter = await election.methods.voters(j).call()
              this.setState({
                  voters: [...this.state.voters, voter]
              })
          }
        } else {
          window.alert('Election contract not deployed to detected network.')
        }
        console.log(this.state)
      }

    isAccountRegistered = async () => {
        const response = await this.state.election.methods.regVoters(this.state.account).send({from: this.state.account})
        console.log(response)
    }

    renderMetamaskLink = () => {
        return(
            <span style={{textAlign: 'center', backgroundColor: 'red', fontSize: '24px'}} >
                You will need MetaMask in order to participate. It is a simple browser extension and can be found here: <br />
                <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' target='_blank' style={{backgroundColor: 'black', color: 'red'}} >MetaMask</a>
            </span>
        )
    }

    renderLink = () => {
        return(
            <span style={{textAlign: 'center', backgroundColor: 'red', fontSize: '24px'}} >
                No funds to register or vote? Go <a href='https://goerli-faucet.slock.it/' target='_blank' style={{backgroundColor: 'black', color: 'yellow'}} >here</a> and copy this value-- <strong style={{fontSize: '30px'}} >{this.state.account}</strong>-- into the input field to request funds!
            </span>
        )
    }
    
    render() {
        
          return(
            <div style={{marginLeft: '5%', marginRight: '5%', marginTop: '3%'}} >
                <h1 style={{backgroundColor: 'red', fontSize: '50px'}} ><strong>Please register first if you have not. <br /> Attemping to register the same account will result in an error.</strong></h1>
                {this.state.account === '0xBcA3320e93C54513A467Bb517dC25f9Eba15e779' && <CandidateForm election={this.state.election} account={this.state.account} />}
                <br />
                <h3><a href='https://goerli-faucet.slock.it/' target='_blank' ref='noreferrer'> Need More Funds?</a></h3>
                <br />
                <RegistrationForm election={this.state.election} account={this.state.account} />
                <br />
                <Candidates candidates={this.state.candidates} election={this.state.election} account={this.state.account} />
                <br />
                <h1 style={{backgroundColor: 'red', fontSize: '50px'}} ><strong>Attempting to vote without registering will result in an error. <br />
                Attempting to vote more than once will also result in an error. <br />
                </strong></h1>
                <br />
                <h3 style={{textAlign: 'center', marginTop: '30%'}}><strong>Live Exchange Prices</strong></h3>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Coin</th>
                            <th>Currnecy</th>
                            <th>Exchange Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                CoinDesk
                            </td>
                            <td>
                                BTC
                            </td>
                            <td>
                                USD
                            </td>
                            <td>
                                ${parseFloat(this.state.coindeskPrice).toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                CoinAPI.io
                            </td>
                            <td>
                                BTC
                            </td>
                            <td>
                                USD
                            </td>
                            <td>
                                ${parseFloat(this.state.coinapiPrice).toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                CoinAPI.io
                            </td>
                            <td>
                                ETH
                            </td>
                            <td>
                                USD
                            </td>
                            <td>
                                ${parseFloat(this.state.ethUSD).toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }


}