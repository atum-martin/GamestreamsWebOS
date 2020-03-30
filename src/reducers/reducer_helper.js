
export default function (state = null, action) {
    switch(action.type) {
        case 'SHOW_HELPER':
            return action.payload;
        default:
            return state;
    }
}