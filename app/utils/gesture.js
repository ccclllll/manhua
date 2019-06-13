import {
    PanResponder,
} from 'react-native';

class SwiperGesture {
    constructor({onLeft,onRight,onLongPress,onPress,onMove}){
        this.beginX = 0;
        this.endX = 0;
        this.onLeft = onLeft;
        this.onRight = onRight;
        this.beginDate = new Date();
        this.endDate = new Date();
        this.onLongPress = onLongPress;
        this.onPress = onPress;
        this.onMove = onMove;
    }

    panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
            return true;
        },
        onMoveShouldSetPanResponder:  (evt, gestureState) => {
            return true;
        },

        // 触摸开始
        onPanResponderGrant: (evt, gestureState) => {
            this.beginX = gestureState.dx
            this.beginDate = new Date();
        },
        onPanResponderMove: (evt, gestureState) => {
            typeof this.onMove === 'function' && (this.onMove(evt,state));
        },

        // 触摸结束
        onPanResponderRelease: (evt, gestureState) => {
            this.endDate = new Date();
            if(this.endDate.getTime() - this.beginDate.getTime() > 500){
                typeof this.onLongPress === 'function' && (this.onLongPress());
            }else{
                typeof this.onPress === 'function' && (this.onPress());
            }
            this.endX = gestureState.dx;
            if(this.endX - this.beginX < -50){
               typeof this.onLeft === 'function' && (this.onLeft());
            }
            if(this.endX - this.beginX > 50){
                typeof this.onRight === 'function' && (this.onRight());
            }
        },
        onPanResponderTerminate: (evt, gestureState) => {
        },
    })

}
export {
    SwiperGesture
}