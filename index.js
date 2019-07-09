import React, { Component } from 'react';
import { StyleSheet, View, PanResponder, Text, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import dp2px from '../../../../utils/util';

const marginLeft = 30;
const marginRight = 30;
const roundSize = 30; // 圆的大小
const { width } = Dimensions.get('window'); // 设备宽度
const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginLeft: 30,
    marginRight: 30,
  },
  progressContainer: {
    backgroundColor: 'rgba(55,202,210,1)',
    height: 4,
  },
  circle: {
    position: 'absolute',
    width: roundSize,
    height: roundSize,
    borderRadius: roundSize / 2,
    borderColor: 'rgba(217,217,217,1)',
    borderWidth: dp2px(1),
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowRadius: 5,
    shadowOpacity: 0.9,
    backgroundColor: 'white',
  },
});

export default class RangeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: marginLeft, // 起始坐标
      end: width - roundSize - marginRight, // 结束坐标
      range: this.props.range, // 最大价格
      endPrice: '不限', // 结束价格
      startPrice: 0, // 起始价格
    };
    this.init();
  }

  static getDerivedStateFromProps(props, state) {
    console.log('RangeSelect: getDerivedStateFromProps()');
    const { start, end, endPrice, startPrice } = props;
    return { start, end, endPrice, startPrice };
  }

  componentDidMount() {
    console.log('RangeSelect: componentDidMount()');
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('RangeSelect: shouldComponentUpdate()');
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('RangeSelect: componentDidUpdate()');
  }

  init = () => {
    console.log('RangeSelect: init()');
    this.panResponderStart = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.forceUpdate();
      },
      onPanResponderMove: (evt, gestureState) => {
        // 开始的拖动事件
        const { end, range } = this.state;
        let start = gestureState.moveX; // 当前拖动所在的坐标
        console.log(`width: ${width}, end: ${end}, range: ${range}, start: ${start}`);

        if (start < 10 + marginLeft) {
          // 到起始阀值，置为0
          start = marginLeft;
        }
        if (end - roundSize < start) {
          // 保证开始价格不会超过结束价格
          start = end - roundSize;
        }
        if (start > width - roundSize) {
          // 保证开始价格不会超过最大值
          start = width - roundSize;
        }
        let startPrice = Math.floor(
          ((start - marginLeft) / (width - marginLeft - marginRight - roundSize)) * range
        ); // 计算开始价格显示值
        if (start === marginLeft) {
          startPrice = 0;
        }
        this.setState({
          start,
          startPrice,
        });
        this.props.onPriceChange(start, end, startPrice, this.state.endPrice);
      },
      onPanResponderRelease: (evt, gestureState) => true,
      onPanResponderTerminate: (evt, gestureState) => true,
    });
    this.panResponderEnd = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.forceUpdate();
      },
      onPanResponderMove: (evt, gestureState) => {
        // 结束的拖动事件
        const { start, range } = this.state;
        let end = gestureState.moveX;

        console.log(`width: ${width}, end: ${end}, range: ${range}, start: ${start}`);

        if (end < start + roundSize) {
          end = start + roundSize;
        }
        if (end > width - roundSize - marginRight) {
          end = width - roundSize - marginRight;
        }
        const endPrice =
          Math.floor(
            ((end - marginLeft) / (width - roundSize - marginLeft - marginRight)) * range
          ) >
          range - 1
            ? '不限'
            : Math.floor(
                ((end - marginLeft) / (width - roundSize - marginLeft - marginRight)) * range
              );
        this.setState({
          end,
          endPrice,
        });
        this.props.onPriceChange(start, end, this.state.startPrice, endPrice);
      },
      onPanResponderRelease: (evt, gestureState) => true,
      onPanResponderTerminate: (evt, gestureState) => true,
    });
  };

  render() {
    const { start, end, range, startPrice, endPrice } = this.state;
    console.log(
      `RangeSelect: render(), startPrice: ${startPrice}, endPrice: ${endPrice}, end: ${end}, range: ${range}, start: ${start}`
    );
    return (
      <View style={styles.container}>
        <View style={[{ position: 'absolute' }, { left: start - marginLeft }, { top: -3 }]}>
          <Text>￥{startPrice}</Text>
        </View>
        <View style={[{ position: 'absolute' }, { left: end - marginLeft }, { top: -3 }]}>
          <Text>{endPrice !== '不限' ? `￥${endPrice}` : endPrice}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={[
              styles.progressContainer,
              { backgroundColor: '#eee' },
              { width: start - marginLeft },
            ]}
          />
          <View style={[styles.progressContainer, { width: width - start - (width - end) }]} />
          <View
            style={[
              styles.progressContainer,
              { backgroundColor: '#eee' },
              { width: width - end - marginRight },
            ]}
          />
        </View>
        <View
          style={[styles.circle, { left: start - marginLeft }]}
          {...this.panResponderStart.panHandlers}
        />
        <View
          style={[styles.circle, { left: end - marginLeft }]}
          {...this.panResponderEnd.panHandlers}
        />
      </View>
    );
  }
}

RangeSelect.propTypes = {
  range: PropTypes.number,
};

RangeSelect.defaultProps = {
  range: 1000,
};
