import React, { Component } from 'react'
import loadWeb3 from '../utils/loadWeb3'
import { Table } from 'reactstrap'
import Loader from './Loader'
import VotedFor from './VotedFor'
import Bitcoin from '../Images/Bitcoin.jpg'
import Ethereum from '../Images/Ethereum.jpg'
import getLiveCoindeskPrice from '../queries/getLiveCoindeskPrice'
import getLiveETHUSD from '../queries/getLiveETHUSD'
import Election from '../abis/Election.json'
import Candidates from './Candidates'
import CandidateForm from './CandidateForm'
import RegistrationForm from './RegistrationForm'
import EtherLogo from '../Images/EtherLogo.png'
import MyPieChart from './Graphs'
  


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
            loading: true,
            hasVoted: false,
            totalVotes: 0,
            bidenVotes: 0,
            trumpVotes: 0,
            joVotes: 0,
            showMessage: false
        }
    }

    async componentDidMount() {
        try {
            //this.setState({ loading: true })
            await loadWeb3();
            await this.loadBlockchainData();
            const isRegistered = await this.isAccountRegistered();
            if(isRegistered) {
                const voterId = this.getVoterId()
                this.setState({ isRegistered, voterId })
                const hasVoted = await this.hasVoted();
                if(hasVoted) {
                    const candidateId = this.getCandidateId();
                    this.setState({ hasVoted, candidateId })
                }
            }
            this.setState({
                bidenVotes: this.state.candidates[0].voteCount,
                trumpVotes: this.state.candidates[1].voteCount,
                joVotes: this.state.candidates[2].voteCount
            })
            const coindeskPrice = await getLiveCoindeskPrice();
            this.setState({
                coindeskPrice
            })
            //const coinapiPrice = await getLiveCoinPrice();
            const ethUSD = await getLiveETHUSD();
            this.setState({
                ethUSD
            })
            this.setState({ loading: false })
        }
        catch(error) {
            console.log(error);
            this.setState({
                loading: false
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
        //const networkData = SocialNetwork.networks[networkId]
        const networkData = Election.networks[networkId]
        if(networkData) {
          const election = new web3.eth.Contract(Election.abi, networkData.address)
          this.setState({ election })
          const voterCount = await election.methods.voterCount().call()
          const candidateCount = await election.methods.candidateCount().call()
          const totalVotes = await election.methods.totalVotes().call()
          this.setState({ voterCount, candidateCount, totalVotes })
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
      }

    renderMetamaskLink = () => {
        return(
            <span style={{textAlign: 'center', backgroundColor: 'red', fontSize: '24px'}} >
                You will need MetaMask in order to participate. It is a simple browser extension and can be found here: <br />
                <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' target='_blank' style={{backgroundColor: 'black', color: 'red'}} >MetaMask</a>
            </span>
        )
    }

    getCandidateId = () => {
        let array = this.state.voters.filter(prop => {
            return prop.voter.includes(`${this.state.account}`)
        })
        console.log(array[0].votedFor)
        return array[0].votedFor
    }

    getVoterId = () => {
        let array = this.state.voters.filter(prop => {
            return prop.voter.includes(`${this.state.account}`)
        })
        console.log(array[0].id)
            if (array[0].id.length > 0) {
            return array[0].id
        }
    }

    isAccountRegistered = async () => {
        const response = await this.state.election.methods.regVoters(this.state.account).call()
        return response
    }

    hasVoted = async () => {
        const response = await this.state.election.methods.voted(this.state.account).call()
        return response
    }

    updateStatus = (status) => {
        setTimeout(() => { this.setState({isRegistered: status, loading: !this.state.loading}); }, 100);
    }

    handleLoading = () => {
        this.setState({
            loading: !this.state.loading,
            showMessage: !this.state.showMessage
        })
    }

    handleHasVoted = () => {
        this.setState({
            hasVoted: !this.state.hasVoted
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
                        <td>
                            ${this.state.coindeskPrice}
                        </td>
                        <td>
                            ${this.state.ethUSD}
                        </td>
                    </tr>
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
                {this.state.isRegistered === false && <RegistrationForm election={this.state.election} account={this.state.account} action1={this.updateStatus} action2={this.handleLoading} />}
                <br />
                {this.state.isRegistered === true && this.state.hasVoted === false && <Candidates candidates={this.state.candidates} voterId={this.state.voterId} election={this.state.election} hasVoted={this.state.hasVoted} account={this.state.account} action1={this.handleLoading} action2={this.handleHasVoted} />}
                <br />         
                {this.state.hasVoted === true && <VotedFor candidateId={this.state.candidateId} Candidates={this.state.candidates} />}
                {<h3 style={{textAlign: 'center', marginTop: '5%'}}><strong>Tip Addresses</strong></h3>}
                {this.renderTipTable()}
            </div>
        )
    }
    
    render() {
          return(
            <div>
                {this.state.loading === false && <MyPieChart bidenVotes={this.state.bidenVotes} trumpVotes={this.state.trumpVotes} joVotes={this.state.joVotes} totalVotes={this.state.totalVotes} /> }
                {this.state.loading === false && this.renderMainContent()}
                {this.state.loading === true && this.state.showMessage === true && <span style={{marginTop: '5%', textAlign: 'center'}}><h1>Please wait for your transaction to confirm...</h1></span>}
                {this.state.loading === true && <Loader />}
            </div>
        )
    }
}