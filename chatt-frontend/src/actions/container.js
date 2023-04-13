import axios from '../axios'
import cookies from '../cookies'

const cookie = cookies.get('X-Token')

const userContainer = () => async dispatch => {

    const response = await axios.get("/containers/all", {
        headers: {
            'X-Token': cookie
        }
    })

    dispatch({
        type: 'USER_CONTAINER',
        payload: response.data
    })

}

export { userContainer }