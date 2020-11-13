import React, { Component } from 'react'
import loadWeb3 from '../utils/loadWeb3'
import { Link } from 'react-router-dom'
import { BsPlus, BsFileText } from 'react-icons/bs'
import { RiExchangeDollarFill } from 'react-icons/ri'
import { Table } from 'reactstrap'
import Loader from './Loader'
import { Button, Form, FormGroup, Label, Input, Row, Col, Card, CardTitle, CardText } from 'reactstrap'
import Bitcoin from '../Images/Bitcoin.jpg'
import Ethereum from '../Images/Ethereum.jpg'
import getLiveCoindeskPrice from '../queries/getLiveCoindeskPrice'
import getLiveCoinPrice from '../queries/getLiveCoinPrice'
import getLiveETHUSD from '../queries/getLiveETHUSD'
import Election from '../abis/Election.json'
import Web3 from 'web3'
import Candidates from './Candidates'
import CandidateForm from './CandidateForm'
import RegistrationForm from './RegistrationForm'
import EtherLogo from '../Images/EtherLogo.png'
  


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
            tabId: 0,
            isRegistered: false,
            loading: false
        }
    }

    async componentDidMount() {
        try {
            await loadWeb3();
            await this.loadBlockchainData();
            const isRegistered = await this.isAccountRegistered();
            /*const coindeskPrice = await getLiveCoindeskPrice();
            const coinapiPrice = await getLiveCoinPrice();
            const ethUSD = await getLiveETHUSD();*/
            this.setState({
                isRegistered
            })
            /*this.setState({
                coindeskPrice,
                coinapiPrice,
                ethUSD
            })*/
        }
        catch(error) {
            console.log(error);
            this.setState({
                loadingItems: false
            })
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

    renderMetamaskLink = () => {
        return(
            <span style={{textAlign: 'center', backgroundColor: 'red', fontSize: '24px'}} >
                You will need MetaMask in order to participate. It is a simple browser extension and can be found here: <br />
                <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' target='_blank' style={{backgroundColor: 'black', color: 'red'}} >MetaMask</a>
            </span>
        )
    }

    isAccountRegistered = async () => {
        const response = await this.state.election.methods.regVoters(this.state.account).call()
        return response
    }

    updateStatus = (status) => {
        setTimeout(() => { this.setState({isRegistered: status, loading: !this.state.loading}); }, 100);
    }

    handleLoading = () => {
        this.setState({
            loading: !this.state.loading
        })
    }

    renderTipTable = () => {
        return(
            <Table striped style={{textAlign:'center', marginLeft: 'auto', marginRight: 'auto'}} >
                <thead>
                    <tr>
                        <th>Bitcoin</th>
                        <th>Ethereum</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img src={Bitcoin} alt='bitcoin' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', height: '20%', width: '20%'}} /></td>
                        <td><img src={Ethereum} alt='ethereum' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', height: '20%', width: '20%'}} /></td>
                    </tr>
                </tbody>
            </Table>
        )
    }

    renderMainContent() {
        return(
            <div style={{marginLeft: '5%', marginRight: '5%', marginTop: '3%', backgroundImage: `url(${EtherLogo})`, backgroundPosition: 'center', backgroundSize: 'contain'}} >
                {this.state.account === '0xBcA3320e93C54513A467Bb517dC25f9Eba15e779' && <CandidateForm election={this.state.election} account={this.state.account} />}
                <br />
                <h3 style={{textAlign: 'center'}} ><a href='https://goerli-faucet.slock.it/' target='_blank' ref='noreferrer'> Need More Funds?</a></h3>
                <br />
                {this.state.isRegistered === false && <RegistrationForm election={this.state.election} account={this.state.account} action1={this.updateStatus} />}
                <br />
                {this.state.isRegistered === true && <Candidates candidates={this.state.candidates} election={this.state.election} account={this.state.account} action1={this.handleLoading} />}
                <br />
                {/*<h3 style={{textAlign: 'center', marginTop: '5%'}}><strong>Tip Addresses</strong></h3>*/}
                {/*this.renderTipTable()*/}
            </div>
        )
    }
    
    render() {
          return(
            <div>
                {this.state.loading === false && this.renderMainContent()}
                {this.state.loading === true && <span style={{marginTop: '5%', textAlign: 'center'}}><h1>Please wait for your transaction to confirm...</h1></span>}
                {this.state.loading === true && <Loader />}
            </div>
        )
    }
}