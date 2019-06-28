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
    DeviceEventEmitter
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { http, getPixel, screen } from '../../utils/utils';
import gloabalConfig from '../../common/config.global'
import { ListItem } from 'react-native-elements';

export default class BookChapter extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const cover = navigation.getParam('cover', '');
        this.state = {
            cover: cover,
            visible: false,
            collet:{},
            book: { chapters: [] }
        }
    }

    componentDidMount() {
        http(`${gloabalConfig.BASEURL}/api/book/acbook?url=${this.state.cover.detailUrl}`, {
            success: (data) => {
                this.setState({
                    book: JSON.parse(data)
                })
            },
            fail: () => {

            }
        });
        DeviceEventEmitter.addListener('back', (data) => {
            if (data.book) {
                this.setState({
                    visible: true
                })
                this.setState({
                    collet:data.book
                })
            }
        })
    }

    _addToBookList = () => {
        this.setState({
            visible:false
        })
        AsyncStorage.getItem('books', (error, res) => {
            if (!error && res) {
                let books = JSON.parse(res);
                if (!books[this.state.collet.cover.title + this.state.collet.cover.author]) {
                    books[this.state.collet.cover.title + this.state.collet.cover.author] = this.state.collet;
                    AsyncStorage.setItem('books', JSON.stringify(books));
                }
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar {...gloabalConfig.statusBarChapter}></StatusBar>

                <FlatList
                    data={this.state.book.chapters}
                    keyExtractor={(item, index) => index + ''}
                    extraData={this.state}
                    renderItem={({ item, index }) => {
                        return (<ListItem title={item.title}
                            onPress={() => this.props.navigation.navigate('BookRead', {
                                page: index,
                                cover: this.state.cover
                            })}
                            rightElement={() => { return (<Icon name={'angle-right'} size={25}></Icon>) }}
                        >
                        </ListItem>)
                    }}>
                </FlatList>

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