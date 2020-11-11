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
            this.state.election.methods.createVoter(this.state.voterName).send({from: this.state.account})
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        return(
            <Form>
                <FormGroup>
                    <Label>Name:</Label>
                    <Input type='text' name='voterName' id='voterName' onChange={this.handleVoterName} value={this.state.voterName} />
                    <Button onClick={this.registerVoter} >Register</Button>
                </FormGroup>
            </Form>
        )
    }
}