import axios from "axios"
import { LOGOUT } from "../Users/userTypes"
import { ADD_PENDING_SESSION, DEL_PENDING_SESSION, SET_MEETING_URL, SET_PAST_SESSIONS, SET_PENDING_REQUESTS, SET_UPCOMING_SESSIONS } from "./sessionTypes"


export const fetch_home = (id, is_teacher, dispatch) => {
    return (dispatch) => {
        var body = {
            is_teacher,
            id
        }
        axios.post("http://localhost:5000/session/move_to_past", body)
        .then((res) => {
            console.log(res.data)
            if(is_teacher) {
                axios.get("http://localhost:5000/session/pending_requests_teacher", {
                    params : {
                        user_id: id
                    }
                })
                .then((response) => {
                    var now = new Date()
                    var res = response.data.filter(pen => new Date(pen.req_date) >= now)
                    dispatch(set_pending(res))
                })
                .catch((err) => {
                    alert("Cannot fetch the sessions. Please refresh the page")
                })
                axios.get("http://localhost:5000/session/upcoming_sessions_teachers", {
                    params : {
                        user_id: id,
                    }
                })
                .then((response) => {
                    dispatch(set_upcoming(response.data))
                })
                .catch((err) => {
                    alert("Cannot fetch the sessions. Please refresh the page")
                })
                axios.get("http://localhost:5000/session/past_sessions_teachers", {
                    params : {
                        user_id: id,
                    }
                })
                .then((response) => {
                    dispatch(set_past(response.data))
                })
                .catch((err) => {
                    alert("Cannot fetch the sessions. Please refresh the page")
                })
            } 
            else {
                axios.get("http://localhost:5000/session/pending_requests", {
                    params : {
                        user_id: id
                    }
                })
                .then((response) => {
                    var now = new Date()
                    var res = response.data.filter(pen => new Date(pen.req_date) >= now)
                    dispatch(set_pending(res))
                })
                .catch((err) => {
                    alert("Cannot fetch the sessions. Please refresh the page")
                })
                axios.get("http://localhost:5000/session/upcoming_sessions_students", {
                    params : {
                        user_id: id,
                    }
                })
                .then((response) => {
                    dispatch(set_upcoming(response.data))
                })
                .catch((err) => {
                    alert("Cannot fetch the sessions. Please refresh the page")
                })
                axios.get("http://localhost:5000/session/past_sessions_students", {
                    params : {
                        user_id: id,
                    }
                })
                .then((response) => {
                    dispatch(set_past(response.data))
                })
                .catch((err) => {
                    alert("Cannot fetch the sessions. Please refresh the page")
                })
            } 
        })
        .catch(err => {
            alert("Cannot fetch the sessions. Please refresh the page")
        })
    }
}

export const send_request = (data, dispatch) => {
    return(dispatch) => {
        var body = data
        body.entry = []
        axios.post("http://localhost:5000/session/request", body)
        .then((response) => {
            console.log(response.data)
            dispatch(add_pending(body))
            alert("Request sent successfully")
        })
        .catch(err => {
            console.log("ithe")
            console.log(err)
        })
    }
}

export const set_meeting_url = (value) => {
    return {
        type: SET_MEETING_URL,
        payload: value
    }
}

export const set_upcoming = (value) => {
    return {
        type: SET_UPCOMING_SESSIONS,
        payload: value
    }
}

export const set_pending = (value) => {
    return {
        type: SET_PENDING_REQUESTS,
        payload: value
    }
}

export const add_pending = (value) => {
    return {
        type:ADD_PENDING_SESSION,
        payload: value
    }
}

export const set_past = (value) => {
    return {
        type: SET_PAST_SESSIONS,
        payload: value
    }
}

export const del_pend = (value) => {
    return {
        type: DEL_PENDING_SESSION,
        payload: value
    }
}

export const sess_logout = (value) => {
    return {
        type: LOGOUT
    }
}
