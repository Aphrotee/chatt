import { setDisplay, profileDisplay } from "./display";
import { getUser } from './user'
import { userMessages } from "./messages";
import { userContainer } from "./container";
import { combineReducers } from 'redux';

export const allReducers = combineReducers({
    setDisplay,
    profileDisplay,
    getUser,
    userContainer,
    userMessages
})