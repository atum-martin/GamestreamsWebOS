export function bookmarkReducer(state = null, action) {
    switch(action.type) {
        case 'GET_BOOKMARKS':
            return action.payload;
        default:
            return state;
    }
}
export function showBookmarksReducer(state = null, action) {
    switch(action.type) {
        case 'SHOW_BOOKMARKS':
            return action.payload;
        default:
            return state;
    }
}