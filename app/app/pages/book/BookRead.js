import React, { Component } from 'react';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/FontAwesome';
import ItemMenu from '../../components/ItemMenu';
import ItemBg from '../../components/ItemBg'
import {
    Platform,
    View,
    AsyncStorage,
    Button,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Dimensions,
    WebView,
    StatusBar,
    BackHandler,
    DeviceEventEmitter,
} from 'react-native';
import DaoArticle from '../../dao/ArticleDao'
import Drawer from 'react-native-drawer'
import NavigtionBar from '../../components/NavigationBar'
import FontSizeContro from '../../components/FontSizeContro'
import { http, getPixel, screen } from '../../utils/utils';
import { FlatList } from 'react-native-gesture-handler';
import gloabalConfig from '../../common/config.global';
import { SwiperGesture } from '../../utils/gesture';
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
//import console = require('console');
//import console = require('console');

const VIEWABILITY_CONFIG = {
    viewAreaCoveragePercentThreshold: 80,//item80%部分可见才视为可见
};
export default class BookRead extends Component {
    // static navigationOptions = ({navigation})=>{
    //     return {
    //         gesturesEnabled: false,
    //     };
    // };
    constructor(props) {
        super(props)
        const { navigation } = this.props;
        this.chapters = navigation.getParam('chapters', []);
        this.index = navigation.getParam('page', 0);
        this.cover = navigation.getParam('cover', {});
        this.updateCount = 0; //更新计数
        this.currentPage = 0;

        this.indexData = {
            currentIndex: 0,
            indexBegin: 0,
            indexEnd: 0,
            indexList: [0]
        }
        let book = navigation.getParam('book', { chapters: [] });

        this.isFirstOpen = true;
        this.nextContent = null; //缓存下一章
        this.updateBookCollect();

        this.state = {
            fontSizeStyle: gloabalConfig.bookReadConfig.fontSizeStyles,
            readMode: 'default',
            article: { content: [] },
            content: [],
            modalVisible: false,
            book: book,
            bgStyles: gloabalConfig.bookReadConfig.backgroundStyles,
            inBookList: false,
            dialogVisible: false,
            canRenderLength: 0,
            currentIndex: 0,
            indexBegin: 0,
            indexEnd: 0,
            cacheContent: [],
            title: '',
            readPage: 0,
            pageContent: [],
            fontSize: 18,
            showBotoomBar: false

        }

        this.swiper = new SwiperGesture({ onPress: () => { this.setState(pre => { return { showBar: !pre.showBar } }) } });
    }

    componentDidMount() {

        this.getBookInfo();
        this._initConfig();

        //this._flatRef.scrollToIndex(this.indexData.currentIndex); // 转到历史阅读位置


        this.listner = BackHandler.addEventListener('hardwareBackPress', () => {
            const { navigation } = this.props;
            if (!this.state.inBookList && navigation.state.routeName == 'BookRead') {
                this.setState({
                    dialogVisible: true
                });
                return true;
            } else {
                DeviceEventEmitter.emit('back', { origin: 'BookReadPage' });
                return false;
            }
        });

    }

    /**
 * 翻到下一页
 */
    turnToNextPage = () => {
        //console.error(this.state.canRenderLength)
        if (this.currentPage < this.state.content.length - 1) {
            this.currentPage += 1;
            this.setState({
                pageContent: this.state.content[this.currentPage]
            });
        } else {

            this.next();
        }
        this.updateBookCollect();

    };

    /**
     * 翻到上一页
     */
    turnToPrePage = () => {

        if (this.currentPage > 0) {
            this.currentPage -= 1;
            this.setState({
                pageContent: this.state.content[this.currentPage]
            });
        } else {
            this.pre()
        }

        this.updateBookCollect();
    };



    _onResponderRelease = (e) => {

        let pageX = e.nativeEvent.pageX;

        if (pageX < screen.width / 3) {
            this.turnToPrePage()
        } else if (pageX > screen.width / 3 * 2) {

            this.turnToNextPage()
        } else if (!this.state.modalVisible) {
            this.setState(pre=>{
                return{
                    showBotoomBar: !pre.showBotoomBar
                }
            })
        }

    }


    componentWillUnmount() {
        this.listner.remove('hardwareBackPress');
    }

    _popConfirm = () => {
        this.setState({
            dialogVisible: false
        });
        this._addToBookList();
        DeviceEventEmitter.emit('back', { origin: 'BookReadPage' });
        const { navigation } = this.props;
        navigation.goBack();
    }

    _popRelease = () => {
        this.setState({
            dialogVisible: false
        });
        DeviceEventEmitter.emit('back', { origin: 'BookReadPage' });
        const { navigation } = this.props;
        navigation.goBack();
    }

    _addToBookList = () => {
        let cover = this.cover;
        AsyncStorage.getItem('books', (error, res) => {
            if (!error && res) {
                let books = JSON.parse(res);
                if (!books[cover.title + cover.author]) {
                    let index = this.index;
                    let readTime = new Date().getTime();
                    let readPage = this.currentPage;
                    books[cover.title + cover.author] = { cover, index, readTime, readPage };
                    AsyncStorage.setItem('books', JSON.stringify(books));
                }
            }
        })

    }

    getBookInfo = () => {
        if (this.state.book.chapters.length <= 0) {
            http(`${gloabalConfig.BASEURL}/api/book/acbook?url=${this.cover.detailUrl}`, {
                success: (data) => {

                    this.setState({
                        book: JSON.parse(data)
                    });
                    this.getArticle();
                },
                fail: () => {
                }
            })
        }

    }

    getArticle() {

        if (this.nextContent) {
  
            this.setState({
                content: this.nextContent,
                pageContent: this.nextContent[this.currentPage]
            });

            this.updateBookCollect();

            this.getNexContent();

        } else {
            http(`${gloabalConfig.BASEURL}/api/book/content?url=${this.state.book.chapters[this.index].detailUrl}&size=${this.state.fontSize}`, {
                success: (data) => {
                    let content = JSON.parse(data);
     

                    this.setState({
                        content: content,
                        pageContent: content[this.currentPage]
                    })

                    this.updateBookCollect();

                    //获取下一章
                    this.getNexContent();

                },
                fail: (state) => {
                    console.error(state)
                }
            })
        }


    }


    getNexContent = () => {
        http(`${gloabalConfig.BASEURL}/api/book/content?url=${this.state.book.chapters[this.index + 1].detailUrl}&size=${this.state.fontSize}`, {
            success: (data) => {
                let content = JSON.parse(data);
                this.nextContent = content;

            },
            fail: (state) => {
                console.error(state)
            }
        })
    }

    setBgStyles = (target) => {

    }

    onOpenMenuPanel = () => {
        this.setState((pre) => {
            return {
                modalVisible: true,
            }
        })
    }

    onFontSizeChange = (activity) => {

    }

    onScroll = (e) => {

    }

    reachEnd = () => {
    }


    /**下一章 */
    next = () => {
        if (this.index >= this.state.book.chapters.length - 1) {
            return;
        }
        this.index++;
        this.currentPage = 0;
        this.getArticle();
    }

    updateBookCollect = () => {
        AsyncStorage.getItem('books', (err, res) => {
            if (!err && res) {
                let obj = JSON.parse(res);
                if (obj[this.cover.title + this.cover.author]) {
                    !this.state.inBookList && (this.setState({
                        inBookList: true
                    }));

                    if (this.isFirstOpen) {
                        // 第几页
                        this.currentPage = obj[this.cover.title + this.cover.author].readPage;
                        //console.warn(this.currentPage)
                        // 第几章  
                        this.index = obj[this.cover.title + this.cover.author].index;

                        if(this.state.book.chapters.length>0){
                            this.getArticle();
                        }else{
                            this.getBookInfo();
                        }
                   
                        this.isFirstOpen = false;

                    } else {
                        obj[this.cover.title + this.cover.author].readPage = this.currentPage;
                        obj[this.cover.title + this.cover.author].index = this.index;
                    }

                    obj[this.cover.title + this.cover.author].readTime = new Date().getTime();
                    AsyncStorage.setItem('books', JSON.stringify(obj));
                }
            }
        })
    }

    _initConfig=()=>{
        AsyncStorage.getItem('config', (err, res) => {
            if(!err&&res){
                this.setState({
                    readMode: res
                })
            }
        })
    }

    /**上一章 */
    pre = () => {
        if (this.index <= 0) {
            return;
        }
        this.index--;
        this.currentPage = 0;
        this.getArticle();
    }

    componentWillMount() {
        this.setState({
            canRenderLength: screen.height / 43
        })
    }

    render() {
        return (
            <View style={[{ backgroundColor:this.state.bgStyles[this.state.readMode].backgroundColor,flex: 1, height: screen.height, width: screen.width, alignItems: 'center', justifyContent: 'center' }]}
                onStartShouldSetResponder={() => {
                    return true
                }}
                onMoveShouldSetPanResponder={() => { return true }}
                onResponderRelease={this._onResponderRelease}>
                <StatusBar {...gloabalConfig.statusBar_read}
                    backgroundColor={this.state.bgStyles[this.state.readMode].backgroundColor}
                    barStyle={this.state.bgStyles[this.state.readMode].backgroundColor}></StatusBar>
                <View>
                    <View style={[]}
                        style={{ height: screen.height, width: screen.width, marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}
                    >



                        <FlatList data={this.state.pageContent}
                            style={{ marginBottom: 20, marginTop: 30 }}
                            initialScrollIndex={0}
                            extraData={this.state.pageContent}
                            keyExtractor={(item, index) => index}
                            scrollEnabled={false}
                            renderItem={this._renderText}

                            ref={(ref) => {
                                this._flatRef = ref
                            }}>

                        </FlatList>

                    </View>
                </View>
                <View style={{ height: 20, width: screen.width, position: 'absolute', bottom: 0, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                    <Text style={{ color: '#858585', lineHeight: 15, fontSize: 12 }}>{this.state.book.chapters[this.index] && (this.state.book.chapters[this.index].title)}</Text>
                </View>

                {
                    this.state.showBotoomBar && (
                        <View style={{ position: 'absolute',width: screen.width, height: getPixel(50), backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', bottom: 0, justifyContent: 'space-around',alignItems:'center' }}>
                            <View style={{ height: getPixel(30), width: screen.width / 5.5, justifyContent: 'center',backgroundColor: this.state.bgStyles.tea.backgroundColor }}>
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={()=>this._changeStyle('tea')}>
                                    <Text style={{ color: '#333' }}>茶色</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: getPixel(30), width: screen.width / 5.5, justifyContent: 'center',backgroundColor: this.state.bgStyles.baixue.backgroundColor }}>
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={()=>this._changeStyle('baixue')}>
                                    <Text style={{ color: '#333' }}>亮雪</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ height: getPixel(30), width: screen.width / 5.5, justifyContent: 'center',backgroundColor: this.state.bgStyles.mise.backgroundColor }}>
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={()=>this._changeStyle('mise')}>
                                    <Text style={{ color: '#333' }}>米白</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: getPixel(30), width: screen.width / 5.5, justifyContent: 'center',backgroundColor: this.state.bgStyles.night.backgroundColor }}>
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={()=>this._changeStyle('night')}>
                                    <Text style={{ color: '#fff' }}>夜间</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: getPixel(30), width: screen.width / 5.5, justifyContent: 'center',backgroundColor: this.state.bgStyles.default.backgroundColor }}>
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={()=>this._changeStyle('default')}>
                                    <Text style={{ color: '#333' }}>默认</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }

                <Dialog
                    visible={this.state.dialogVisible}
                    dialogStyle={{ height: getPixel(150), width: screen.width * 0.7 }}
                    dialogTitle={(<Text>提示</Text>)}
                    footer={
                        <DialogFooter>
                            <DialogButton
                                text="取消"
                                onPress={this._popRelease}
                            />
                            <DialogButton
                                text="加入书架"
                                onPress={this._popConfirm}
                            />
                        </DialogFooter>
                    }
                >
                    <DialogContent>
                        <View style={{ height: getPixel(60), width: screen.width * 0.7, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>是否加入书架？</Text>
                        </View>
                    </DialogContent>
                </Dialog>
            </View >


        )
    }


    _changeStyle(mode){

        this.setState({
            readMode: mode
        });
        AsyncStorage.setItem('config', mode);
    }
    _renderText = ({ item, index }) => {
        return (
            <Text style={[
                { fontSize: getPixel(this.state.fontSizeStyle.contentFontSize), lineHeight: getPixel(this.state.fontSizeStyle.titleFontSize + 12),color: this.state.bgStyles[this.state.readMode].color }]}>{item}</Text>
        )
    }

}
const styles = StyleSheet.create({
    endView: {
        borderStyle: 'solid',
        paddingTop: 15,
        paddingBottom: 15,
        borderTopWidth: 1,
        borderColor: '#666',
        borderBottomWidth: 1,
    },
    endText: {
        textAlign: 'center'
    },
    content: {
        marginTop: 20,
    },
    itemMenuTitle: {
        color: '#fff',
        height: 35,
        lineHeight: 35
    },
    author: {
        marginTop: 20,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    title: {
        marginTop: 20,
        textAlign: 'center'
    },
    itemMenu: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menu: {
        margin: 0,
        justifyContent: 'flex-end',
        height: getPixel(screen.height)
    },
    menuContent: {
        height: getPixel(80),
        backgroundColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',

    },

    cut: {
        height: 1,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#999'
    },
    tips: {
        fontSize: 30,
    },
    bgList: {
        height: 100,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#8e949d',
        flexDirection: 'row'
    }
});
