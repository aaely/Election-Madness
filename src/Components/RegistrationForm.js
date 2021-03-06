import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

export default class RegistrationForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            voterName: ''
        }
        this.registerVoter = this.registerVoter.bind(this)
    }

    async componentDidMount() {
        try {

        } catch(error) {
            console.log(error)
        }
    }

    handleVoterName = (event) => {
        this.setState({
           voterName: event.target.value
        })
    }

    registerVoter = async () => {
        try {
            setTimeout(() => { this.props.action2(); }, 3000);
            await this.props.election.methods.createVoter(this.state.voterName).send({from: this.props.account})
            let status = await this.props.election.methods.regVoters(this.props.account).call()
            this.props.action1(status)
            window.location.reload()
        } catch(error) {
            setTimeout(() => { this.props.action2(false); }, 3000);
            console.log(error);
        }
    }

    render() {
        return(
            <Form>
                <FormGroup>
                    <Label>Please enter your name here:</Label>
                    <Input type='text' name='voterName' id='voterName' onChange={this.handleVoterName} value={this.state.voterName} />
                    <Button onClick={this.registerVoter} color='success' style={{marginTop: '5px'}} >Register</Button>
                </FormGroup>
            </Form>
        )
    }
}