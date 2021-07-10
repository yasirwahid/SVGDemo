import React from 'react';
import {
  View,
  Text,
  Dimensions,
  Platform,
  PanResponder,
  TouchableOpacity,
} from 'react-native';

import {Svg, Circle, Rect, Path, Line} from 'react-native-svg';
import Video from 'react-native-video';

const SVG_WIDTH = 280;
const SVG_HEIGHT = 280;
const CLOCK_RADIUS = 120;

export default class App extends React.Component {
  constructor() {
    super();
    this.panResponder;
    this.state = {
      windowWidth: Dimensions.get('window').width,
      windowHeight: Dimensions.get('window').height,
      statusBarHeight: 0,
      fontLoaded: false,

      roundedRect:
        'M ' +
        (SVG_WIDTH / 2 - CLOCK_RADIUS + 5) +
        ',' +
        (SVG_HEIGHT / 2 - 5) +
        ' h ' +
        (25 - 10) +
        ' a10,5 0 0 1 5,5 ' +
        ' a10,5 0 0 1 -5,5 ' +
        ' h ' +
        (-25 + 10) +
        ' a10,5 0 0 1 -5,-5 ' +
        ' a10,5 0 0 1 5,-5 z',

      svg: {
        x: 0,
        y: 0,
        width: SVG_WIDTH,
        height: SVG_HEIGHT,
      },
      line: {
        x1: SVG_WIDTH / 2,
        y1: SVG_WIDTH / 2,
        x2: SVG_WIDTH / 2 - CLOCK_RADIUS,
        y2: SVG_HEIGHT / 2,
      },
      lineRadians: 0,

      line1From: {
        x1: 120,
        y1: 120,
        x2: 180,
        y2: 180,
      },
      line2From: {
        x1: 140,
        y1: 140,
        x2: 190,
        y2: 190,
      },

      ranges: [],
      range1: {
        from: '',
        to: '',
        opacity: 0,
        path: '',
        rectFromRotation: 0,
        rectToRotation: 0,
      },

      line1FromIsOverlapped: false,
      line1ToIsOverlapped: false,
      line2FromIsOverlapped: false,
      line2ToIsOverlapped: false,

      plusWidth: 40,
      plusHeight: 40,

      startTouchX: 0,
      startTouchY: 0,

      endTouchX: 0,
      endTouchY: 0,

      data: [],
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => {
        // console.warn(event.nativeEvent.locationX);
        this.setState({
          startTouchX: event.nativeEvent.locationX.toFixed(2),
          startTouchY: event.nativeEvent.locationY.toFixed(2),
          endTouchX: event.nativeEvent.locationX.toFixed(2),
          endTouchY: event.nativeEvent.locationY.toFixed(2),
        });
      },
      onMoveShouldSetPanResponder: (event, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => false,
      onPanResponderGrant: (event, gestureState) => false,
      onPanResponderMove: (event, gestureState) => {
        this.setState({
          endTouchX: event.nativeEvent.locationX.toFixed(2),
          endTouchY: event.nativeEvent.locationY.toFixed(2),
        });
      },
      onPanResponderRelease: (event, gestureState) => {
        console.log(event.nativeEvent);
        let data = [
          ...this.state.data,
          {
            endTouchX: event.nativeEvent.locationX.toFixed(2),
            endTouchY: event.nativeEvent.locationY.toFixed(2),
            startTouchX: this.state.startTouchX,
            startTouchY: this.state.startTouchY,
          },
        ];
        this.setState({
          endTouchX: 0,
          endTouchY: 0,
          startTouchY: 0,
          startTouchX: 0,
          data,
        });
      },
    });
  }

  undo = () => {
    let {data} = this.state;
    data.pop();
    this.setState({data});
  };

  // onTouchEvent = (ev, rangeNo, type) => {
  //   let {line1From} = this.state;
  //   let line = {};
  //   if (type == 'up') {
  //     line = {
  //       ...line1From,
  //       x1: ev.nativeEvent.locationX,
  //       y1: ev.nativeEvent.locationY,
  //     };
  //   } else if (type == 'down') {
  //     line = {
  //       ...line1From,
  //       x2: ev.nativeEvent.locationX,
  //       y2: ev.nativeEvent.locationY,
  //     };
  //   } else {
  //     let xdiff = line1From.x2 - line1From.x1;
  //     let ydiff = line1From.y2 - line1From.y1;

  //     line = {
  //       x1: ev.nativeEvent.locationX,
  //       y1: ev.nativeEvent.locationY,
  //       x2: ev.nativeEvent.locationX + xdiff,
  //       y2: ev.nativeEvent.locationX + ydiff,
  //     };
  //   }
  //   this.setState({line1From: line});
  // };

  render() {
    let {startTouchY, startTouchX, endTouchY, endTouchX, data} = this.state;
    let {height, width} = Dimensions.get('window');
    return (
      <View style={{flex: 1}}>
        <Video
          source={{
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
          style={{width, height, position: 'absolute'}}
          resizeMode="stretch"
          controls={true}
          co
        />
        <Svg width={width} height={height - 50} position="absolute">
          {data.map(val => {
            return (
              <>
                <Line
                  x1={val.startTouchX}
                  y1={val.startTouchY}
                  x2={val.endTouchX}
                  y2={val.endTouchY}
                  strokeWidth="5"
                  stroke="blue"
                />
                {/* 
                <Circle
                  x={endTouchX}
                  y={endTouchY}
                  stroke="blue"
                  strokeWidth="5"
                  cx={-4}
                  cy={-4}
                  r={38}
                  onStartShouldSetResponder={ev => true}
                  onMoveShouldSetResponder={ev => true}
                  onResponderGrant={ev => {
                    this.onTouchEvent(ev, 1, 'up');
                    return true;
                  }}
                  onResponderMove={ev => {
                    this.onTouchEvent(ev, 1, 'up');
                    return true;
                  }}
                /> */}
              </>
            );
          })}
          <Line
            x1={startTouchX}
            y1={startTouchY}
            x2={endTouchX}
            y2={endTouchY}
            strokeWidth="5"
            stroke="blue"
          />
        </Svg>
        <View
          style={{
            height: height - 50,
            width,
            backgroundColor: 'transparent',
            // position: 'absolute',
          }}
          {...this.panResponder.panHandlers}
        />
        <View
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
          }}>
          <TouchableOpacity
            onPress={() => this.undo()}
            style={{paddingHorizontal: 10, paddingVertical: 10, margin: 20}}>
            <Text>undo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
