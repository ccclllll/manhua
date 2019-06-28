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
    StatusBar
} from 'react-native';
import { http, getPixel, screen } from '../../utils/utils';
import gloabalConfig from '../../common/config.global'
import SearchBar from '../../components/SearchBar';
export default class ManhuaSearch extends Component{
    constructor(props){
        super(props);
        this.state = {searchText: '',covers:[],errCode:0}
    }

    _search = () => {
        http(`${gloabalConfig.BASEURL}api/search/`+this.state.searchText,{
            success: (covers) => {
                this.setState({covers: JSON.parse(covers)})
            },
            fail: (state) => {
                this.setState({
                    errCode: state
                })
            } 
        })
    }

    _textChange = (search) => {
        this.setState({
            searchText: search
        })
    }

    render() {
        const { searchText } = this.state;

        return(
            <View style={styles.container}>
          
                <View style={styles.searchWrap}>
        
                <SearchBar inputConfig={{placeholder:'搜索',onChangeText: this._textChange,onEndEditing:this._search,editable:true}}></SearchBar>

                    <TouchableOpacity style={styles.searchText} onPress={this._search}>
                        <Text>搜索</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.flatlist}>
                    <FlatList
                        data={this.state.covers}
                        renderItem={this.renderRow}
                        horizontal={false}
                        numColumns={3}
                        keyExtractor={(item,index1)=> index1}
                        />
                </View>
        
            </View>
        )
    }

    renderRow = ({item}) => {
        return(
            <TouchableOpacity style={styles.coverWrap} onPress= {() => this.props.navigation.navigate('ManhuaDetail',{
                                        cover: item
                                    })}>
            <ScrollView style={styles.coverItem}>
                <Image style={styles.itemImage} source={{uri:item.imgUrl}}></Image>
               
                <View style={styles.sectionWrap}>
                <Text style={styles.itemSection}>{item.section}</Text>
                </View>
                <Text>{item.title}</Text>
            </ScrollView>
            </TouchableOpacity>

        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column'
    },
    searchWrap: {
        height: getPixel(60),
        flexDirection: 'row',
        width: screen.width
    },
    flatlist:{
        paddingTop: getPixel(5),
        paddingBottom: getPixel(70)
    },
    search: {
        flex: 1,
        height: getPixel(50),
        backgroundColor: 'transparent',
        borderWidth: 0
    },
    searchText: {
        width: getPixel(40),
        height: getPixel(50),
        flexDirection: 'row',
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