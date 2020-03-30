import { combineReducers } from 'redux';

import ServerReducer from './reducer_server';

import LoaderReducer from './reducer_loader';
import GamesReducer from './reducer_games';

import MatureReducer from './reducer_mature';
import { channelMature } from './reducer_mature';

import StreamsReducer from './reducer_streams';
import activeListReducer from './reducer_active_list';
import StreamReducer from './reducer_stream_selected';
import SearchReducer from './reducer_search';

import { bookmarkReducer, showBookmarksReducer } from './reducer_bookmark';
import helperShowerReducer from './reducer_helper';
import { activeGameReducer, activeChannelReducer, activeStreamReducer, previousListReducer } from './reducer_active';
import { userOfflineReducer, serviceUnavailableReducer } from './reducer_error';
import bookMarkToast from './reducer_bookmarkToast';

const rootReducer = combineReducers({
    showToastObj: bookMarkToast,
    loading: LoaderReducer,
    userOffline: userOfflineReducer,
    serviceUnavailable: serviceUnavailableReducer,
    server: ServerReducer,
    topGames: GamesReducer,
    matureGames: MatureReducer,
    isMature: channelMature,
    topStreams: StreamsReducer,
    bookmarks: bookmarkReducer,
    showBookmarks: showBookmarksReducer,
    currentList: activeListReducer,
    previousList: previousListReducer,
    stream: StreamReducer,
    search: SearchReducer,
    activeGame: activeGameReducer,
    activeChannel: activeChannelReducer,
    activeStream: activeStreamReducer,
    showHelper: helperShowerReducer
});

export default rootReducer;