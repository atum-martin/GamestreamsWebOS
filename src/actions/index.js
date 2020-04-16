import axios from 'axios';

const LOADING = 'LOADING';
const FETCH_SERVER = 'FETCH_SERVER';
const FETCH_TOP_STREAMS = 'FETCH_TOP_STREAMS';
const FETCH_TOP_GAMES = 'FETCH_TOP_GAMES';
const FETCH_MATURE_GAMES = 'FETCH_MATURE_GAMES';
const FETCH_HLS_STREAM = 'FETCH_HLS_STREAM';
const FETCH_SEARCH_STREAMS = 'FETCH_SEARCH_STREAMS';
const CLEAR_SEARCH_STREAMS = 'CLEAR_SEARCH_STREAMS';
const SELECT_GAME = 'SELECT_GAME';
const SELECT_CHANNEL = 'SELECT_CHANNEL';
const SELECT_STREAM = 'SELECT_STREAM';

const GET_BOOKMARKS = 'GET_BOOKMARKS';
const SHOW_BOOKMARKS = 'SHOW_BOOKMARKS';
const CURRENT_LIST = 'CURRENT_LIST';
const PREVIOUS_LIST = 'PREVIOUS_LIST';
const SHOW_HELPER = 'SHOW_HELPER';
const SHOW_TOAST = 'SHOW_TOAST';

const ERROR_OFFLINE = 'ERROR_OFFLINE';
const ERROR_SERVICE = 'ERROR_SERVICE';


const servers = [
    //'http://localhost:3022'
    'http://192.168.0.99:820',
    'http://atummartin-ttv.herokuapp.com'
];
export function showToast(bookmarkAction) {
    return dispatch => {
        dispatch({
            type: SHOW_HELPER,
            payload: false,
        });


        dispatch({
            type: SHOW_TOAST,
            payload: bookmarkAction
        });
        
    }
}


export function getServerUrl(callback) {
    let promises = [];

    servers.forEach(server => promises.push(axios.get(server)));

    const reverse = value => {
        return new Promise((resolve, reject) => {
            return Promise.resolve(value).then(reject, resolve)
        })
    };

    const any = iterable => {
        return reverse(Promise.all([...iterable].map(reverse)))
    };

    return (dispatch) => {
        any(promises).then(server => {
            dispatch({
                type: FETCH_SERVER,
                payload: server.config.url
            });
            return server.config.url;
        }).then(server => {
            dispatch(getTopStreams(server, callback));
            dispatch(getMatureGames(server));
        });
    };
}

export function getTopGames(server, callback) {
    return dispatch => {
        axios.get(`${server}/games/top`).then(games => {
            console.log("games: %j", JSON.stringify(games));
            console.log("games.data: %j", JSON.stringify(games.data));
            console.log("games.data.top: %j", JSON.stringify(games.data.top));
            const payload = games.data.top.filter(game => game.game.name !== 'Games + Demos');
            payload.unshift({id: 1, game: {name: 'Top 100', "box": {"medium": "style/top.png"}}});
            dispatch({
                type: FETCH_TOP_GAMES,
                payload: payload
            });

            return callback ? callback() : null;
        });
    };
}
export function getMatureGames(server) {
    return dispatch => {
        axios.get(`${server}/mature-content`).then(games => {
            dispatch({
                type: FETCH_MATURE_GAMES,
                payload: games.data.mature_games
            });
        });
    };
}
export function getTopStreams(server, callback) {
    return dispatch => {
        axios.get(`${server}/initial/streams`).then(streams => {
            dispatch({
                type: FETCH_TOP_STREAMS,
                payload: streams.data.streams
            });

            dispatch({
                type: CURRENT_LIST,
                payload: 'Top 100'
            });

            dispatch({
                type: SELECT_GAME,
                payload: null
            });

            if(callback === true) {
                dispatch(getHLSStream(server, streams.data.streams[0].channel.name));
            } else {
                return callback();
            }
        }).catch(() => {
            dispatch(setServiceError());
        });
    };
}
export function getGameStreams(server, game, callback) {
    return dispatch => {
        axios.get(`${server}/streamers/${game}`).then(streams => {
            dispatch({
                type: FETCH_TOP_STREAMS,
                payload: streams.data.streams
            });
            dispatch({
                type: CURRENT_LIST,
                payload: game
            });

            return callback ? callback() : null;
        });
    };
}
export function searchStreams(server, query) {
    return dispatch => {
        axios.get(`${server}/search-streams/${query}`).then(streams => {
            dispatch({
                type: FETCH_SEARCH_STREAMS,
                payload: streams.data.streams
            });

            dispatch(isLoading(false));
        });
    };
}

export function clearSearch() {
    return {
        type: CLEAR_SEARCH_STREAMS
    }
}

export function getHLSStream(server, user, callback) {

    return dispatch => {
        axios.get(`${server}/stream/${user}`).then(game => {

            dispatch({
                type: FETCH_HLS_STREAM,
                payload: game.data
            });

            dispatch(isLoading(false));

            return callback ? callback() : null;

        }).catch((resp) => {
            console.log(resp)
            dispatch(setUserOffline(user));
        });
    };
}

export function selectGame(server, game, callback) {
    return dispatch => {

        dispatch(isLoading(true));

        dispatch ({
            type: SELECT_GAME,
            payload: game
        });

        dispatch(getGameStreams(server, game, callback));
    }
}

export function selectChannel(server, channel, callback, mature) {
    return dispatch => {

        dispatch(isLoading(true));

        dispatch ({
            type: SELECT_CHANNEL,
            payload: channel
        });

        if(mature) {
            dispatch(setMature(null));
        }

        return dispatch(getHLSStream(server, channel.name, callback));
    }
}
export function selectStream(index, callback) {
    return dispatch => {

        dispatch(isLoading(true));

        dispatch ({
            type: SELECT_STREAM,
            payload: index
        });

        return callback ? callback() : null;
    }
}

export function isLoading(boolean) {
    return {
        type: LOADING,
        payload: boolean
    }
}

export function setUserOffline(user) {
    return dispatch => {
        dispatch(isLoading(false));
        dispatch ({
            type: ERROR_OFFLINE,
            payload: user ? user : null
        });
    }
}
export function setServiceError() {
    return dispatch => {
        dispatch(isLoading(false));
        dispatch ({
            type: ERROR_SERVICE,
            payload: true
        });
    }
}

export function setMature(channel) {
    return {
        type: 'IS_MATURE',
        payload: channel
    }
}

export function showHelper(boolean) {
    return {
        type: SHOW_HELPER,
        payload: boolean,
    }
}
export function getBookmarks(storage) {
    return {
        type: 'GET_BOOKMARKS',
        payload: storage[0].bookmarks
    }
}
export function showbookmarks(boolean, previous = null, callback = null) {
    return  dispatch => {
        dispatch(setPreviousList(previous));
        dispatch({
            type: 'SHOW_BOOKMARKS',
            payload: boolean
        });
        if (!boolean) {
            typeof callback === 'function' ? callback() : null;
            dispatch({
                type: CURRENT_LIST,
                payload: previous,
            })
        } else {
            dispatch({
                type: CURRENT_LIST,
                payload: 'Bookmarks'
            });
        }
    }
}
export function setPreviousList(list = null) {
    return {
        type: 'PREVIOUS_LIST',
        payload: list
    }
}


