import axios from '../axios'
import cookies from '../cookies'

const cookie = cookies.get('X-Token')

const Display = () => {
    return {
        type: 'DISPLAY'
    }
}

const profileDisplay = () => {
    return {
        type: 'PROFILE-DISPLAY'
    }
}

const getUser = () => async dispatch => {

    const response = await axios.get("/users/me", {
        headers: {
            'X-Token': cookie
        }
    })

    dispatch({
        type: 'CURRENT_USER',
        payload: response.data
    })

}

export { Display, profileDisplay, getUser };