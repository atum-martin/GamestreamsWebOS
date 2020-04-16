import React, { Component } from 'react';
import { connect } from 'react-redux';

import { selectGame, selectChannel, getTopGames, isLoading, setMature, getTopStreams, showHelper, showbookmarks } from "../../actions/index";

class GamesMenu extends Component {
    constructor(props) {
        super(props);

        this.state = { currentGame: 0, left: 100, gamesFetched: false };

        this.renderGame.bind(this);
        this.coverflowKeys = this.handleGamesKeys.bind(this);
        this.cursorEvents = this.handleMouseEvents.bind(this);

        document.addEventListener('keydown', this.coverflowKeys);
        document.addEventListener('mousewheel', this.cursorEvents);
    }

    componentWillMount() {
        this.props.showHelper(false);
        this.props.showbookmarks(false);
        this.props.isLoading(true);
        this.props.getTopGames(this.props.server, () => {
            this.props.stream ? this.props.isLoading(false) : null;
            if(this.props.activeGame) {
                this.props.topGames.forEach((game, index) => game.game.name === this.props.activeGame ? this.activeIndex = index : null);
                this.setState({
                    currentGame: this.activeIndex,
                    left: this.state.left + this.activeIndex * -225,
                    gamesFetched: true
                });
            } else {
                this.setState({gamesFetched:true})
            }

        });
    }


    componentWillUnmount() {
        document.removeEventListener('keydown', this.coverflowKeys);
        document.removeEventListener('mousewheel', this.cursorEvents);
    }

    onNavigationRight() {
        this.setState({
            currentGame: this.state.currentGame + 1,
            left: this.state.left - 225
        });
    }


    onNavigationLeft() {
        this.setState({
            currentGame: this.state.currentGame - 1,
            left: this.state.left + 225
        });
    }

    handleGamesKeys(e) {
        e.preventDefault();

        if (this.props.userOffline) {
            return false;
        } else if(this.props.isMature) {
            return this.props.handleMature(e);
        } else if (e.keyCode === 37) {
            this.state.currentGame !== 0 ? this.onNavigationLeft() : null;
        } else if (e.keyCode === 39) {
            this.state.currentGame !== this.props.topGames.length-1 ? this.onNavigationRight() : null;
        } else if (e.keyCode === 13) {
            this.selectGameItem()
        }
    }

    handleMouseEvents(e) {
        if (e.wheelDelta === 120) {
            this.state.currentGame !== 0 ? this.onNavigationLeft() : null;
        } else if (e.wheelDelta === -120) {
            this.state.currentGame !== this.props.topGames.length-1 ? this.onNavigationRight() : null;
        }
    }

    selectGameItem() {
        if(this.props.matureGames.some(game => game.name === this.props.topGames[this.state.currentGame].game.name) && !this.props.isMature) {
            this.props.setMature({
                display_name: this.props.topGames[this.state.currentGame].game.name,
                name: this.props.topGames[this.state.currentGame].game.name,
                type: 'game'
            });
        } else {
            if (this.props.topGames[this.state.currentGame].game.name === 'Top 100') {
                this.props.getTopStreams(this.props.server, () => {});
                this.props.openChannelsMenu()
            } else {
                this.props.selectGame(this.props.server,
                    this.props.topGames[this.state.currentGame].game.name,
                    () => this.props.openChannelsMenu());
            } 
        }
    }

    handleGameClick(index) {
        if(this.state.currentGame !== index) {
            if(this.state.currentGame < index) {
                this.setState({
                    currentGame: index,
                    left: 100 + (index * -225)
                });
            }
        } else if(this.state.currentGame === index) {
            this.selectGameItem();
        }
    }


    renderGame() {
        const gamesRenderer = this.props.topGames.map((game, index) => {
            if (game.game.name === 'Top 100') {
                return (<div id="game-top" key={game.id} onClick={() => this.handleGameClick(index)} className={'game-menu-item ' + (this.state.currentGame === index ? 'active': '')} style={{'backgroundImage': `url("style/top.png")`}}>
                    <div className="game-title">{game.game.name}</div>
                </div>)
            }
            return (
                <div key={game.game._id} onClick={() => this.handleGameClick(index)} className={'game-menu-item ' + (this.state.currentGame === index ? 'active' : '')} style={{'backgroundImage': `url(${game.game.box.medium})`, 'left': `${index * 225 + 5}px`}}>
                    <div className="game-title">{ game.game.name }</div>
                </div>
            );
        });

        return gamesRenderer.slice(this.state.currentGame === 0 ? 0 : this.state.currentGame - 1, this.state.currentGame + 9);
    }
    render() {
        return (
            <div>
                <div style={{'left': `${this.state.left}px`}} className="game-menu-list">
                    {this.state.gamesFetched && this.renderGame()}
                </div>
            </div>
        );
    }
}

function mapStateToProps({ stream, loading, server, topGames, activeGame, matureGames, userOffline, isMature }) {
    return { stream, loading, server, topGames, activeGame, matureGames, userOffline, isMature };
}

export default connect(mapStateToProps, {selectGame, selectChannel, getTopGames, isLoading, setMature, getTopStreams, showHelper, showbookmarks})(GamesMenu);