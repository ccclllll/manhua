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
    AsyncStorage,
    DeviceEventEmitter,
    BackHandler
} from 'react-native';
import FitImage from '../../components/FitImage';
import Loading from '../../components/Loading';
import gloabalConfig from '../../common/config.global'


import { SwiperGesture } from '../../utils/gesture';
import { http, getPixel, screen } from '../../utils/utils';
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
export default class ManhuaRead extends Component {
    constructor(props) {
        super(props);
        let bar = {};
        const { navigation } = this.props;
        this.cover = navigation.getParam('cover', '');

        let page = navigation.getParam('page', 0);
        this.index = page;

        Object.assign(bar, gloabalConfig.statusBar);
        bar.backgroundColor = 'rgba(0, 0, 0, 0.7)';


        this.swiper = new SwiperGesture({ onPress: () => { this.setState(pre => { return { showBotoomBar: !pre.showBotoomBar } }) }, onLeft: this._goNext });
        this.state = {
            imgList: [],
            book: {},
            bar: bar,
            loadedCount: 0,
            ready: false,
            index: this.index,
            showBotoomBar: false,
            inBookList: false,
            dialogVisible: false
        };
        this.updateBookCollect();

    }

    getManhuaInfo = () => {
        http(`${gloabalConfig.BASEURL}/api/acbook?url=${this.cover.detailUrl}`, {
            success: (data) => {
                this.setState({
                    book: JSON.parse(data)
                });
                this.getImgs();
            },
            fail: () => {
            }
        })
    }

    _goNext = () => {
        this.index = this.index >= this.state.book.chapters.length - 1 ? this.index : this.index + 1;
        this.setState(pre => {
            return {
                ready: false,
                loadedCount: 0,
                imgList: []
            }
        });
        this.getImgs();
        this.updateBookCollect();
    }



    updateBookCollect = () => {
        AsyncStorage.getItem('manhuas', (err, res) => {
            if (!err && res) {
                let obj = JSON.parse(res);
                if (obj[this.cover.detailUrl]) {
                    !this.state.inBookList && (this.setState({
                        inBookList: true
                    }));

                    obj[this.cover.detailUrl].index = this.index;
                    obj[this.cover.detailUrl].readTime = new Date().getTime();
                    AsyncStorage.setItem('manhuas', JSON.stringify(obj));
                }
            }
        })
    }

    _goPre = () => {
        this.index = this.index - 1 < 0 ? 0 : this.index - 1;
        this.setState({
            ready: false,
            loadedCount: 0,
            imgList: []
        });
        this.getImgs();
        this.updateBookCollect();
    }

    getImgs = () => {
        http(`${gloabalConfig.BASEURL}api/chapter?url=` + this.state.book.chapters[this.index].detailUrl, {
            success: (data) => {
                this.setState({
                    imgList: JSON.parse(data)
                });
            }
        });
    }


    componentDidMount() {
        this.getManhuaInfo();
        this.listner = BackHandler.addEventListener('hardwareBackPress', () => {
            const { navigation } = this.props;
            if (!this.state.inBookList) {
                this.setState({
                    dialogVisible: true
                });
                return true;
            } else {
                DeviceEventEmitter.emit('back', { origin: 'ManhuaReadPage' });
                return false;
            }
        });
    }
    componentWillUnmount() {
        this.listner.remove('hardwareBackPress');
    }

    _popConfirm = () => {
        this.setState({
            dialogVisible: false
        });
        this._addToBookList();
        const { navigation } = this.props;
        navigation.goBack();
        DeviceEventEmitter.emit('goBack', { origin: 'BookReadPage' });
    }

    _popRelease = () => {
        this.setState({
            dialogVisible: false
        });
 
        const { navigation } = this.props;
        navigation.goBack();
        DeviceEventEmitter.emit('goBack', { origin: 'BookReadPage' });
    }

    _addToBookList = () => {
        let cover = this.cover;
        AsyncStorage.getItem('manhuas', (error, res) => {
            if (!error && res) {
                let books = JSON.parse(res);
                if (!books[cover.detailUrl]) {
                    let index = this.index;
                    let readTime = new Date().getTime();
                    books[cover.detailUrl] = { cover, index, readTime };
                    AsyncStorage.setItem('manhuas', JSON.stringify(books));
                }
            }
        })
    }

    _handleImageLoadError = () => {

    }

    _loaded = () => {
        this.setState(pre => {
            return { loadedCount: pre.loadedCount + 1 }
        })
    }

    _renderImage = ({ item, index }) => {
        return (
            <FitImage uri={item} handLoadError={this._handleImageLoadError} loaded={this._loaded}></FitImage>
        )
    }

    _closeModal = () => {
        this.setState({ ready: true })
    }

    _renderEnd = () => {

    }

    _reachEnd = () => {
        http(`${gloabalConfig.BASEURL}api/chapter?url=` + this.state.book.chapters[this.index].detailUrl, {
            success: (data) => {
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
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <StatusBar {...this.state.bar}
                    backgroundColor={(this.state.loadedCount < this.state.imgList.length - 1 && !this.state.ready) ? 'rgba(0,0,0,0.7)' : 'transparent'} />
                {
                    (this.state.loadedCount < this.state.imgList.length - 1 && !this.state.ready) && (
                        <Loading onRequestClose={this._closeModal}></Loading>
                    )
                }
                <FlatList style={{ width: screen.width, height: screen.height, backgroundColor: 'rgba(0,0,0,.7)' }}
                    {...this.swiper.panResponder.panHandlers}
                    refreshing={true}
                    data={this.state.imgList}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={1}
                    renderItem={this._renderImage}
                    extraData={this.state}>
                </FlatList>

                {
                    this.state.showBotoomBar && (
                        <View style={{ width: screen.width, height: getPixel(50), backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', marginTop: getPixel(-50), justifyContent: 'space-between' }}>
                            <View style={{ height: getPixel(50), width: screen.width / 2, justifyContent: 'center' }}>
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={this._goPre}>
                                    <Text style={{ color: '#fff' }}>上一章</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: getPixel(50), width: screen.width / 2, justifyContent: 'center' }}>
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={this._goNext}>
                                    <Text style={{ color: '#fff' }}>下一章</Text>
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
            </View>
        )
    }
}