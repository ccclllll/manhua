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
import { http, getPixel, screen, httpPromise } from '../../utils/utils';
import gloabalConfig from '../../common/config.global'
import Swiper from 'react-native-swiper';
import SearchBar from '../../components/SearchBar';
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';

export default class ManhuaHome extends Component {
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
        http(`${gloabalConfig.BASEURL}api/recommend`, {
            success: (data) => {
                this.setState({
                    recommend: JSON.parse(data)
                })
            },
            fail: (state) => {
                console.error(state)
            }
        });
    }

    _initSwpierData = () => {
        httpPromise(`${gloabalConfig.BASEURL}api/swipper`).then((data) => {
            this.setState({
                swipers: JSON.parse(data)
            })
        }).catch(err => console.error(err))
    }
    componentDidMount() {
        this.initData();
        this._initSwpierData();
    }

    _searchFucus = () => {
        this.props.navigation.navigate('ManhuaSearch');

    }


    _renderDefault = () => {
        return (
            <ScrollView tabLabel='精选'>
                <View style={{ width: screen.width, height: screen.height / 4}}>
                    <Swiper style={{ width: screen.width, height: screen.height / 4 }}
                        removeClippedSubviews={false}
                        autoplay={true}>
                        {
                            this.state.swipers.map((item, index) => {
                                return (
                                    <TouchableOpacity style={{ height: screen.height / 4, width: screen.width }} onPress={() => this.props.navigation.navigate('ManhuaDetail', {
                                        cover: item
                                    })} key={index}>
                                        <Image source={{ uri: item.imgUrl }} key={index} style={{ flex: 1 }}></Image>
                                    </TouchableOpacity>

                                )
                            })
                        }

                    </Swiper>
                </View>
                {
                    this.state.recommend.map((item, index) => {
                        return (
                            <View key={index} style={{backgroundColor:'#fff',marginTop:getPixel(8)}}>
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
                                    keyExtractor={(item, index1) => index1}
                                />

                            </View>
                        )
                    })
                }
            </ScrollView>
        )
    }
    render() {


        return (
            <View style={styles.container}>
                <StatusBar {...gloabalConfig.statusBar_book}></StatusBar>
                <SearchBar inputConfig={{ editable: false, placeholder: '搜索' }} onPress={this._searchFucus}></SearchBar>
                <ScrollableTabView
                    style={[styles.container]}
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar activeTextColor={'rgb(51,133,255)'} underlineStyle={{ backgroundColor: 'rgb(51,133,255)' }} tabStyle={{backgroundColor:'#fff'}}/>}
                >
                    {/* <ScrollView tabLabel='精选' style={styles.container}>
                
                    </ScrollView> */
                    this._renderDefault()}
                    <ScrollView tabLabel='分类' style={styles.container}>

                    </ScrollView>

                    <ScrollView tabLabel='榜单' style={styles.container}>

                    </ScrollView>
                </ScrollableTabView>
            </View>
        )

    }

    renderRow = ({ item }) => {

        return (
            <TouchableOpacity style={styles.coverWrap}
                onPress={() => this.props.navigation.navigate('ManhuaDetail', {
                    cover: item
                })}>
                <View style={styles.coverItem}>
                    <Image style={styles.itemImage} source={{ uri: item.imgUrl }}></Image>
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