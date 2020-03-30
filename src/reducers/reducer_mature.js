export default function (state = null, action) {
    switch(action.type) {
        case 'FETCH_MATURE_GAMES':
            return action.payload;
        default:
            return state;
    }
}

export function channelMature(state = null, action) {
    switch(action.type) {
        case 'IS_MATURE':
            return action.payload;
        default:
            return state;
    }
}

export function matureControls(state = null, action) {
    switch(action.type) {
        case 'CONTINUE_MATURE':
            return true;
        case 'CANCEL_MATURE':
            return false;
        default:
            return state;
    }
}