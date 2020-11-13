import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

export default class CandidateForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            candidateParty: '',
            candidateName: ''
        }
        this.createCandidate = this.createCandidate.bind(this)
    }

    async componentDidMount() {
        try {

        } catch(error) {
            console.log(error)
        }
    }

    handleCandidateName = (event) => {
        this.setState({
            candidateName: event.target.value
        })
    }

    handleCandidateParty = (event) => {
        this.setState({
            candidateParty: event.target.value
        })
    }

    createCandidate = async () => {
        try{
            await this.props.election.methods.createCandidate(this.state.candidateName, this.state.candidateParty).send({ from: this.props.account })
        } catch(error) {
            console.log(error)
        }
    }

    render() {
        return(
            <Form>
                <FormGroup>
                    <Label>CandidateName: </Label>
                    <Input type="text" name="post" id="post" placeholder="Whats on your mind?" onChange={this.handleCandidateName} value={this.state.candidateName} />
                </FormGroup>
                <FormGroup>
                    <Label>Party:</Label>
                    <Input type="text" name="party" id="party" placeholder="libertarian" onChange={this.handleCandidateParty} value={this.state.candidateParty} />
                </FormGroup>
                <FormGroup>
                    <Button color='success' onClick={this.createCandidate}>Post</Button>
                </FormGroup>
            </Form>
        )
    }
}