// Defines redux reducers

const setDisplay = (state = true, action) => {
    switch(action.type) {
        case "DISPLAY":
            return !state

        default:
            return state
    }
}

const profileDisplay = (state = true, action) => {
    switch(action.type) {
        case "PROFILE-DISPLAY":
            return !state
        default:
            return state
    }
}

export { setDisplay, profileDisplay };
