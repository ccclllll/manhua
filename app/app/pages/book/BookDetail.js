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
    StatusBar,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { http, getPixel, screen } from '../../utils/utils';
import gloabalConfig from '../../common/config.global'
import localStorage from '../../common/LocalStorageUtils'
import { ListItem } from 'react-native-elements';
import getHashCode from '../../common/hash'
export default class BookDetail extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const cover = navigation.getParam('cover', '');
        this.state = {
            cover: cover,
            book: { chapters: [] },
            index: -1
        }
    }

    componentDidMount() {
        this._getBookIndex();
        DeviceEventEmitter.addListener('back',()=>{
            this._getBookIndex();
        })
    }


    _getBookIndex = ()=>{
        AsyncStorage.getItem('books',(err,res)=>{
            if(!err&&res){
                let books = JSON.parse(res);
                if(books[this.state.cover.title+this.state.cover.author]){
                    this.setState({
                        index: books[this.state.cover.title+this.state.cover.author].index
                    })
                }
            }
        })
    }

    _addToBookList = ()=>{
        let cover = this.state.cover;
        this.setState({
            index:0
        })

        AsyncStorage.getItem('books',(error,res)=>{
            if(!error&&res){
                let books = JSON.parse(res);
                if(!books[cover.title+cover.author]){
                    let index = 0;
                    let readTime = new Date().getTime();
                    let readPage = 0;
                    books[cover.title+cover.author] = {cover,index,readTime,readPage};
                    AsyncStorage.setItem('books',JSON.stringify(books));
                }
            }
        })

    }


    render() {
        return (
            <View style={styles.container}>
                <StatusBar {...gloabalConfig.statusBar}></StatusBar>
                <ScrollView style={{width:screen.width,height:screen.height-getPixel(50)}}>
                    <ImageBackground source={require('../../../assets/img/int_bg.png')} style={styles.coverWrap}>
                        <View style={styles.coverImageWrap}>
                            <Image style={styles.coverImage} source={{ uri: this.state.cover.imgUrl }}></Image>
                        </View>
                        <View style={styles.detailWrap}>
                            <View style={styles.title}>
                                <Text style={styles.titleText}>{this.state.cover.title}</Text>
                            </View>
                            <View style={styles.title}>
                                <Text style={styles.titleText}>{this.state.cover.author}</Text>
                            </View>
                            {/* <Text style={styles.text}>更新至：{this.state.acbook.cover.section}</Text>
                        <Text style={styles.text}>{this.state.acbook.author}</Text>
                        <Text style={styles.text}>{this.state.acbook.category}</Text> */}
                        </View>

                    </ImageBackground>
                    <View style={{ backgroundColor: '#fff', marginTop: getPixel(6), width: screen.width, padding: getPixel(5) }}>
                        <Text>简介</Text>
                        <View>
                            <Text style={{ color: '#555', fontSize: 15, lineHeight: 17 }}>{this.state.cover.simpleDetail}</Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: '#fff', marginTop: getPixel(6), width: screen.width }}>
                        <Text style={{ fontWeight: 'bold' }}>目录</Text>
                        <ListItem titleStyle={{ color: '#777' }} title={this.state.cover.section || '查看全部章节'}
                            onPress={() => this.props.navigation.navigate('BookChapter', {
                                cover: this.state.cover
                            })}
                            rightElement={() => { return (<Icon name={'angle-right'} size={25}></Icon>) }}>
                        </ListItem>
                    </View>
                </ScrollView>


                {
                    this.state.index != -1 ? (
                        <View style={{ height: getPixel(50), width: screen.width, flexDirection: 'row', position: 'absolute', bottom: 0 }}>
                            <TouchableOpacity style={{ height: getPixel(50), width: screen.width / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(245,245,245)' }}>
                                <Text>{this.state.cover.title}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ height: getPixel(50), width: screen.width / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(83,133,247)' }}
                                onPress={() => this.props.navigation.navigate('BookRead', {
                                    cover: this.state.cover, page: this.state.index
                                })}>
                                <Text>继续阅读</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                            <View style={{ height: getPixel(50), width: screen.width, flexDirection: 'row' }}>
                                <TouchableOpacity 
                                onPress={this._addToBookList}
                                style={{ height: getPixel(50), width: screen.width / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(245,245,245)' }}>
                                    <Text>加入收藏</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: getPixel(50), width: screen.width / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(83,133,247)' }}
                                    onPress={() => this.props.navigation.navigate('BookRead', {
                                        cover: this.state.cover, page: 0
                                    })}>
                                    <Text>开始阅读</Text>
                                </TouchableOpacity>
                            </View>
                        )
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED'
    },
    coverImage: {
        height: getPixel(200),
        width: screen.width
    },
    coverWrap: {
        paddingTop: getPixel(20),
        height: getPixel(200),
        width: screen.width,
        flexDirection: 'row',
    },
    coverImageWrap: {
        width: screen.width / 3,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    coverImage: {
        width: screen.width / 3.3,
        height: getPixel(150)
    },
    title: {
        height: getPixel(20),
        width: screen.width / 3.3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    titleText: {
        fontSize: getPixel(17),
        fontWeight: 'bold',
        color: '#fff'
    },
    detailWrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: getPixel(10),
        paddingTop: getPixel(20)
    },
})