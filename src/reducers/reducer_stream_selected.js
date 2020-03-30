import { FETCH_SERVER } from "../actions/index";

export default function (state = null, action) {
    switch(action.type) {
        case 'FETCH_HLS_STREAM':
            return action.payload;
        default:
            return state;
    }
}