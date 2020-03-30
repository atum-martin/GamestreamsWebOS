import { CURRENT_LIST } from "../actions/index";

export default function (state = null, action) {
    switch(action.type) {
        case 'CURRENT_LIST':
            return action.payload;
        default:
            return state;
    }
}