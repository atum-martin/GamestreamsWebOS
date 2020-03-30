import React, { Component } from 'react';
import { connect } from 'react-redux';

import {selectGame, selectChannel, getGameStreams, isLoading, getTopStreams, setMature, showHelper, showbookmarks} from "../../actions/index";


class ChannelsMenu extends Component {
    constructor(props) {
        super(props);

        this.state = { currentChannel: 0,currentBookmarkChannel:0, bottom: 0,bookmarkBottom: 0, channelsFetched: false };

        this.channelKeys = this.handleChannelKeys.bind(this);
        this.handleBookmarkKeys = this.handleBookmarkKeys.bind(this);
        this.resetBookmarkIndex = this.resetBookmarkIndex.bind(this);
        this.channelMouse = this.handleChannelMouse.bind(this);

        document.addEventListener('keydown', this.channelKeys);
        document.addEventListener('mousewheel', this.channelMouse);
    }

    componentWillMount() {
        this.props.showHelper(false);
        this.props.isLoading(true);
        this.props.activeGame ?
            this.props.getGameStreams(this.props.server, this.props.activeGame, () => {
                if(this.props.activeChannel) {
                    this.activeIndex = this.findIndexOfObject(this.props.topStreams, this.props.activeChannel.name);
                    if(this.activeIndex !== -1) {
                        this.setState({
                            currentChannel: this.activeIndex,
                            bottom: this.state.bottom + this.activeIndex * -125,
                            channelsFetched: true
                        });
                    } else {

                        this.setState({channelsFetched: true});
                    }
                } else {
                    this.setState({channelsFetched: true});
                }
                this.props.isLoading(false);
            }) :
            this.props.getTopStreams(this.props.server, () => {
                if(this.props.activeChannel) {
                    this.activeIndex = this.findIndexOfObject(this.props.topStreams, this.props.activeChannel.name);
                    if(this.activeIndex !== -1) {
                        this.setState({
                            currentChannel: this.activeIndex,
                            bottom: this.state.bottom + this.activeIndex * -125,
                            channelsFetched: true
                        });
                    } else {

                        this.setState({channelsFetched: true});
                    }
                } else {
                    this.setState({channelsFetched: true});
                }
                this.props.isLoading(false);
            });

    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.channelKeys);
        document.removeEventListener('mousewheel', this.channelMouse);
        this.props.showbookmarks(false, this.props.previousList, this.resetBookmarkIndex);
        this.props.showHelper(true);

        setTimeout(() => {
            this.props.showHelper(false);
        }, 4000)
    }

    findIndexOfObject(object, userName) {
        for(let i = 0; i < object.length; i++) {
            if(object[i].channel.name === userName) {
                return i;
            }
        }
        return -1;
    }

    

    handleChannelMouse(e) {
        e.preventDefault();
        if (e.wheelDelta === 120) {
            this.state.currentChannel !== this.props.topStreams.length-1 ? this.onNavigationUp() : null;
        } else if (e.wheelDelta === -120) {
            this.state.currentChannel !== 0 ? this.onNavigationDown() : null;
        }
    }
    resetBookmarkIndex() {
        this.setState({
            currentBookmarkChannel: 0,
            bookmarkBottom: 0,
        });
        
    }
    onBookmarkNavUp() {
        this.setState({
            currentBookmarkChannel: this.state.currentBookmarkChannel + 1,
            bookmarkBottom: this.state.bookmarkBottom - 125
        });
    }
    onBookmarkNavDown() {
        this.setState({
            currentBookmarkChannel: this.state.currentBookmarkChannel - 1,
            bookmarkBottom: this.state.bookmarkBottom + 125
        });
    }
    onNavigationUp() {
        
        this.setState({
            currentChannel: this.state.currentChannel + 1,
            bottom: this.state.bottom - 125
        });
    }
    onNavigationDown() {
        this.setState({
            currentChannel: this.state.currentChannel - 1,
            bottom: this.state.bottom + 125
        });
    }
    handleBookmarkKeys(e) {
        // this function uses different state of currentChannel and has a different values from props.
        const list = "bookmarks";
        if(this.props.isMature) {
            return this.props.handleMature(e, 'channel');
        } if (this.props.isMature) {
            return false;
        } else if (e.keyCode === 40) {
            this.state.currentBookmarkChannel !== 0 ? this.onBookmarkNavDown() : null;
        } else if (e.keyCode === 38) {
            if(this.props.bookmarks.length === 0) {
                return;
            } else {
                this.state.currentBookmarkChannel !== this.props.bookmarks.length-1 ? this.onBookmarkNavUp() : null;
            }
        } else if (e.keyCode === 37) {
            this.props.showbookmarks(false, this.props.previousList, this.resetBookmarkIndex);
        } else if (e.keyCode === 13) {
            this.onSelectChannel(list);
        }


    }
    handleChannelKeys(e) {
        if (this.props.showBookmarks === true) {
            return this.handleBookmarkKeys(e);
        }
        e.preventDefault();
        const list = "channels";
        if(this.props.isMature) {
            return this.props.handleMature(e, 'channel');
        } else if(this.props.isMature) {
            return false;
        } else if (e.keyCode === 40) {
            this.state.currentChannel !== 0 ? this.onNavigationDown() : null;
        } else if (e.keyCode === 38) {
            if (this.props.topStreams.length === 0) { 
                return;
            } 
            else {
                this.state.currentChannel !== this.props.topStreams.length-1 ? this.onNavigationUp() : null;
            } 
            
        } else if(e.keyCode === 37) {
            return this.props.showbookmarks(true, this.props.currentList);
        } else if (e.keyCode === 13) {
            this.onSelectChannel(list);
        }
    }

    handleChannelClick(index) {
        if(this.state.currentChannel === index) {
            this.onSelectChannel();
        } else if(this.state.currentChannel < index) {
            this.setState({bottom: index * -125, currentChannel: index});
        }
    }

    onSelectChannel(list) {
     if(list === "bookmarks") {
         console.log('Bookmarks');
        if(this.props.bookmarks[this.state.currentBookmarkChannel].mature) {
            this.props.setMature(this.props.bookmarks[this.state.currentBookmarkChannel]);
        } else {
            this.props.selectChannel(this.props.server, {...this.props.bookmarks[this.state.currentBookmarkChannel]});
        }
     } else {
        if(this.props.topStreams[this.state.currentChannel].channel.mature) {
            let chn = this.props.topStreams[this.state.currentChannel].channel;
            chn.preview = this.props.topStreams[this.state.currentChannel].preview.medium;

            this.props.setMature(chn);
        } else {
            this.props.selectChannel(this.props.server, {...this.props.topStreams[this.state.currentChannel].channel, ...{preview: this.props.topStreams[this.state.currentChannel].preview.medium}});
        }
     }      
    }
    renderBookmarks() {
        const channelsRenderer = this.props.bookmarks.map((stream, index) => {
            return (
                <div key={stream._id} onClick={() => this.handleChannelClick(index)} className={'channel-menu-item ' + (this.state.currentBookmarkChannel === index ? 'active' : '')} style={{'backgroundImage': `linear-gradient(rgb(0, 0, 0), rgba(0, 0, 0, 0)), url(${stream.preview})`, 'bottom': `${index * 125}px`}}>
                    <div className="channel-title">{ stream.display_name }</div>
                </div>
            );
        });
        if (channelsRenderer.length === 0) {
            return (
            <div key="0" onClick={() => {}} className={'channel-menu-item active'} style={{'backgroundImage': `linear-gradient(rgb(0, 0, 0), rgba(0, 0, 0, 0))`, 'bottom': `${0 * 125}px`}}>
            <p className="no-streams-placeholder">No Streamers Added</p>
             </div>)
        }
        return channelsRenderer.slice(this.state.currentBookmarkChannel === 0 ? 0 : this.state.currentBookmarkChannel - 1, this.state.currentBookmarkChannel + 10);
    }

    renderChannel() {
        const channelsRenderer = this.props.topStreams.map((stream, index) => {
            return (
                <div key={stream._id} onClick={() => this.handleChannelClick(index)} className={'channel-menu-item ' + (this.state.currentChannel === index ? 'active' : '')} style={{'backgroundImage': `linear-gradient(rgb(0, 0, 0), rgba(0, 0, 0, 0)), url(${stream.preview.medium})`, 'bottom': `${index * 125}px`}}>
                    <div className="channel-title">{ stream.channel.display_name }</div>

                </div>
            );
        });
        if (channelsRenderer.length === 0) {
            return (
            <div key="0" onClick={() => {}} className={'channel-menu-item active'} style={{'backgroundImage': `linear-gradient(rgb(0, 0, 0), rgba(0, 0, 0, 0))`, 'bottom': `${0 * 125}px`}}>
            <p className="no-streams-placeholder">No Streamers Online</p>
             </div>)
        }
        return channelsRenderer.slice(this.state.currentChannel === 0 ? 0 : this.state.currentChannel - 1, this.state.currentChannel + 10);
    }
    render() {
        if(this.props.showBookmarks === true) {

            return (
                <div style={{'bottom': `${this.state.bookmarkBottom}px`}} className="channel-menu-list">
                <div>{this.renderBookmarks()}</div>
                <div className="channel-type-switch">
                <img className="list-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMYSURBVGhD7Zg9aBRBGIZPE7CIBuMPikpQ1C6KUcsjNhYWsVCDoLGxUxBthBAQLFTwBwQt0qUJRBHLExRsrKJFUAhYBEWJsTCIWClqzJ3PzL4Gzni52dnZ21XugZe92fm+d95Njr3ZLTRpkjMqlcr6crnczbETtej0vwHBl6FB9Jrw8zD+iG6h1SrNL4Tcgl4o+19hfgL1oxMMO9WaHwi2Ar2K4rpB/SwalEU+INBN5YsNvUdkky1kWU6Yz1EsL8ZllS1cxEkF8gaP7bLLDkIMK483ePTLLjsI8Vx5vMHjouyygxDTyuMNHkOyyw5CTCmPN39eCOML6HFAdcm6NhRNKo83eNyQnYXxQ02Foijr2rDoiIq9weOc7CyMxzQVCqcLOa1ib/DolZ2F8TNNhcLpQkoq9gaPa7KzMG7jdEdAtcq6Niw6QWEi8MjFXeuR8niDx4DssoMQZ5THGzx2yy47yJFo00jvA1llD2GOoZ/K5gw902iTbCyMdzC1P7BWyr4+BLhDQyzoOa52C+N29EnTIal/+/0NAfrU5AT1X1Cb2i2MhzQdGvcLobiVIG+ivvpQe1mtFsY9mkoD9wsxEOagGheFug+oXW0Wxr1MXU1Jm7WMOwQapXFRqDmr8vxCyCvKWxNqtqo8n5DRvF2cieLWhppLHJaqLR8QyPwg2u83x3cmqAvUvkej6BTaILvGQo4lLH4A3Udfo2j+4DHH4QnHoxzr71RDwGKH0EubIAXwfosWvLRjqoXz9ziOe2iXbKzRGowSP3u4orWqthac24u+RxWxiH5HaN6GEr9kiAtrTqK1NoRgfF3TcSia/0QHzbFeUIeEtc3z+/wdjvE6NBvNOlP0/QsEhQzJ30Ri4rx/SgsyjCiOP5iU5ZcZREj+8CWvTPmfLqSkOP5g4rztSAPW/4b6FMcfY4J+yLdhsOYcKqFwb1gw24nuorj371gYfzSGBlB6W33MV6HD6DYyr+unUOy7mukB85T4FA2j86gHVT3DNxRymc2c+bXt4vMeIz7v41j1SoZzZp/UjTYybswOt0mTJo4UCr8A73luvTvhUIMAAAAASUVORK5CYII="/>
                    
                </div>
            </div>
            )
        } else {
            return (
                <div style={{'bottom': `${this.state.bottom}px`}} className="channel-menu-list">
                    {this.state.channelsFetched && this.renderChannel()}
                <div className="channel-type-switch">
                
                <img className="fav-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPWSURBVGhD7ZlLSBVRHMbVHkYPLUF6grXIkrIH0QtqWaCCFYRQmdBCCXrjpjZBUbQKqU1F4CIKKogocNVKCCMpgoqygkKKIFxYucgX2u/c+RKsmTNn7sy9trg/+Dgz93zf/3+Ge+/M3Ll5OXLkmFhGR0fnoKna/f8ZGRmZixpQK+pEPziAMdgfRF3oHmpGqxWdeFhfPguqQm1o2FuyO2ReoRNohkpmH9axBT1LrSgmHEgPOsrmZJXPPDSbTtOraCS1igSh5HOG5WqVOWhUhl56bTMD9fvQLrVMHopXoC/ql1HoM4wa1To5KLoIfVafrEA/wz4tIT7UNN+JjH6cgqDvANqgpcSDQldUd0Kg/ydUpOWkBwW2osTPTlFhCS1aUnTI56NErhNx4UCGULmWFg2C1apjBV8vuoVOo3PoEQq8yjP3Dl1i8yTjZfTBm7GDr1VLiwbBNtUIBM81htmKjMFra5h7mjIJ9s3V+wCb+bKlMPu8vh/1pYwBMN+PShRzg9w8QkNeCX+YvyC7L1gK8LTI+wLN15QvzG9GA8ZvoUl2NyjYoKAvzL9hcLovwnsYb7F2reA9n2oQAPMPZXWDQKuyvjB/TNZEoe5CFHiWZKqXoUD2cAh0elF/mN8ka+JQ23oHwXyZrOFgHvej6G+YXytr4lC7S218YX6brHbwmuuHFYpVy54olDYniJ9eF3+Y3yO7HbzFXiQYilnPWOlC6XVeBytuZy4WWahAIHi6Gdy/dI5Q96LXIRg89bKHg3lQuUDwuL3FjlCvlLLfverB4KtVJBzMb5ULBE83mqVIbKhl7hJCwVepSDiY7ytnBd8dRWJBnd0qaQWfuduYplg4BJq9aDh4DymWFuTLKRP6kTLg7VDMDQKrlA0Fr/kVt0PRSJBbgJzufg14zyjqDqHXyoeC1xxMlaJO4C9F5p7NGfwVirtD6LjyTuD/heoUt4JvCYp6EI8VjwbZmYR7vDJu4DecUglfmDe3698UcYZMjUpEh7B5jJkOd8n+88CA1w6ifnmcIdPOMO4HWSQIT6KIeYwZGXLv0UZTh7EE3dZUJMiZ79/K1ILiQJFlyPozNAhy5onhdfRVL0WG7BEtJT4UqzWLUu2sQc+bDOl/pPygYBOFs/aMi1bm4Udm/umi+F4U9oAgNvS4wTBFbTMDTdajj17LZKGueeRjzpTJfpyCoFkRakHWR0ZRoFY7WqEW2YXGS5H58zPyteEPZDtQDZvZeRdssBBznWhED1iQ9U4Wj3mO+wSdZTfzf7OlC4srQItZ6HZUx7Y529Uz7mSsRIWy5siRI0dU8vJ+A3A/aKegmwEDAAAAAElFTkSuQmCC"/>
                </div>

                </div>
            )
        }
        
    }
}

function mapStateToProps({ server, topStreams, activeChannel, activeGame, userOffline, isMature, showBookmarks, bookmarks, currentList, previousList }) {
    return { server, topStreams, activeChannel, activeGame, userOffline, isMature, showBookmarks, bookmarks, currentList, previousList };
}

export default connect(mapStateToProps, {selectGame, selectChannel, getGameStreams, isLoading, getTopStreams, setMature, showHelper, showbookmarks, })(ChannelsMenu);