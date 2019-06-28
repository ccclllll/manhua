import React, {
    Component
} from 'react';
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    FlatList,
    AsyncStorage
} from 'react-native';
import FitImage from '../components/FitImage';
import Loading from '../components/Loading';
import gloabalConfig from '../common/config.global'


import { SwiperGesture } from '../utils/gesture';
import { http, getPixel, screen } from '../utils/utils';
export default class Read extends Component{
    constructor(props){
        super(props);
        let bar = {};
        const { navigation } = this.props;
        const book = navigation.getParam('acbook', '');

        let index = navigation.getParam('index',0);
        this.index = index;

        Object.assign(bar,gloabalConfig.statusBar);
        bar.backgroundColor = 'rgba(0, 0, 0, 0.7)';

        this.swiper = new SwiperGesture({onPress: ()=>{this.setState(pre=> {return {showBotoomBar: !pre.showBotoomBar}})},onLeft: this._goNext});
        this.state = {imgList:[],acbook:{},book: book,bar: bar,loadedCount: 0,ready:false,index: index,showBotoomBar: false}; 
    
        this._updateHistory();
    }

    _goNext = () => {
        this.index = this.index  >= this.state.book.chapters.length -1  ? this.index : this.index + 1 ;
        this.setState(pre => {
            return{
                ready: false,
                loadedCount: 0,
                imgList: []
            }
        });

        this.initPages();
        this._updateHistory();
    }
    
 
    _updateHistory = () =>{
        AsyncStorage.getItem('history',(error,result)=>{
            if(!error&&result){
                let res = JSON.parse(result);
                // 历史记录只保存十条
                if(res.length>=10){
                    res.pop();
                }
                res = res.filter((item,index)=>{
                    return item.book.title != this.state.book.cover.title
                });
                res.unshift({book: this.state.book.cover,index: this.index});
                AsyncStorage.setItem('history',JSON.stringify(res),(error)=>{});
            }
            if(!result){
                AsyncStorage.setItem('history',JSON.stringify([{book: this.state.book.cover,index: this.index}]),(error)=>{})
            }
        })
    }

    _goPre = () =>{
        this.index = this.index - 1 < 0 ? 0 : this.index - 1;
        this.setState({
            ready: false,
            loadedCount: 0,
            imgList: []
        });
        this.initPages();
        this._updateHistory();
    }

    initPages(){
        http(`${gloabalConfig.BASEURL}api/chapter?url=`+this.state.book.chapters[this.index].detailUrl,{
            success: (data)=>{
                this.setState({
                    imgList: JSON.parse(data)
                });          
            }
        });
    }
    
    
    componentDidMount() {
        this.initPages();
    }

    _handleImageLoadError= ()=>{

    }

    _loaded= () =>{
        this.setState(pre=>{
            return {loadedCount: pre.loadedCount+1}
        })
    }

    _renderImage= ({item,index}) => {
        return(
            <FitImage uri={item} handLoadError={this._handleImageLoadError} loaded={this._loaded}></FitImage>
        )
    }

    _closeModal = () =>{
        this.setState({ready: true})
    }

    _renderEnd = () =>{

    }

    _reachEnd = () =>{
        http(`${gloabalConfig.BASEURL}api/chapter?url=`+this.state.book.chapters[this.index].detailUrl,{
            success: (data)=>{
                this.setState(pre => {        
                    return {
                        imgList: pre.imgList.push(JSON.parse(data))
                    }
                })
            }
        })
    }

    render() {
        return (
            <View style={{flex: 1,flexDirection: 'column'}}>
                <StatusBar {...this.state.bar} 
                    backgroundColor={(this.state.loadedCount<this.state.imgList.length-1 && !this.state.ready) ? 'rgba(0,0,0,0.7)': 'transparent' }/> 
                {
                    (this.state.loadedCount<this.state.imgList.length-1 && !this.state.ready) &&(
                        <Loading onRequestClose={this._closeModal}></Loading>
                    )
                }
                    <FlatList style={{width: screen.width,height: screen.height,backgroundColor: 'rgba(0,0,0,.7)'}} 
                        {...this.swiper.panResponder.panHandlers}
                        refreshing={true}
                        data={this.state.imgList}
                        keyExtractor={(item,index)=>index.toString()}
                        numColumns={1}
                        renderItem={this._renderImage}       
                        extraData={this.state}>
                    </FlatList>
         
                    {
                        this.state.showBotoomBar && (
                            <View style={{width: screen.width,height: getPixel(50),backgroundColor: 'rgba(0,0,0,0.5)',flexDirection: 'row',marginTop: getPixel(-50),justifyContent:'space-between'}}>
                                <View style={{height:getPixel(50),width: screen.width/2,justifyContent: 'center'}}>
                                    <TouchableOpacity style={{flex: 1,justifyContent: 'center',alignItems:'center'}} onPress={this._goPre}>
                                    <Text style={{color:'#fff'}}>上一章</Text>              
                                    </TouchableOpacity>
                                </View>
                                <View style={{height:getPixel(50),width: screen.width/2,justifyContent: 'center'}}>
                                    <TouchableOpacity style={{flex: 1,justifyContent: 'center',alignItems:'center'}} onPress={this._goNext}>
                                        <Text style={{color:'#fff'}}>下一章</Text>
                                    </TouchableOpacity>
                                </View>
                  
                            </View>
                        )
                    }

            </View>
        )
    }
}