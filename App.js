import React from 'react';
import {View, Text, Dimensions, Platform, PanResponder} from 'react-native';

import {Svg, Circle, Rect, Path, Line} from 'react-native-svg';

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
        // console.warn(event.nativeEvent.locationX);
        this.setState({
          endTouchX: event.nativeEvent.locationX.toFixed(2),
          endTouchY: event.nativeEvent.locationY.toFixed(2),
        });
      },
    });
  }

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
    let {startTouchY, startTouchX, endTouchY, endTouchX} = this.state;
    let {height, width} = Dimensions.get('window');
    return (
      <View style={{flex: 1}}>
        <Svg width={width} height={height} position="absolute">
          <Line
            x1={startTouchX}
            y1={startTouchY}
            x2={endTouchX}
            y2={endTouchY}
            strokeWidth="5"
            stroke="blue"
            // onStartShouldSetResponder={ev => true}
            // onMoveShouldSetResponder={ev => true}
            // onResponderGrant={ev => {
            //   this.onTouchEvent(ev, 1, 'both');
            //   return true;
            // }}
            // onResponderMove={ev => {
            //   this.onTouchEvent(ev, 1, 'both');
            //   return true;
            // }}
          />

          {/* <Circle
            x={this.state.line1From.x1}
            y={this.state.line1From.y1}
            stroke="blue"
            strokeWidth="5"
            cx={-4}
            cy={-4}
            r={8}
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
          />
          <Circle
            x={this.state.line1From.x2}
            y={this.state.line1From.y2}
            stroke="blue"
            strokeWidth="5"
            cx={4}
            cy={4}
            r={8}
            onStartShouldSetResponder={ev => true}
            onMoveShouldSetResponder={ev => true}
            onResponderGrant={ev => {
              this.onTouchEvent(ev, 1, 'down');
              return true;
            }}
            onResponderMove={ev => {
              this.onTouchEvent(ev, 1, 'down');
              return true;
            }}
          /> */}
          {/* <Line
            onStartShouldSetResponder={ev => true}
            onMoveShouldSetResponder={ev => true}
            onResponderGrant={ev => {
              this.onTouchEvent(ev, 2, 'from');
              return true;
            }}
            onResponderMove={ev => {
              this.onTouchEvent(ev, 2, 'from');
              return true;
            }}
            x1={this.state.line2From.x1}
            y1={this.state.line2From.y1}
            x2={this.state.line2From.x2}
            y2={this.state.line2From.y2}
            stroke="blue"
            strokeWidth="5"
          /> */}

          {/* <Path
            onStartShouldSetResponder={ev => true}
            onMoveShouldSetResponder={ev => true}
            onResponderGrant={ev => this.onTouchEvent(ev, 1, 'from')}
            onResponderMove={ev => this.onTouchEvent(ev, 1, 'from')}
            d={this.state.roundedRect}
            stroke="none"
            fill="#9D49F2"
            rotation={this.state.range1.rectFromRotation}
            origin={SVG_WIDTH / 2 + ',' + SVG_HEIGHT / 2}
          /> */}
        </Svg>
        <View
          style={{
            height,
            width,
            backgroundColor: 'transparent',
            position: 'absolute',
          }}
          {...this.panResponder.panHandlers}
        />
      </View>
    );
  }
}
