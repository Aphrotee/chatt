// Get the current user

const getUser = (state = [], action) => {
    switch (action.type) {
        case "CURRENT_USER":
            return action.payload;

        default:
            return state
    }
}

export { getUser }