export function activeGameReducer(state = null, action) {
    switch(action.type) {
        case 'SELECT_GAME':
            return action.payload;
        default:
            return state;
    }
}

export function activeChannelReducer(state = null, action) {
    switch(action.type) {
        case 'SELECT_CHANNEL':
            return action.payload;
        default:
            return state;
    }
}

export function activeStreamReducer(state = null, action) {
    switch(action.type) {
        case 'SELECT_STREAM':
            return action.payload;
        default:
            return state;
    }
}
export function previousListReducer(state = null, action) {
    switch(action.type) {
        case 'PREVIOUS_LIST':
            return action.payload;
        default:
            return state;
    }
}