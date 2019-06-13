import React, {
    Component
} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { getPixel, screen} from '../utils/utils';
import { Input, Icon } from 'react-native-elements';
import { TextInput, TouchableHighlight } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { SwiperGesture } from '../utils/gesture';
export default class SearchBar extends Component{
    constructor(props){
        super(props);
        this.swiper = new SwiperGesture({
            onPress:props.onPress||this._onPress
        }) 
        this.containerStyle = {};
        Object.assign(this.containerStyle,this.props.containerStyle||{})
    }

    _onPress(){

    }
    focus = ()=>{

    }
    render(){
       return(
        <View style={[{height:getPixel(40),width:screen.width,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'rgb(51,133,255)'}]}>     

            {
                this.props.inputConfig&&this.props.inputConfig.editable === false ? (
                <View style={styles.input} {...this.swiper.panResponder.panHandlers}>
                    <TextInput {...this.props.inputConfig} style={{height:getPixel(40),width: screen.width-getPixel(60)}}></TextInput>
                    {
                        this.props.renderIcon?this.props.renderIcon():(
                         <FontAwesome name={this.props.icon||'search'} size={20} color={this.props.iconColor||'rgb(153,153,153'} style={{marginRight: getPixel(10)}}/>
                        )
                    }
                </View>): (
                <View style={styles.input}>
                    <TextInput {...this.props.inputConfig} style={{height:getPixel(40),width: screen.width-getPixel(60)}}></TextInput>
                    {
                        this.props.renderIcon?this.props.renderIcon():(
                        <FontAwesome name={this.props.icon||'search'} size={20} color={this.props.iconColor||'rgb(153,153,153'} style={{marginRight: getPixel(10)}}/>
                        )
                    }
                </View>  
                )
                
            }

        </View>
       ) 
    }
}
const styles = StyleSheet.create({
    wraper:{
        height:getPixel(40),
        width:screen.width,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgb(51,133,255)'
    },
    input:{
        height:getPixel(30),
        width:screen.width-getPixel(30),
        borderRadius: getPixel(10),
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center'
    }
    
})