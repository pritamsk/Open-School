import axios from 'axios';
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { send_request } from '../../redux/Session/sessionAction';

class ReqIndiSession extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            subject_id: '',
            topic: '',
            date_slot: '',
            language_id: '',
            time_slot_start: '',
            time_slot_end: '',
            time_slot: '',
            lang: '',
            subjects: [],
            languages: []
        }
    }
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    handle = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handle1 = e => {
        this.setState({
            [e.target.name]: e.target[e.target.selectedIndex].value
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        var req_date = new Date(this.state.date_slot + " " + this.state.time_slot_start)
        var end_date = new Date(this.state.date_slot + " " + this.state.time_slot_end)
        var now = new Date()
        var slot_diff = end_date - req_date;
        var diff = req_date - now;
        if(this.state.subject_id == '' || this.state.topic == '' || this.state.date_slot == '' || this.state.time_slot_end == '' || this.state.time_slot_start == '' || this.state.language_id == '') {
            alert("Please enter all the fields")
        }
        else if(new Date() > req_date) {
            alert("You cannot enter past date and time")
        }
        else if(this.state.time_slot_start > this.state.time_slot_end) {
            alert("Start time cannot be more than end time")
        }
        else if(diff < 3600000) {
            alert("The start time should be atleast 1 hour from current time.")
        }
        else if(slot_diff < 3600000) {
        alert("The timeslot should be atleast 1 hour apart")
        }
        else {
            var body = {
                sender_id: this.props.user_id,
                subject_id: this.state.subject_id,
                topic: this.state.topic,
                time_slot: String(this.state.time_slot_start) +
                " - " +
                String(this.state.time_slot_end),
                req_date: this.state.date_slot,
                language_id: this.state.language_id,
                approved: 0,
                mentor_specific: this.props.t_id
            }
            this.props.send_request(body)
    
            this.setState({
                modal: false,
                subject_id: '',
                topic: '',
                time_slot: '',
                req_date: '',
                language_id: '',
                subjects: [],
                languages: [],
                time_slot_end: "",
                time_slot_start: "",
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.modal != this.state.modal && this.state.modal) {
            axios.get("http://localhost:5000/users/languages", {
                params: {
                    id: this.props.t_id
                }
            })
            .then(response => {
                this.setState({
                    languages: response.data
                })
                axios.get("http://localhost:5000/users/teacher_subjects", {
                    params: {
                        id: this.props.t_id
                    }
                })
                .then(response => {
                    this.setState({
                        subjects: response.data
                    })
                })
                .catch(err => {
                    console.log(err)
                })

            })
            .catch(err => {
                console.log(err)
            })

        }
    }

    render() {


        var all_subjects = this.state.subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_id} id={subject.subject_id}>{subject.subject_name}</option>
        ))

        var all_languages = this.state.languages.map((language) => (
            <option key={language.language_id} value={language.language_id} id={language.language_id}>{language.language_name}</option>
        ))

        return(
            <React.Fragment>

                <div>
                    <Button color="success" onClick={this.toggle}>Request session from {this.props.first_name} {this.props.last_name}</Button>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader>Session Request</ModalHeader>
                    <ModalBody>
                        <Form id="request-form">
                            <FormGroup row>
                                <Label for="subject_id" sm={10}>Subject</Label>
                                <Col sm={12}>
                                    <Input type="select" name="subject_id" id="subject" onChange={this.handle1}>
                                        <option value="" disabled selected>Select a broad subject category (Ex. Maths)</option>
                                        {
                                            all_subjects
                                        }
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="topic" sm={10}>Topic</Label>
                                <Col sm={12}>
                                    <Input type="text" name="topic" id="topic" placeholder="Enter a more specific description (Ex. Prime numbers)" value={this.state.topic} onChange={this.handle}></Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="date_slot" sm={10}>What date do you prefer?</Label>
                                <Col sm={12}>
                                    <Input type="date" name="date_slot" id="date_slot" value={this.state.date_slot} onChange={this.handle}></Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Label for="time_slot_start" sm={5}>
                                From :
                              </Label>
                              <Col sm={12}>
                                <Input
                                  type="time"
                                  name="time_slot_start"
                                  id="time_slot_start"
                                  value={this.state.time_slot_start}
                                  onChange={this.handle}
                                  placeholder="Format: hh:mm"
                                ></Input>
                              </Col>
                              <Label for="time_slot_end" sm={5}>
                                To :
                              </Label>
                              <Col sm={12}>
                                <Input
                                  type="time"
                                  name="time_slot_end"
                                  id="time_slot_end"
                                  value={this.state.time_slot_end}
                                  onChange={this.handle}
                                  placeholder="Format: hh:mm"
                                ></Input>
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="lang" sm={10}>What language are you comfortable with?</Label>
                                <Col sm={12}>
                                    <Input type="select" name="language_id" id="lang" onChange={this.handle1}>
                                        <option value="" disabled selected>Select the language</option>
                                        {
                                            all_languages
                                        }
                                    </Input>
                                </Col>
                            </FormGroup>
                            <Button
                              className="row-btns"
                              color="success"
                              onClick={this.handleSubmit}
                            >
                              Send
                            </Button>
                            <Button
                              className="row-btns"
                              color="danger"
                              onClick={this.toggle}
                            >
                              Cancel
                            </Button>
                        </Form>
                    </ModalBody>



                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        user_id: state.users.user_id,
        all_subjects: state.users.all_subjects,
        all_languages: state.users.all_languages,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        send_request: (body) => dispatch(send_request(body))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReqIndiSession);
