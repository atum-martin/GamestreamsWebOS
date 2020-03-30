import React, { Component } from 'react';
import { connect } from 'react-redux';
import Hls from 'hls.js';


import { selectStream, setUserOffline } from "../actions/index";


class HLSPlayer extends Component {
    constructor(props) {
        super(props);


        this.index = -1;
        this.getQualityIndex = this.getQualityIndex.bind(this);
    }

    componentDidMount() {
        this.getQualityIndex(this.props.stream, this.props.activeStream);
    }

    componentWillReceiveProps(nextProps) {
        nextProps.activeStream !== this.props.activeStream || this.props.stream !== nextProps.stream ? this.getQualityIndex(nextProps.stream, nextProps.activeStream) : null;
    }

    getQualityIndex(streams, activeStream) {
        console.log("hls streams: %j", JSON.stringify(streams));
        console.log("activeStream: %j", JSON.stringify(activeStream));
        streams.forEach((stream, index) => {
            return stream.quality === activeStream ? this.index = index : null;
        });

        if(this.index !== -1) {
            this.initPlayer(streams[this.index].url);
        }
        else if(this.index === -1 && streams[1].resolution) {
            this.index = 1;
            this.props.selectStream(streams[1].quality);
            this.initPlayer(streams[this.index].url);
        } else if(this.index === -1 && !streams[1].resolution){
            this.index = 0;

            this.props.selectStream(streams[0].quality);
            this.initPlayer(streams[this.index].url);
        }

    }
    renderQualityHelper() {
        if (this.props.showHelper) {
            return (<div className="quality-helper">
            <svg>
               <path d="M6 16 L32 32 L58 16 L58 10 L32 26 L6 10 Z"></path>
            </svg>
            <p>Select Quality</p>
            </div>);
        } else {
            return null;
        }
    }
    renderBookMarkAdd() {
        if (this.props.showHelper) {
            return (<div className="bookmark-helper">
                        <svg>
                            <path d="M6 54 L32 38 L58 54 L58 48 L32 32 L6 48 Z"></path>
                        </svg>
                        <p>Bookmark Stream</p>
                    </div>

            )
        }
    }


    initPlayer(url) {
        if (this.hls) {
            this.hls.stopLoad();
            this.hls.destroy();
        }
        this.hls = new Hls();
        const { video } = this.refs;
        console.log("hls url: %j", url);
        console.log("hls video: %j", video);
        this.hls.loadSource(url);
        this.hls.attachMedia(video);

        this.hls.on(Hls.Events.MANIFEST_PARSED,function() {
            video.play();
        });
        this.hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
            switch (!data.details.live) {
                case false:
                    clearTimeout(this.timeout);
                    break;
                case true:
                    if(this.hls) {
                        this.timeout = setTimeout(() => {
                            this.props.setUserOffline(true);
                            this.hls.stopLoad();
                            this.hls.destroy();
                        }, 3000);
                    }
                    break;
                default:
                    clearTimeout(this.timeout);
                    break;
            }
        });
    }

    render() {
        return <div>{this.renderBookMarkAdd()}<video width='100%' height='100%' ref="video"/>{this.renderQualityHelper()}</div>;
    }
}

function mapStateToProps({ stream, activeStream, showHelper }) {
    return { stream, activeStream, showHelper };
}

export default connect(mapStateToProps, { selectStream, setUserOffline })(HLSPlayer);