/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Bookrack from './app/pages/Bookrack';
import BookHome from './app/pages/book/BookHome';
import BookRead from './app/pages/book/BookRead';
import BookDetail from './app/pages/book/BookDetail';
import BookSearch from './app/pages/book/BookSearch';
import ManhuaHome from './app/pages/manhua/ManhuaHome';
import ManhuaDetail from './app/pages/manhua/ManhuaDetail';
import ManhuaRead from './app/pages/manhua/ManhuaRead';
import ManhuaSearch from './app/pages/manhua/ManhuaSearch';
import { Text } from 'react-native-elements';
import {DeviceEventEmitter} from 'react-native'
import BookChapter from './app/pages/book/BookChapter';
import ManhuaChapter from './app/pages/manhua/BookChapter';
const TabOptions = (tabBarTitle, tabBarIconName) => {
  const title = tabBarTitle;
  const tabBarIcon = (({ tintColor, focused }) => {
    return (
      <FontAwesome name={tabBarIconName} size={25} color={tintColor} />
    )
  });
  const tabBarVisible = true;
  return { title, tabBarIcon, tabBarVisible };
};

const MainTabNavigator = createBottomTabNavigator({
  Home: {
    screen: Bookrack,
    navigationOptions: ()=> TabOptions('首页', 'home'),
  },
  ManhuaHome: {
    screen: ManhuaHome,
    navigationOptions: ()=> TabOptions('漫画', 'magic'),
  },
  BookHome: {
    screen: BookHome,
    navigationOptions: ()=> TabOptions('小说', 'book'),
  }
}, {
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    defaultNavigationOptions:{
      tabBarOnPress:({navigation,defaultHandler})=>{
        const { routeName } = navigation.state;
        if(routeName==='Home'){
          // 触发监听事件 通知bookcrack页面刷新
          DeviceEventEmitter.emit('goBookrack',{});
        }
        // 执行默认处理方法
        defaultHandler();
      }
    }
    // defaultNavigationOptions: ({ navigation }) => ({
    //   tabBarIcon: ({ focused, horizontal, tintColor }) => {
    //     const { routeName } = navigation.state;
    //     let iconName;
    //     if (routeName === 'Home') {
    //       iconName = 'home';
    //     } else if (routeName === 'ManhuaHome') {
    //       iconName = 'search';
    //     } else if (routeName === 'BookHome') {
    //       iconName = 'book'
    //     }

    //     // You can return any component that you like here!
    //     return <FontAwesome name={iconName} size={25} color={tintColor} />;
    //   }
    // }),
    // tabBarOptions: {
    //   activeTintColor: 'rgb(51,133,255)',
    //   inactiveTintColor: 'gray',
    // },
  });

const AppNavigator = createStackNavigator({
  Main: {
    screen: MainTabNavigator
  },
  BookHome: {
    screen: BookHome
  },
  BookRead: {
    screen: BookRead
  },
  BookDetail: {
    screen: BookDetail
  },
  BookSearch: {
    screen: BookSearch
  },
  BookChapter:{
    screen: BookChapter
  },
  ManhuaHome: {
    screen: ManhuaHome
  },
  ManhuaDetail: {
    screen: ManhuaDetail
  },
  ManhuaRead: {
    screen: ManhuaRead
  },
  ManhuaSearch: {
    screen: ManhuaSearch
  },
  ManhuaChapter:{
    screen:ManhuaChapter
  },
  Bookcrak: {
    screen: Bookrack
  }
}, {
    mode: 'modal',
    headerMode: 'none',
    initialRouteName: "Main",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#EDEBE7',
        elevation: 0
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  });




export default createAppContainer(AppNavigator);