export default function (state = null, action) {
    switch(action.type) {
        case 'FETCH_TOP_STREAMS':
            return action.payload;
        default:
            return state;
    }
}