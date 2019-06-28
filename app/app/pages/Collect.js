import React, {
    Component
} from 'react';
import {
    StyleSheet,
    Button,
    View,
    Text,
    Dimensions,
    Platform,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    AsyncStorage,
    RefreshControl
} from 'react-native';
import { http, getPixel, screen } from '../utils/utils';
import { SearchBar } from 'react-native-elements';
import { SceneView } from 'react-navigation';

export default class Collect extends Component{
    constructor(props){
        super(props);
        this.state = {history: [],refreshing: false}
        //this.state = {history: AsyncStorage.getItem('history') || [] }

    }

    componentDidMount(){
        this.history();
    }

    history = () => {
        this.setState({refreshing: true})
        AsyncStorage.getItem('history',(error,result)=>{
            if(!error&&result){
                this.setState({
                    history: JSON.parse(result),
                    refreshing: false
                })
            }
        })
    }
    _onRefresh = ()=> {
        this.history();
    }

    render() {
        return(
            <View style={styles.container}>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        />
                    }>                      
                    <View style={{height: getPixel(30)}}>
                        <Text style={{lineHeight: getPixel(30)}}>阅读历史</Text>
                    </View>
                    {
                        this.state.history.map((item,index)=>{
                            return (
                                <TouchableOpacity onPress= {() => this.props.navigation.navigate('Book',{
                                    cover: item.book,index: item.index})} style={styles.bookItem} key={index}>
                                    <View style={styles.bookItem}>
                                        <View style={{height:getPixel(150),width: screen.width/2.5}}>
                                            <Image source={{uri: item.book.imgUrl}} style={{height:getPixel(150),width: screen.width/2.5}}></Image>
                                        </View>
                                        <View style={{height:getPixel(150),width: screen.width-screen.width/2.5}}>
                                            <Text>{item.book.title}</Text>
                                            <Text>更新至:{item.book.section}</Text>
                                        </View> 
                                    </View>
                                </TouchableOpacity>
       
                            )
                        })
                    }

                </ScrollView>
        
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container:{ 
        flex: 1,
        paddingTop: getPixel(20),
        flexDirection: 'column'
    },
    bookItem: {
        width: screen.width,
        height: getPixel(150),
        flexDirection: 'row',
    }
})