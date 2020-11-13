import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Row, Col, Card, CardTitle, CardText } from 'reactstrap'

export default class Candidates extends Component {

    constructor(props) {
        super(props)
        this.state = {
            candidate: []      
        }
    }

    async componentDidMount() {
        try {
            const candidate = this.getVotedFor();
            this.setState({
                candidate
            })
        } catch(error) {
            console.log(error)
        }
    }

    getVotedFor = () => {
        console.log(this.props.Candidates)
        let array = this.props.Candidates.filter(prop => {
            return prop.id.includes(this.props.candidateId)
        })
        console.log(array[0])
        return array[0]
    }

    render() {
        return(
            <div>
                <h1 style={{textAlign: 'center', marginBottom: '5%'}} >You voted for:</h1>  
                    <Row style={{display: 'block', margin: 'auto', width: 'fit-content'}} key={this.state.candidate.id} >
                        <Col sm="20">
                            <Card body>
                                <CardTitle style={{textAlign: 'center'}} >{this.state.candidate.name}</CardTitle>
                                
                                <CardText>{this.state.candidate.party}</CardText>
                                
                                <CardText>{this.state.candidate.voteCount}</CardText>
                            </Card>
                        </Col>
                    </Row>
            </div>
        )
    }
}