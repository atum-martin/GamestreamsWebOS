export function ShowAd(state = null, action) {
    switch(action.type) {
        case 'SHOW_AD':
            return action.payload;
        default:
            return state;
    }
}