import React, { Component } from 'react';
import {
    View,
    Text,
    ProgressBarAndroid,
    Modal,
    StyleSheet
} from 'react-native';

import {screen, getPixel} from '../utils/utils'
export default class Loading extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        return(
            <Modal
                transparent = {true}
                onRequestClose={this.props.onRequestClose}
                animationType={'fade'}
            >
                <View style={styles.loadingBox}>
                    <ProgressBarAndroid styleAttr='Inverse' color='#FF4500' style={{marginTop: -screen.height}}/>
                </View>
            </Modal>
        );
    }

}
const styles = StyleSheet.create({
    loadingBox: {
       width:screen.width,
        flexDirection: 'row',
        height: screen.height*2,
        justifyContent:'center',
        backgroundColor:'rgba(0, 0, 0, 0.7)',
    }
});