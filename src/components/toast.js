import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showToast } from "../actions/index";
/*const WebOSToast = (index = null, user = null) => {
        const message = index !== -1 ? 'removed from bookmarks!' : 'added to bookmarks!';
        
        
            return (<div className="notification-toast">
                <div className="checkmark"></div>
                <div className="message-container">
                    <span className="message">{`${user} ${message}`}</span>
                    </div>
            </div>)
         
        
        //showToast({id: 1, message: `${user} ${message}`}); 
  
};*/
class WebToast extends Component {
    constructor(props) {
        super(props)
    
        this.timeout;
    }

    componentDidUpdate() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout( () => {
            this.props.showToast({index: '', name: '', display: false});
        }, 2500)
    }
    renderSucces() {
        return (
            <div className="checkmark"></div>
        )
    }
    renderToast() {
        if(this.props.showToastObj.display) {
            const message = this.props.showToastObj.index !== -1 ? 'removed from bookmarks!' : 'added to bookmarks!';
        
            return (
                <div className="notification-toast">
                {this.renderSucces()}
                <div className="message-container">
                    <span className="message">{`${this.props.showToastObj.name} ${message}`}</span>
                    </div>
                </div>)
        } 
        else {
            return (null)
        }
    }

    render() {
            return <div>{this.renderToast()}</div>
    }
    
}




function mapStateToProps({ showToastObj }) {
    return {  showToastObj };
}

export default connect(mapStateToProps, { showToast })(WebToast);