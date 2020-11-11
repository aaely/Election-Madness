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
            await this.props.election.methods.castVote(candidateId).send({from: this.props.account})
        } catch(error) {
            console.log(error)
        }
    }

    render() {
        return(
            <div>
                {this.props.candidates.map(a => {
                        return(
                            <Row style={{display: 'inline-block', marginLeft: '10%', marginRight: '10%'}} >
                                <Col sm="20">
                                    <Card body>
                                        <CardTitle style={{textAlign: 'center'}} >{a.name}</CardTitle>
                                        
                                        <CardText>{a.party}</CardText>
                                        
                                        <CardText>{a.voteCount}</CardText>

                                        <Button onClick={this.castVote.bind(this, a.id)} >Vote for me!</Button>
                                    </Card>
                                    
                                </Col>
                            </Row>
                        )
                    })}
            </div>
        )
    }
}