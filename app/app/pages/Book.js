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
//获取屏幕大小
const { width, height } = Dimensions.get("window");
export default class Book extends Component{
    constructor(props){
        super(props);
        this.state = {acbook:{chapters:[],cover: {}},data:[{title:'1'}],index: -1};
        
    }

    initBookData() {
        const { navigation } = this.props;
        const cover = navigation.getParam('cover', '');
        const index = navigation.getParam('index',-1);

        this.setState({
            index: index
        })
        http(`${gloabalConfig.BASEURL}api/acbook?url=`+cover.detailUrl,{
            success: (data)=>{
                let book = JSON.parse(data);
                book.cover = cover;
                this.setState({
                    acbook: book
                });
            },
            fail(){

            }
        });
    }

    componentDidMount() {
        this.initBookData();
    }

    render() {
        return (
            <View style={styles.wrap}>
            <StatusBar {...gloabalConfig.statusBar}></StatusBar>
            <ScrollView style={{height: screen.height-getPixel(50)}}>
                <ImageBackground style={styles.coverWrap} source={require('../../assets/img/int_bg.png')}>
                    <View style={styles.coverImageWrap}>
                        <View style={styles.title}>
                            <Text style={styles.titleText}>{this.state.acbook.cover.title}</Text>
                        </View>
                        <Image style={styles.coverImage} source={{uri: this.state.acbook.cover.imgUrl}}></Image>
                    </View>
                    <View style={styles.detailWrap}>
                        <Text style={styles.text}>更新至：{this.state.acbook.cover.section}</Text>
                        <Text style={styles.text}>{this.state.acbook.author}</Text>
                        <Text style={styles.text}>{this.state.acbook.category}</Text>
                    </View>
                </ImageBackground>

            <FlatList
                data={this.state.acbook.chapters}
                renderItem={this.renderRow}
                horizontal={false}
                numColumns={2}
                keyExtractor={(item,index)=> index}
                style={styles.listWrap}
            />
            
            </ScrollView>
            {
                this.state.index!=-1 && (
                    <View style={{height: getPixel(50),width:screen.width,flexDirection: 'row'}}>
                    <TouchableOpacity style={{height: getPixel(50),width:screen.width/2,alignItems: 'center',justifyContent: 'center',backgroundColor: 'rgb(245,245,245)'}}>
                        <Text>{this.state.acbook.cover.title}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{height: getPixel(50),width:screen.width/2,alignItems: 'center',justifyContent: 'center',backgroundColor: 'rgb(83,133,247)'}}
                    onPress={() => this.props.navigation.navigate('Read',{
                        acbook: this.state.acbook,index: this.state.index
                    })}>
                        <Text>继续阅读</Text>
                    </TouchableOpacity>
                    </View>
                )
            }
            </View>

        )
    }

    renderRow = ({item,index}) => {
        return(
            <TouchableOpacity
                style={styles.itemViewStyle}  onPress={() => this.props.navigation.navigate('Read',{
                    acbook: this.state.acbook,index: index
                })}
            >
                <View style={styles.item}>
                    <Text>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

}
const styles = StyleSheet.create({
    wrap:{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    coverWrap:{
        paddingTop: getPixel(20),
        height: getPixel(200),
        width: width,
        flexDirection: 'row',
    },
    coverImageWrap: {
        width: width/3,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    coverImage:{
        width: width/3.3,
        height: getPixel(150)
    },
    title: {
        height: getPixel(20),
        width: width/3.3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    titleText: {
        fontSize: getPixel(17),
        fontWeight: 'bold',
        color:'#fff'
    },
    listWrap: {
        flex: 1,
        flexDirection: 'column',
    
    },
    detailWrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: getPixel(10),
        paddingTop: getPixel(25)
    },
    text:{
        fontSize: getPixel(15),
        color: '#fff',
        lineHeight: getPixel(40)
    },
    list: {

        backgroundColor: 'powderblue'
    },
    label: {
        height: getPixel(40),
        width: getPixel(80),
        backgroundColor: 'steelblue'
    },
    listStyle:{
        flexDirection:'row', //改变ListView的主轴方向
        flexWrap:'wrap', //换行
    },
    itemViewStyle:{
        alignItems:'center', //这里要注意，如果每个Item都在外层套了一个 Touchable的时候，一定要设置Touchable的宽高
        width: width / 2,
        height:70,
    },
    item:{
        alignItems:'center', //这里要注意，如果每个Item都在外层套了一个 Touchable的时候，一定要设置Touchable的宽高
        justifyContent: 'center',
        width: width / 2.5,
        height:50,
        margin: 10,
        borderWidth: 1,
        borderRadius: getPixel(6),
        borderColor: '#555'
    }
})