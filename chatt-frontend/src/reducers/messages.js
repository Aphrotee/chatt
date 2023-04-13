const userMessages = (state = [], action) => {
    switch (action.type) {
        case "USER_MESSAGES":
            return action.payload;

        default:
            return state
    }
}

export { userMessages }