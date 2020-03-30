export default function(state = null, action) {
    switch(action.type) {
        case 'FETCH_SEARCH_STREAMS':
            return action.payload;
        case 'CLEAR_SEARCH_STREAMS':
            return null;
        default:
            return state;
    }
}
