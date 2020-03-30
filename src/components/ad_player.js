import React, { Component } from 'react';
import { connect } from 'react-redux';
import  Hls  from 'hls.js';

import { ShowAd } from '../actions/index';

// http://localhost:3022/public/videos/index.m3u8
class AD extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if (this.props.ShowAd === true) {
            this.initPlayer('http://10.220.40.39:3022/public/videos/index.m3u8');
        }
        
    }
    componentWillReceiveProps(nextProps) {
        this.props.ShowAd !== nextProps.ShowAd && this.props.ShowAd === true ? this.initPlayer('http://10.220.40.39:3022/public/videos/index.m3u8') : console.log('ada');
    }
    initPlayer(url) {
        let myHls = new Hls();
        const { ads } = this.refs;
        myHls.loadSource(url);
        myHls.attachMedia(ads);

    }
    stopAD() {
        this.myHls.stopLoad();
    }

    render() {
        const style = {
            width: '100%',
            height: '290px',
            marginLeft: '35%',
            position: 'absolute',
            zIndex: 1
        };
        const text = {
            color: 'white',
            size: '30px'
        }
        return (<video ref="ads" style={style} loop autoPlay muted></video>);
    }
}
function mapStateToProps({ showAD }) {
    return { showAD };
}

export default connect(mapStateToProps, { ShowAd })(AD);