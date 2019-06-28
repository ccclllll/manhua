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

import { http, getPixel, screen } from '../../utils/utils';
import gloabalConfig from '../../common/config.global'
import SearchBar from '../../components/SearchBar';
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Swiper from 'react-native-swiper';
var IMGS = [
    'https://images.unsplash.com/photo-1441742917377-57f78ee0e582?h=1024',
    'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?h=1024',
    'https://images.unsplash.com/photo-1441448770220-76743f9e6af6?h=1024',
    'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024',
    'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
    'https://images.unsplash.com/photo-1440847899694-90043f91c7f9?h=1024'
];
export default class BookHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: IMGS,
            page: 0,
            swipers: []
        }
    }

    componentDidMount() {
        http(gloabalConfig.BASEURL+'/api/book/swipper', {
            success: (data) => {
                this.setState({
                    swipers: JSON.parse(data)
                })
            },
            fail: (state) => {
                console.error(state)
            }
        })
    }
    
    _renderBookItem = (item, index) => {
        return (
            <TouchableOpacity style={{ height: getPixel(90), width: screen.width }} onPress={() => this.props.navigation.navigate('BookDetail', {
                cover: item
            })}>
                <View style={{ height: getPixel(90), width: screen.width, padding: getPixel(5), flexDirection: 'row' }} key={index}>
                    <Image source={{ uri: item.imgUrl }} style={{ height: getPixel(80), width: getPixel(60) }}></Image>
                    <View style={{ flex: 1, marginLeft: getPixel(10) }}>
                        <Text>{item.title}</Text>
                        <Text>{item.author}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

    _searchFucus = () => {
        this.props.navigation.navigate('BookSearch');
    }


    _renderDefault = () => {
        return (
            <ScrollView tabLabel='精选' style={{ flex: 1 }}>

                <View style={{ backgroundColor: '#fff', marginTop: getPixel(5) }}>
                    <View style={{ height: getPixel(30), width: screen.width, flexDirection: 'row', justifyContent: 'space-between' }}><View><Text>热门推荐</Text></View><View><Text>更多</Text></View></View>
                    <View>
                        {
                            this.state.swipers.map((item, index) => {
                                return this._renderBookItem(item, index)
                            })
                        }
                    </View>
                </View>
            </ScrollView>
        )
    }

    render() {

        return (
            <View style={styles.container}>
                <StatusBar {...gloabalConfig.statusBar_book}></StatusBar>
                <SearchBar inputConfig={{ editable: false, placeholder: '搜索' }} onPress={this._searchFucus}></SearchBar>
                <ScrollableTabView
                    style={styles.container}
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar activeTextColor={'rgb(51,133,255)'} underlineStyle={{ backgroundColor: 'rgb(51,133,255)' }} tabStyle={{backgroundColor:'#fff'}}/>}
                >


                    {
                        this._renderDefault()
                    }
                    <ScrollView tabLabel='分类' style={styles.container}>

                    </ScrollView>

                    <ScrollView tabLabel='榜单' style={styles.container}>

                    </ScrollView>
                </ScrollableTabView>
            </View>

        )
    }

    _renderPage = (data, pageID) => {

        return (
            <Image source={{ uri: data }} style={{ width: screen.width }}>

            </Image>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED'
    },
    itemBar: {
        height: getPixel(30),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    coverItem: {
        height: getPixel(150),
        width: screen.width / 3.3,
    },
    coverWrap: {
        height: getPixel(150),
        width: screen.width / 3,
        alignItems: 'center',
    },
    itemImage: {
        height: getPixel(130)
    },
    itemSection: {

        color: '#fff',
        textAlign: 'right'
    },
    sectionWrap: {
        height: getPixel(20),
        flex: 1,
        marginTop: getPixel(-20),
        backgroundColor: '#000',
        opacity: 0.6
    }
})