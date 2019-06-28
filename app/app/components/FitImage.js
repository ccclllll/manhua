import React, {
        Component
    } from 'react';
import {
        Dimensions,
        Platform,
        Image
    } from 'react-native';

//获取屏幕大小
const { width, height } = Dimensions.get("window");
export default class FitImage extends Component{

    constructor(props){
        super(props);
        this.state = {height: 0, isLoaded: false };
        Image.getSize(this.props.uri,(owidth,oheight)=>{
           this.setState({
               isLoaded: true
           })
            const radiux = owidth / oheight;
            this.setState({
                height: Math.floor(width / radiux)
            });
            // 调用父组件的loade,影响父组件状态 （通信）
            this.props.loaded();
        },()=>{
            this.props.handLoadError();
        });
    }
    
    isLoaded = ()=>{
        return this.state.isLoaded;
    }
    render() {
        return (
            <Image source={{uri: this.props.uri}} style={{width: width,height: this.state.height}}></Image>
        )
    }
}