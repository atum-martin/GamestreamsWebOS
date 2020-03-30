import _ from 'lodash';
import { FETCH_SERVER } from "../actions/index";

export default function (state = null, action) {
    switch(action.type) {
        case 'FETCH_SERVER':
            return action.payload;
        default:
            return state;
    }
}