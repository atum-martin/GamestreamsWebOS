export function userOfflineReducer(state = null, action) {
    switch(action.type) {
        case 'ERROR_OFFLINE':
            return action.payload;
        default:
            return state;
    }
}
export function serviceUnavailableReducer(state = null, action) {
    switch(action.type) {
        case 'ERROR_SERVICE':
            return action.payload;
        default:
            return state;
    }
}
