import React, { Component } from 'react';
import { connect } from 'react-redux';

import SearchMenu from './menus/search_menu';
import GamesMenu from './menus/games_menu';
import ChannelsMenu from './menus/channels_menu';
import BookmarksMenu from './menus/bookmarks_menu';
import QualityMenu from './menus/quality_menu';

import { selectGame, selectChannel, setUserOffline, setMature, getBookmarks, showbookmarks, showToast } from "../actions/index";

import Modal from "./modal";




class MenusIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isGamesMounted: true,
            isChannelsMounted: false,
            isSearchMounted: false,
            isQualityMounted: false,
            isBookmarksMounted: false,
            confirmMature: true
        };

        this.handleMenuTimeout = this.handleMenuTimeout.bind(this);
        this.handleMenuKeys = this.handleMenuKeys.bind(this);
        this.toggleActiveButton = this.toggleActiveButton.bind(this);
        this.handleMatureKeys = this.handleMatureKeys.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openSearch = this.openSearch.bind(this);

        document.addEventListener('keydown', this.handleMenuKeys);
        document.addEventListener('keyup', this.handleMenuTimeout);
    }


    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleMenuKeys);
        document.removeEventListener('keyup', this.handleMenuTimeout);
    }

    areMenusHidden() {
        return !(this.state.isGamesMounted || this.state.isSearchMounted || this.state.isBookmarksMounted || this.state.isChannelsMounted || this.state.isQualityMounted || this.props.isMature || this.props.userOffline);
    }

    hideMenus() {
        this.setState({
            isChannelsMounted: false,
            isGamesMounted: false
        });
    }

    openChannelsMenu() {
        this.setState({
            isChannelsMounted: true,
            isSearchMounted: false,
            isGamesMounted: false
        });
    }

    openGamesMenu() {
        this.setState = {
            isGamesMounted: true,
            isChannelsMounted: false
        };
    }

    openSearch() {
        this.setState({
            isGamesMounted: false,
            isSearchMounted: true
        });
        document.removeEventListener('keydown', this.handleMenuKeys);
        document.removeEventListener('keyup', this.handleMenuTimeout);
    }

    closeSearchMenu(closeAll) {
        if(closeAll) {
            this.setState({
                isSearchMounted: false,
                isGamesMounted: false
            });
        } else {
            this.setState({
                isSearchMounted: false,
                isGamesMounted: true
            });
        }

        document.addEventListener('keydown', this.handleMenuKeys);
        document.addEventListener('keyup', this.handleMenuTimeout);
    }
    closeQualityMenu() {
        this.setState({
            isQualityMounted: false
        });
    }
    closeBookmarksMenu(closeAll) {
        if(closeAll) {
            this.setState({
                isBookmarksMounted: false,
                isGamesMounted: false
            });
        } else {
            this.setState({
                isBookmarksMounted: false,
                isGamesMounted: true
            });
        }
    }

    toggleActiveButton(boolean) {
        this.setState({confirmMature: boolean});
    }

    findIndexOfObject(object, userName) {
        for(let i = 0; i < object.length; i++) {
            if(object[i].name === userName) {
                return i;
            }
        }
        return -1;
    }

    addBookmark() {
        const storage = localStorage.getItem('gameStreams');
        const gameStreams = JSON.parse(storage);
    

        const bookmarks = gameStreams[0].bookmarks;
        if(this.props.activeChannel) {
            let index = this.findIndexOfObject(bookmarks, this.props.activeChannel.name);
            if(index === -1) {
                bookmarks.unshift(this.props.activeChannel);
            } else {
                bookmarks.splice(index, 1);
            }   
            if(this.props.showToastObj.display) {
                this.props.showToast({index: 0, name: '', display: false});
            }
                this.props.showToast({index:index, name: this.props.activeChannel.display_name, display: true});
          //  WebOSToast(index, this.props.activeChannel.display_name);
        } else {
            let index = this.findIndexOfObject(bookmarks, this.props.topStreams[0].channel.name);
            if(index === -1) {
                bookmarks.unshift({...this.props.topStreams[0].channel, ...{preview: this.props.topStreams[0].preview.medium}});
            } else {
                bookmarks.splice(index, 1);
            }
            if(this.props.showToastObj.display) {
                this.props.showToast({index: 0, name: '', display: false});
            }
            this.props.showToast({index:index, name:this.props.topStreams[0].channel.display_name, display: true});
          //  WebOSToast(index, this.props.topStreams[0].channel.display_name);
        }

        let newBookmark = JSON.stringify(gameStreams);
        localStorage.setItem('gameStreams', newBookmark);
        
        this.props.getBookmarks(JSON.parse(newBookmark));
    }

    handleMenuTimeout() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            !this.props.isMature ? this.hideMenus() : clearTimeout(this.timeout);
        }, 15000);
    }

    handleMatureKeys(e) {
        if (e.keyCode === 13 && !this.state.confirmMature) {
            this.props.setMature(null);
            this.setState({confirmMature: true});
        } else if (e.keyCode === 13 && this.state.confirmMature) {
            if(this.props.isMature.type === 'game') {
                this.props.selectGame(this.props.server, this.props.isMature.name,
                    () => {
                        this.openChannelsMenu();
                        this.props.setMature(null);
                    })
            } else if(this.props.isMature.type === 'search') {
                this.closeSearchMenu(true);
                this.props.selectChannel(this.props.server, this.props.isMature, () => this.props.setMature(null), true);
            } else {
                this.props.selectChannel(this.props.server, this.props.isMature, () => this.props.setMature(null), true);
            }
        } else if(e.keyCode === 37) {
            this.toggleActiveButton(true);
            this.toggleActiveButton(true);
        } else if(e.keyCode === 39) {
            this.toggleActiveButton(false);
            this.toggleActiveButton(false);
        }
    }

    handleSubmit(bool) {
        if (!bool) {
            return this.props.setMature(null);
        } else if (bool) {
            if(this.props.isMature.type === 'game') {
                this.props.selectGame(this.props.server, this.props.isMature.name,
                    () => {
                        this.openChannelsMenu();
                        this.props.setMature(null);
                    })
            } else if(this.props.isMature.type === 'search') {
                this.closeSearchMenu(true);
                this.props.selectChannel(this.props.server, this.props.isMature, () => this.props.setMature(null), true);
            } else {
                this.props.selectChannel(this.props.server, this.props.isMature, () => this.props.setMature(null), true);
            }
        }
    }

    handleMenuKeys(e) {
        clearTimeout(this.timeout);
        e.preventDefault();

        if (this.props.userOffline) {
            return this.props.setUserOffline(null);
        }
        if (this.props.isMature) {
            return false;
        }
        if (this.props.isMature && this.props.userOffline) {
            return this.props.setMature(null);
        }
        if (this.state.isQualityMounted || this.state.isSearchMounted || this.props.isMature || this.state.isBookmarksMounted) {
            return false;
        }
        if (e.keyCode === 8 || e.keyCode === 461 || e.keyCode === 48 || e.keyCode === 458) {
            if(this.props.showBookmarks) {
                return this.props.showbookmarks(false, this.props.previousList)
            }

            if(this.areMenusHidden()) {
                webOS.platformBack();
            } else {
                this.hideMenus();
            }
        } else if (e.keyCode === 37 && !this.state.isGamesMounted) {
            this.setState({
                isChannelsMounted: true
            });
        } else if (e.keyCode === 13 && !this.state.isChannelsMounted) {
            this.setState({
                isGamesMounted: true
            });
        } else if (e.keyCode === 38 && this.state.isGamesMounted) {
            this.openSearch();
        } else if (e.keyCode === 40 && this.state.isGamesMounted) {
            this.setState({
                isGamesMounted: false,
                isBookmarksMounted: true
            });
        } else if (e.keyCode === 40 && this.areMenusHidden()) {
            this.setState({
                isQualityMounted: true
            });
        } else if(e.keyCode === 38 && this.areMenusHidden()) {
            this.addBookmark();

        }
    }

    renderMatureModal() {
            return (
                <Modal>
                    <div className="mature-modal">
                        <div className="mature-modal-contents">
                            <div>{this.props.isMature.display_name} is rated mature</div>
                            <div>Proceed?</div>
                            <div className="mature-modal-controls">
                                <span onClick={() => this.handleSubmit(true)} className={this.state.confirmMature ? 'active' : ''}>OK</span>
                                <span onClick={() => this.handleSubmit(false)} className={!this.state.confirmMature ? 'active' : ''}>RETURN</span>
                            </div>
                        </div>
                    </div>
                </Modal>
            );
    }

    render() {
        return (
            <div id="menus-container" onClick={() => this.areMenusHidden() ? this.setState({isGamesMounted: true}) : null}>
                <div className="search-menu">
                    {this.state.isSearchMounted && <SearchMenu handleMature={this.handleMatureKeys.bind(this)} closeSearchMenu={this.closeSearchMenu.bind(this)}/>}
                </div>
                <div className="game-menu">
                    {this.state.isGamesMounted && (
                        <div>
                            <div className="open-search" onClick={() => this.openSearch()}>
                                <svg>
                                    <path d="M6 54 L32 38 L58 54 L58 48 L32 32 L6 48 Z"></path>
                                </svg>
                                Search</div>
                            <GamesMenu handleMature={this.handleMatureKeys.bind(this)} hideMenus={this.hideMenus.bind(this)} openChannelsMenu={this.openChannelsMenu.bind(this)}/>
                            <div className="open-bookmarks" onClick={() => this.setState({isBookmarksMounted:true, isGamesMounted: false})}>
                                Bookmarks
                                <svg>
                                    <path d="M6 16 L32 32 L58 16 L58 10 L32 26 L6 10 Z"></path>
                                </svg>
                            </div>
                        </div>)
                    }
                </div>
                <div className="channel-menu">
                    {this.state.isChannelsMounted && <ChannelsMenu handleMature={this.handleMatureKeys.bind(this)}/>}
                    {this.state.isChannelsMounted && <div className="list-name-container">
                        <div className="list-name">{this.props.currentList}</div>
                    </div>}
                </div>
                <div>
                    {this.state.isBookmarksMounted && <BookmarksMenu closeBookmarksMenu={this.closeBookmarksMenu.bind(this)}/>}
                </div>
                <div className="qualities-menu">
                    {this.state.isQualityMounted && <QualityMenu closeQualityMenu={this.closeQualityMenu.bind(this)}/>}
                </div>
                <div>
                    {this.props.isMature && !this.props.userOffline ? this.renderMatureModal() : null}
                </div>
            </div>
        );
    }
}

function mapStateToProps({server, topStreams, activeChannel, userOffline, isMature, currentList, previousList, showBookmarks, showToastObj}) {
    return { server, topStreams, activeChannel, userOffline, isMature, currentList, previousList, showBookmarks, showToastObj };
}

export default connect(mapStateToProps, {selectGame, selectChannel, setUserOffline, setMature, getBookmarks, showbookmarks, showToast})(MenusIndex);