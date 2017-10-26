'use strict';

import React, {Component} from 'react';

import HashForm from '../components/HashForm';
import HashList from '../components/HashList';

import {SocketProvider} from '@pupper/pupper-react';

const globalSocket = new WebSocket('ws://' + window.location.host + ':1337');

class HashPage extends Component {
    constructor() {
        super();
        this.state = {textToHash: '', hashList: [], lastTextHashedKey: 0};
        this.onAddTextToHash = this.onAddTextToHash.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onPhpData = this.onPhpData.bind(this);
    }

    onPhpData(hashedText) {
        const {hashList, lastTextHashedKey} = this.state;
        hashList[lastTextHashedKey] = hashedText;
        this.setState({hashList, lastTextHashedKey: lastTextHashedKey + 1});
    }

    onAddTextToHash() {
        const {hashList, textToHash} = this.state;
        hashList.push(textToHash);
    }

    onTextChange(textToHash) {
        this.setState({textToHash});
    }

    render() {
        return <div>

            <link href='https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css' rel='stylesheet'/>
            <link href='../style.css' rel='stylesheet'/>

            <div id='logo-container'>
                <img src='../pupper.png'/>
            </div>

            <SocketProvider socket={globalSocket}>

                <HashForm bindTo='text_sent'
                          toSubmit={this.state.textToHash}
                          textToHash={this.state.textToHash}
                          onTextChange={this.onTextChange}
                          onSubmit={this.onAddTextToHash}>
                    Add
                </HashForm>

                <HashList bindTo='hash_sent' hashList={this.state.hashList} onData={this.onPhpData}/>

            </SocketProvider>

        </div>;
    }
}

export default HashPage;
