import React, {
    AsyncStorage
  }from 'react-native';
  export default {
    get(key,success,fail) {
      if(!key) {
        return null;
      }
      key = key.toString();
      AsyncStorage.getItem(key).then((value)=>{
        if(value) {
          let obj = JSON.parse(value)
          success(obj);
        }
      }).catch(()=>{
        fail();
        return null
      })
    },
    set(key, value) {
      if(!key) {
        return;
      }
      key = key.toString();
      AsyncStorage.setItem(key, JSON.stringify(value));
    }
  }