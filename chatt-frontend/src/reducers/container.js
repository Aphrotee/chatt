const userContainer = (state = [], action) => {
    switch (action.type) {
        case "USER_CONTAINER":
            return action.payload;

        default:
            return state
    }
}

export { userContainer }