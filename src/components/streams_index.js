import React, { Component } from 'react';
import { connect } from 'react-redux';

import {getHLSStream, getServerUrl, isLoading, selectStream, getBookmarks} from "../actions/index";

import HlsPlayer from './hls_player';
import Spinner from './spinner';
import MenusIndex from './menus_index';
import Modal from './modal';
import WebToast from './toast';

class ServerIndex extends Component {

    componentWillMount() {
        // localStorage.
        if (!localStorage.gameStreams) {
            const gameStreams = [];
            const TV = {
                settings: {defaultQuality: '720p60'},
                bookmarks: []
            };
            gameStreams.push(TV);
            const gameStreamsString = JSON.stringify(gameStreams);

            localStorage.setItem('gameStreams', gameStreamsString);
            this.props.selectStream(TV.settings.defaultQuality);
            this.props.getBookmarks(gameStreams);
        } else {
            let storage = localStorage.getItem('gameStreams');
            let gameStreams = JSON.parse(storage);
            const { settings } = gameStreams[0];

            this.props.getBookmarks(gameStreams);
            this.props.selectStream(settings.defaultQuality);
        }
        this.props.isLoading(true);
        this.props.getServerUrl(true);
    }


    render() {
        return(
            <div>
                <div>
                    {this.props.server && <WebToast/>}
                </div>

                <div>
                    {this.props.loading && <Spinner/>}
                </div>
                <div>
                    {this.props.stream && <HlsPlayer/>}
                </div>
                <div>
                    {this.props.server && <MenusIndex/>}
                </div>
                <div>
                    {this.props.userOffline && <Modal><div className="offline-modal">User has gone offline</div></Modal>}
                </div>
                <div>
                    {this.props.serviceUnavailable && <Modal><div className="offline-modal">Service unavailable, try again later</div></Modal>}
                </div>
            </div>
        )
    }
}

function mapStateToProps({loading, server, topStreams, stream, userOffline, activeChannel, activeStream, serviceUnavailable, bookmarks, showToast}) {
    return { loading, server, topStreams, stream, userOffline, activeChannel, activeStream, serviceUnavailable, bookmarks, showToast };
}

export default connect(mapStateToProps, { getServerUrl, isLoading, getHLSStream, selectStream, getBookmarks})(ServerIndex);