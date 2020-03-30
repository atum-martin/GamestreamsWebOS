import React, { Component } from 'react';
import { connect } from 'react-redux';


import { selectStream, isLoading, showHelper } from "../../actions/index";


class QualityMenu extends Component {
    constructor(props) {
        super(props);

        this.state = { active: null };
    }

    componentDidMount() {

        this.qualityChangeKeys = this.qualityChangeKeyHandler.bind(this);
        document.addEventListener('keydown', this.qualityChangeKeys);
    }
    componentWillMount(){
        this.props.showHelper(false);
        this.index = -1;
        this.props.stream.forEach((stream, index) => {
            return stream.quality === this.props.activeStream ? this.index = index : null;
        });

        if(this.index !== -1) {
            this.setState({ active : this.index });
        }
        else if(this.index === -1 && this.props.stream[1].resolution) {
            this.index = 1;
            this.props.selectStream(this.props.stream[1].quality);
            this.setState({ active : this.index });
        } else if(this.index === -1 && !this.props.stream[1].resolution){
            this.index = 0;
            this.props.selectStream(this.props.stream[0].quality);
            this.setState({ active : this.index });
        }
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.qualityChangeKeys);

        const storage = localStorage.getItem('gameStreams');
        let gameStreams = JSON.parse(storage);
        gameStreams[0].settings.defaultQuality = this.props.activeStream;
        let newStorage = JSON.stringify(gameStreams);
        localStorage.setItem('gameStreams', newStorage);
    }



    qualityChangeKeyHandler(e) {
        e.preventDefault();
        if (e.keyCode === 8 || e.keyCode === 461 || e.keyCode === 13) {
            this.props.closeQualityMenu();
        }
        if (e.keyCode === 39) {
            this.props.selectStream(this.props.stream[this.state.active+1].quality, () => this.props.isLoading(false));
            this.setState({active: this.state.active+1});
        } else if (e.keyCode === 37) {
            this.props.selectStream(this.props.stream[this.state.active-1].quality, () => this.props.isLoading(false));
            this.setState({active: this.state.active-1});
        }
    }


    render() {
        return (
            <div className="quality-menu-container">
                {this.props.stream.map((q, i) =>
                    <div key={i} className={ i === this.state.active ? 'quality-menu-item active' : 'quality-menu-item' }>{ q.quality }</div>)}
            </div>
        );
    }

}

function mapStateToProps({ stream, activeStream }) {
    return { stream, activeStream };
}

export default connect(mapStateToProps, { selectStream, isLoading, showHelper })(QualityMenu);
