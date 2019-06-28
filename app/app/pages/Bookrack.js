/**
 * 书架
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
    AsyncStorage,
    StatusBar,
    DeviceEventEmitter
} from 'react-native';

import { http, getPixel, screen } from '../utils/utils';
import gloabalConfig from '../common/config.global'
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';




export default class Bookrack extends Component {
    constructor(props) {
        super(props);
        this.state = { history: [], refreshing: false, books: [],manhuas:[]}
        //this.state = {history: AsyncStorage.getItem('history') || [] }

        this._getCollets();
        this._getManhuas();
    }

    componentDidMount() {
        //this.history();
        DeviceEventEmitter.addListener('goBookrack', () => {
            //this.history();
            this._getCollets();
            this._getManhuas();
        })
        DeviceEventEmitter.addListener('back', () => {
            //this.history();
            this._getCollets();
            this._getManhuas();
        })
    }

    history = () => {

        this.setState({ refreshing: true })
        AsyncStorage.getItem('history', (error, result) => {
            if (!error && result) {
                this.setState({
                    history: JSON.parse(result),
                    refreshing: false
                })
            }
        })
    }


    _getManhuas = () =>{
        AsyncStorage.getItem('manhuas', (error, res) => {

            if (!error && res) {
                let bookObj = JSON.parse(res);
                let books = [];
                for (key in bookObj) {
                    books.push(bookObj[key])
                }

                books = books.sort((a,b)=>{
                    return b.readTime - a.readTime
                })
                this.setState({
                    manhuas: books
                })
            } else if (!res) {
                AsyncStorage.setItem('manhuas', JSON.stringify({}));
            }
        })
    }
    _getCollets = () => {

        // console.error(JSON.stringify(localStorage.get('books')))
        // localStorage.get('books',(data)=>{console.error(JSON.stringify(data))},()=>{
        //     localStorage.set('books',{});
        // })
        AsyncStorage.getItem('books', (error, res) => {
            if (!error && res) {
                let bookObj = JSON.parse(res);
                let books = [];
                for (key in bookObj) {
                    books.push(bookObj[key])
                }

                books = books.sort((a,b)=>{
                    return b.readTime - a.readTime
                })
                this.setState({
                    books: books
                })
            } else if (!res) {
                AsyncStorage.setItem('books', JSON.stringify({}));
            }
        })

    }

    renderManhuaRow = ({ item, index }) => {

        return (
            <TouchableOpacity style={styles.listItem} onPress={() => this.props.navigation.navigate('ManhuaDetail', {
                cover: item.cover, index: item.index
            })}>
                <View style={styles.listItem}>
                    <Image source={{ uri: item.cover.imgUrl }} style={styles.itemImage}></Image>
                    <Text>{item.cover.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderBookRow = ({ item, index }) => {

        return (
            <TouchableOpacity style={styles.listItem} onPress={() => this.props.navigation.navigate('BookDetail', {
                cover: item.cover, index: item.index
            })}>
                <View style={styles.listItem}>
                    <Image source={{ uri: item.cover.imgUrl }} style={styles.itemImage}></Image>
                    <Text>{item.cover.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar {...gloabalConfig.statusBar_book}></StatusBar>
                <ScrollableTabView
                    style={styles.container}
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar activeTextColor={'rgb(51,133,255)'} underlineStyle={{ backgroundColor: 'rgb(51,133,255)' }} />}
                >
                    <ScrollView tabLabel='小说'>
                        <ScrollView tabLabel='漫画' style={styles.listWrap}>
                            <FlatList
                                data={this.state.books}
                                renderItem={this.renderBookRow}
                                horizontal={false}
                                numColumns={3}
                                keyExtractor={(item, index) => index}
                                style={styles.listWrap} />
                        </ScrollView>
                    </ScrollView>

                    <ScrollView tabLabel='漫画' style={styles.listWrap}>
                        <FlatList
                            data={this.state.manhuas}
                            renderItem={this.renderManhuaRow}
                            horizontal={false}
                            numColumns={3}
                            keyExtractor={(item, index) => index}
                            style={styles.listWrap} />
                    </ScrollView>
                </ScrollableTabView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listWrap: {
        flex: 1
    },
    listItem: {
        width: screen.width / 3,
        height: getPixel(150),
        flexDirection: 'column',
        paddingRight: getPixel(5),
        paddingLeft: getPixel(5),
        paddingTop: getPixel(5)
    },
    itemImage: {
        width: screen.width / 3 - getPixel(10),
        height: getPixel(120),
    }
})