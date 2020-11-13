import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Row, Col, Card, CardTitle, CardText } from 'reactstrap'

export default class Candidates extends Component {

    constructor(props) {
        super(props)
        this.state = {
            
        }
        this.castVote = this.castVote.bind(this)
    }

    async componentDidMount() {
        try {

        } catch(error) {
            console.log(error)
        }
    }

    castVote = async (candidateId) => {
        try {
            setTimeout(() => { this.props.action1(); }, 3000);
            await this.props.election.methods.castVote(candidateId).send({from: this.props.account})
            window.location.reload()
        } catch(error) {
            console.log(error)
        }
    }

    render() {
        return(
            <div>
                <h1 style={{textAlign: 'center', marginBottom: '5%'}} >Cast your vote here!</h1>
                {this.props.candidates.map(a => {
                        return(
                            <Row style={{display: 'inline-block', marginLeft: '10%', marginRight: '10%'}} >
                                <Col sm="20">
                                    <Card body>
                                        <CardTitle style={{textAlign: 'center'}} >{a.name}</CardTitle>
                                        
                                        <CardText>{a.party}</CardText>
                                        
                                        <CardText>{a.voteCount}</CardText>

                                        {this.props.hasVoted === false && <Button onClick={this.castVote.bind(this, a.id)} color='success' >Vote for me!</Button>}
                                        {this.props.hasVoted === true && <Button onClick='#' >You Voted Foo!</Button>}
                                    </Card>
                                    
                                </Col>
                            </Row>
                        )
                    })}
            </div>
        )
    }
}