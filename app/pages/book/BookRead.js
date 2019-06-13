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
        this.updateBookCollect();



        this.state = {
            fontSizeStyle: gloabalConfig.bookReadConfig.fontSizeStyles,
            readMode: 'default',
            article: { content: [] },
            content: [],
            modalVisible: false,
            book: { chapters: [] },
            bgStyles: gloabalConfig.bookReadConfig.backgroundStyles,
            inBookList: false,
            dialogVisible: false
        }

        this.swiper = new SwiperGesture({ onPress: () => { this.setState(pre => { return { showBar: !pre.showBar } }) } });
    }

    componentDidMount() {

        this.getBookInfo();
   

        this.listner = BackHandler.addEventListener('hardwareBackPress', () => {
            const { navigation } = this.props;
            if (!this.state.inBookList&&navigation.state.routeName=='BookRead') {
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

    componentWillUnmount(){
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
                    books[cover.title + cover.author] = { cover, index, readTime };
                    AsyncStorage.setItem('books', JSON.stringify(books));
                }
            }
        })

    }

    getBookInfo = () => {
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

    getArticle() {
        http(`${gloabalConfig.BASEURL}/api/book/content?url=${this.state.book.chapters[this.index].detailUrl}`, {
            success: (data) => {
                this.setState({
                    content: JSON.parse(data)
                })
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
        this.updateBookCollect();
        this.setState({
            content: []
        })
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

                    obj[this.cover.title + this.cover.author].index = this.index;
                    obj[this.cover.title + this.cover.author].readTime = new Date().getTime();
                    AsyncStorage.setItem('books', JSON.stringify(obj));
                }
            }
        })
    }

    /**上一章 */
    pre = () => {
        if (this.index <= 0) {
            return;
        }
        this.index--;
        this.updateBookCollect();
        this.setState({
            content: []
        })
        this.getArticle();
    }

    componentWillMount() {

    }

    render() {
        return (
            <View style={[this.state.bgStyles[this.state.readMode], { flex: 1 }]}>
                <StatusBar {...gloabalConfig.statusBar_read}
                    backgroundColor={this.state.bgStyles[this.state.readMode].backgroundColor}
                    barStyle={this.state.bgStyles[this.state.readMode].backgroundColor}></StatusBar>

                <ScrollView
                    style={{ padding: 5 }}
                    scrollEventThrottle={100}
                    onScroll={this.onScroll}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.onOpenMenuPanel}>
                        <View
                            style={{ flex: 1 }} >
                            <View style={[styles.content,]}>
                                <FlatList data={this.state.content}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index}
                                    renderItem={this._renderText}>

                                </FlatList>
                                {
                                    this.state.content.length > 0 && (
                                        <View>
                                            <Button onPress={this.next} title={'下一章'}></Button>
                                        </View>
                                    )
                                }

                            </View>
                        </View>
                        <View style={{ height: 20 }}></View>
                    </TouchableOpacity>
                </ScrollView>
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
                        <View style={{ height: getPixel(60),width:screen.width*0.7,justifyContent:'center',alignItems:'center' }}>
                            <Text>是否加入书架？</Text>
                        </View>
                    </DialogContent>
                </Dialog>
            </View >


        )
    }

    _renderText = ({ item, index }) => {
        return (
            <Text style={[
                { fontSize: this.state.fontSizeStyle.contentFontSize, lineHeight: this.state.fontSizeStyle.titleFontSize + 10 }]}>{item}</Text>
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
