export default function (state = false, action) {
    switch(action.type) {
        case 'SHOW_TOAST':
            return action.payload;
        default:
            return state;
    }
}