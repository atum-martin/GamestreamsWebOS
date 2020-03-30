import React, { Component } from 'react';
import { connect } from 'react-redux';

import { selectGame, selectChannel, getTopGames, isLoading, searchStreams, clearSearch, getBookmarks, showToast } from "../../actions/index";

class BookmarksMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentStream: 0,
            currentDelete: false,
            left: 30,
            bookmarks: null,
            term: '',
            hideInput: true
        };

        this.handleBookmarkKeys = this.handleBookmarkKeys.bind(this);
        this.bookMarkSearch = this.bookMarkSearch.bind(this);
        this.handleBookmarkScroll = this.handleBookmarkScroll.bind(this);

        document.addEventListener('keydown', this.handleBookmarkKeys);
        document.addEventListener('mousewheel', this.handleBookmarkScroll);
    }

    componentWillMount() {
        const storage = localStorage.getItem('gameStreams');
        const gameStreams = JSON.parse(storage);
        const bookmarks = gameStreams[0].bookmarks;
        bookmarks.length > 0 ? this.setState({ bookmarks }) : null;
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleBookmarkKeys);
        document.removeEventListener('mousewheel', this.handleBookmarkScroll);
    }

    handleBookmarkScroll(e) {
        if (e.wheelDelta === 120) {
            this.state.currentStream > 0 ? this.onNavigateLeft() : null;
        } else if (e.wheelDelta === -120) {
            this.state.currentStream < this.state.bookmarks.length-1 ? this.onNavigateRight() : null;
        }
    }

    handleBookmarkKeys(e) {
        if(this.props.userOffline) {
            return false;
        } else if (e.keyCode === 8 || e.keyCode === 461) {
            this.props.closeBookmarksMenu();
        } else if(this.state.bookmarks.length > 0) {
            switch(e.keyCode) {
                case 39:
                    return this.state.currentStream < this.state.bookmarks.length-1 ? this.onNavigateRight() : null;
                case 37:
                    return this.state.currentStream > 0 ? this.onNavigateLeft() : null;
                case 13:
                    return this.handleEnter();
                case 40:
                    return this.handleDown();
                case 38:
                    return this.handleUp();
                case 8:
                case 461:
                case 10009:
                    return this.props.closeBookmarksMenu();
            }
        }
    }

    onNavigateLeft() {
        this.setState({
            currentStream: this.state.currentStream - 1,
            left: this.state.left + 318,
            currentDelete: false
        });
    }
    onNavigateRight() {
        this.setState({
            currentStream: this.state.currentStream + 1,
            left: this.state.left - 318,
            currentDelete: false
        });
    }

    handleEnter() {
        if(this.state.currentDelete === false){
            this.props.isLoading(true);
            this.props.selectChannel(this.props.server, this.state.bookmarks[this.state.currentStream]);
            this.props.closeBookmarksMenu(true);
        } else {
            this.handleBookmarkDelete(this.state.currentDelete);
        }
    }

    handleDown() {
        this.setState({currentDelete: this.state.currentStream});
    }
    handleUp() {
        if(this.state.currentDelete !== false) {
            this.setState({currentDelete: false});
        } else {
            this.setState({term: '', hideInput: false});
            this.textInput.focus();
            // this.props.closeBookmarksMenu();
        }
    }

    handleBookmarkClick(index) {
        if(this.state.currentStream === index) {
            this.props.isLoading(true);
            this.props.selectChannel(this.props.server, this.state.bookmarks[index]);
            this.props.closeBookmarksMenu(true);
        } else if(this.state.currentStream < index) {
            this.setState({
                currentDelete: false,
                currentStream: index,
                left: -318*index + 30
            });
        }
    }

    handleBookmarkRemoveClick(index) {
        this.handleBookmarkDelete(index);
    }

    handleBookmarkDelete(index) {
        const storage = localStorage.getItem('gameStreams');
        const gameStreams = JSON.parse(storage);

        const bookmarks = gameStreams[0].bookmarks;
        bookmarks.splice(index, 1);

        let newBookmark = JSON.stringify(gameStreams);
        localStorage.setItem('gameStreams', newBookmark);

        this.props.getBookmarks(JSON.parse(newBookmark));

        this.props.showToast({index: '', name: '', display: false});
        this.props.showToast({index: 0, name: this.state.bookmarks[index].display_name, display: true});

        this.setState({bookmarks: this.state.bookmarks.filter((bookmark, i) => index !== i)});
        this.setState({currentDelete: false});

        if(this.state.currentStream > 0) {
            this.setState({
                currentStream: this.state.currentStream-1,
                left: -318*(this.state.currentStream-1) + 30
            });
        }
    }
    bookMarkSearch(e) {
       console.log('asdada');
       if(e.keyCode === 40) {
        this.setState({hideInput: true});
        this.textInput.blur();
    }
    }
    /**filteredBookmarks.filter(function(item){
            const title = item.name;
            console.log(title);
            return title.toLowerCase().search(
                console.log(event.target.value)
                //event.target.value.toLowerCase()
            
            ) !== -1;
          });
          console.log(filteredBookmarks);
         // this.setState({bookmarks: filteredBookmarks});

            */
    renderNoResults() {
        return (
            <div className="no-results-container">
                <div>¯\_(ツ)_/¯</div>
                <span id="no-results-text">No bookmarks added...</span>
                <span id="add-bookmark">To add a channel to bookmarks, select the stream and click arrow up on your remote</span>
            </div>
        );
    }

    renderBookmarks() {
        if (this.state.bookmarks && this.state.bookmarks.length > 0) {
            return(
                this.state.bookmarks.map((stream, index) =>
                    <div key={index}>
                        <div onClick={() => this.handleBookmarkClick(index)} className={'search-thumbnail ' + (this.state.currentStream === index && this.state.currentDelete === false ? 'active' : '')} style={{'backgroundImage': `url(${stream.preview})`, 'left': `${index * 325 + 5}px`}}>
                        <div className="display-name"> {stream.display_name}</div>
                        </div>
                        <div>
                            {this.state.currentStream === index ? (<div onMouseEnter={() => this.setState({currentDelete: index})} onMouseLeave={() => this.setState({currentDelete: false})} onClick={() => this.handleBookmarkRemoveClick(index)} className={'bookmark-remove ' + (this.state.currentDelete === index ? 'active' : '')}>remove</div>) : null}
                        </div>
                    </div>
                )
            );
        } else {
           return this.renderNoResults();
        }
    }
    render() {
        return (
            <div className="bookmarks-menu">
            <h1 className="bookmarks-title">BOOKMARKS</h1>
                <div className="search-results" style={{'left': `${this.state.left}px`}}>
                    {this.renderBookmarks()}
                </div>
            </div>
        );
    }
}

function mapStateToProps({ stream, loading, server, topGames, activeGame, search, userOffline, bookmarks }) {
    return { stream, loading, server, topGames, activeGame, search, userOffline, bookmarks };
}
/**<div className="search-box" onClick={() => this.handleUp()}>
                <form autoComplete="off" onSubmit={ () => console.log('sda')}>
                    <input autoFocus ref={(input) => { this.textInput = input }} placeholder="Search..." name="search" value={this.state.term} onChange={this.handleBookmarkKeys}/>
                </form>
            </div> */
export default connect(mapStateToProps, {selectGame, selectChannel, getTopGames, isLoading, searchStreams, clearSearch, getBookmarks, showToast})(BookmarksMenu);