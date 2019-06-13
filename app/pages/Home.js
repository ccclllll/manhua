import React, {
    Component
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { http, getPixel, screen, httpPromise } from '../utils/utils';
import { SearchBar } from 'react-native-elements';
import gloabalConfig from '../common/config.global'
import Swiper from 'react-native-swiper';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommend: [],
            err: '',
            length: 0,
            myCover: [],
            swipers: []
        };
    }

    initData() {
        http(`${gloabalConfig.BASEURL}api/recommend`,{
            success: (data)=>{
                    this.setState({
                    recommend: JSON.parse(data)
                })
            },
            fail: (state)=>{
                console.error(state)
            }
        });      
    }

     _initSwpierData = ()=>{
        httpPromise(`${gloabalConfig.BASEURL}api/swipper`).then((data)=>{
            this.setState({
                swipers: JSON.parse(data)
            })
        }).catch(err=> console.error(err))
    }
    componentDidMount() {
        this.initData();
        this._initSwpierData();
    }

    _searchFucus =()=>{
        this.props.navigation.navigate('Search');
        
    }

    
    render() {
 
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
                <ScrollView>
                <View style={{width:screen.width,height: screen.height/4,marginBottom: getPixel(20)}}>
                    <Swiper style={{width:screen.width,height: screen.height/4}}
                        removeClippedSubviews={false}
                        autoplay={true}>
                        {
                            this.state.swipers.map((item,index)=>{
                                return (
                                    <TouchableOpacity style={{height:screen.height/4,width: screen.width}} onPress= {() => this.props.navigation.navigate('Book',{
                                        cover: item
                                    })} key={index}>
                                    <Image source={{uri: item.imgUrl}} key={index} style={{flex: 1}}></Image>
                                    </TouchableOpacity>

                                )
                            })
                        }
                       
                    </Swiper>
                </View>
                {
                    this.state.recommend.map((item,index)=>{
                        return (                        
                                    <View key={index}>
                                        <View style={styles.itemBar}>                
                                            <View>
                                                <Text>{item.title}</Text>
                                            </View>
                                            <TouchableOpacity>
                                                <Text>更多>></Text>
                                            </TouchableOpacity>
                                        </View> 
                                        <FlatList
                                                        data={item.covers}
                                                        renderItem={this.renderRow}
                                                        horizontal={false}
                                                        numColumns={3}
                                                        keyExtractor={(item,index1)=> index1}
                                                    />
                                                          
                                    </View>
                            )
                        })
                }
                </ScrollView>
                
                {/* <View>
                    <FlatList
                        data={this.state.acbook.chapters}
                        renderItem={this.renderRow}
                        horizontal={false}
                        numColumns={3}
                        keyExtractor={(item,index)=> index}
                    />
                </View> */}
            </View>
        )
    }

    renderRow = ({item}) => {

        return(
            <TouchableOpacity style={styles.coverWrap} 
                onPress= {() => this.props.navigation.navigate('Book',{
                    cover: item})}>                        
                <View style={styles.coverItem}>
                    <Image style={styles.itemImage} source={{uri:item.imgUrl}}></Image>
                    <View style={styles.sectionWrap}>
                        <Text style={styles.itemSection}>{item.section}</Text>
                    </View>
                    <Text>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#EDEDED'
    },
    itemBar:{
        height: getPixel(30),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    coverItem:{
        height: getPixel(150),
        width: screen.width/3.3,
    },
    coverWrap:{
        height: getPixel(150),
        width: screen.width/3,
        alignItems:'center', 
    },
    itemImage:{
        height: getPixel(130)
    },
    itemSection:{
   
        color: '#fff',
        textAlign: 'right'
    },
    sectionWrap:{
        height: getPixel(20),
        flex: 1,
        marginTop: getPixel(-20),
        backgroundColor: '#000',
        opacity: 0.6
    }
})