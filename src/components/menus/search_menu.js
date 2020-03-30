import React, { Component } from 'react';
import { connect } from 'react-redux';

import { selectGame, selectChannel, getTopGames, isLoading, searchStreams, clearSearch, setMature } from "../../actions/index";

class SearchMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            term: '',
            hideInput: false,
            currentStream: 0,
            left: 30
        };

        this.renderSearch.bind(this);
        this.handleSearchKeys = this.handleSearchKeys.bind(this);
        this.handleSearchScroll = this.handleSearchScroll.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);

        document.addEventListener('keydown', this.handleSearchKeys);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleSearchKeys);
        document.removeEventListener('mousewheel', this.handleSearchScroll);
        this.props.clearSearch();
    }



    handleSearchSubmit(e) {
        e.preventDefault();
        if (this.state.term.substr().length >= 3) {
            this.setState({hideInput: true, currentStream: 0, left: 30});
            this.props.isLoading(true);
            this.props.searchStreams(this.props.server, this.state.term);
            this.textInput.blur();

            document.addEventListener('mousewheel', this.handleSearchScroll);
        }
    }

    handleSearchKeys(e) {
        this.setState({term: e.target.value});
        if(this.props.isMature) {
            return this.props.handleMature(e);
        }
        if(this.props.userOffline) {
            return false;
        }
        if ((e.keyCode === 8 || e.keyCode === 461) && !this.state.hideInput && this.state.term.length === 0) {
            this.props.closeSearchMenu();
        } else if(e.keyCode === 40 && !this.props.search) {
            this.props.closeSearchMenu();
        }
        if(this.props.search) {
            switch(e.keyCode) {
                case 39:
                    return this.state.currentStream < this.props.search.length-1 && this.state.hideInput ? this.onNavigateRight() : null;
                case 37:
                    return this.state.currentStream > 0 && this.state.hideInput ? this.onNavigateLeft() : null;
                case 38:
                   return this.state.hideInput ? this.handleUp() : null;
                case 40:
                    return this.handleDown();
                case 13:
                    return this.state.hideInput ? this.handleEnter() : null;
                case 8:
                case 461:
                case 10009:
                    return this.handleUp();
            }
        }
    }

    handleSearchScroll(e) {
        if(this.props.search && this.props.search.length > 0) {
            if (e.wheelDelta === 120) {
                this.state.currentStream > 0 && this.state.hideInput ? this.onNavigateLeft() : null;
            } else if (e.wheelDelta === -120) {
                this.state.currentStream < this.props.search.length-1 && this.state.hideInput ? this.onNavigateRight() : null;
            }
        } else {
            return false;
        }
    }

    handleUp() {
        this.setState({term: '', hideInput: false});
        this.textInput.focus();
    }
    handleDown() {
        if(!this.state.hideInput) {
            this.setState({hideInput: true});
            this.textInput.blur();
        } else {
            this.props.closeSearchMenu();
        }
    }
    handleEnter() {
        this.openSearchItem();
    }
    onNavigateRight() {
        this.setState({
            currentStream: this.state.currentStream + 1,
            left: this.state.left - 318
        });
    }
    onNavigateLeft() {
        this.setState({
            currentStream: this.state.currentStream - 1,
            left: this.state.left + 318
        });
    }

    handleSearchClick(index) {
        if(this.state.currentStream === index) {
           this.openSearchItem();
        } else if(this.state.currentStream < index) {
            this.setState({
                currentStream: index,
                left: -318*index + 30
            });
        }
    }

    openSearchItem() {
        if(this.props.matureGames.some(game => game.name === this.props.search[this.state.currentStream].game)) {
            this.props.setMature({...this.props.search[this.state.currentStream].channel, ...{type: 'search'}});
        } else if(this.props.search[this.state.currentStream].channel.mature) {
            this.props.setMature({...this.props.search[this.state.currentStream].channel, ...{type: 'search'}});
        } else {
            this.props.selectChannel(this.props.server, {...this.props.search[this.state.currentStream].channel, ...{preview: this.props.search[this.state.currentStream].preview.medium}});
            this.props.closeSearchMenu(true);
        }
    }



    renderSearch() {
        return (
            <div className="search-box" onClick={() => this.handleUp()}>
                <form autoComplete="off" onSubmit={this.handleSearchSubmit.bind(this)}>
                    <input autoFocus ref={(input) => { this.textInput = input }} placeholder="Search..." name="search" value={this.state.term} onChange={this.handleSearchKeys}/>
                </form>
            </div>
        );
    }
    renderResults() {
        if (this.props.search.length === 0) {
            return (<div className="no-results-container">
                <div>¯\_(ツ)_/¯</div>
                <span id="no-results-text">No results found...</span>
            </div>);
        } else {
            return(
                this.props.search.map((stream, index) =>
                    <div onClick={() => this.state.hideInput ? this.handleSearchClick(index) : this.handleDown()} className={'search-thumbnail ' + (this.state.currentStream === index ? 'active' : '')} key={index} style={{'backgroundImage': `url(${stream.preview.medium})`, 'left': `${index * 325 + 5}px`}}>
                        <div className="display-name"> {stream.channel.display_name}</div>
                    </div>
                )
            );
        }
    }
    render() {
        return (
            <div className="search-container">
                <div style={this.state.hideInput ? {opacity: '0.4'} : null} >
                    {this.renderSearch()}
                </div>
                <div style={!this.state.hideInput ? {opacity: '0.4'} : null}>
                    <div className="search-results" style={{'left': `${this.state.left}px`}}>
                        {this.props.search ? this.renderResults() : null}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ stream, loading, server, topGames, activeGame, search, userOffline, isMature, matureGames }) {
    return { stream, loading, server, topGames, activeGame, search, userOffline, isMature, matureGames };
}

export default connect(mapStateToProps, {selectGame, selectChannel, getTopGames, isLoading, searchStreams, clearSearch, setMature})(SearchMenu);