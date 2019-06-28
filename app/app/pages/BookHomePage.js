/**
 * 小说首页
 */
import React, {
    Component
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    StatusBar
} from 'react-native';

import { http, getPixel,screen } from '../utils/utils';
import gloabalConfig from '../common/config.global'
export default class BookHomePage extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={styles.container}>
                <StatusBar {...gloabalConfig.statusBar_book}></StatusBar>
                <View style={{height:getPixel(40),width:screen.width,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'rgb(51,133,255)'}}>
                    <TouchableOpacity style={{height:getPixel(30),width:screen.width-getPixel(30)}} onPress={this._searchFucus}>
                    <View style={{height:getPixel(30),width:screen.width-getPixel(30),borderRadius: getPixel(10),backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}>
                        <Text>搜索</Text>
                    </View>
                    </TouchableOpacity>
                </View> 
                <View>
                    
                </View>
                <Text>book home</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})