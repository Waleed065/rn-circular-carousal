import findIndex from 'lodash/fp/findIndex';
import maxBy from 'lodash/fp/maxBy';
import * as React from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderCallbacks,
  PanResponderGestureState,
  PanResponderInstance,
  Platform,
  View
} from 'react-native';
// src
import {
  CarouselItemData,
  CircularCarouselProps,
  CircularCarouselState
} from '../../types';
import {
  arrangeItemsInCircle,
  getStyles,
  // hasPropChanged,
  initializeCarouselItems
} from '../../utils';
import CarouselItemWrapper from '../CarouselItemWrapper';

export default class CircularCarousel extends React.Component<
  CircularCarouselProps,
  CircularCarouselState
> {
  panResponder: PanResponderInstance | {panHandlers: unknown} = {
    panHandlers: {},
  };

  static defaultProps = {
    radius: 100,
  };

  constructor(props: CircularCarouselProps) {
    super(props);
    // props
    const {dataSource, radius = 0} = props;

    const {style, itemStyle} = getStyles(props);
    const items: CarouselItemData[] = initializeCarouselItems(
      radius,
      style.width,
      itemStyle,
      dataSource,
    );

    this.state = {
      items,
      frontItemIndex: 0,
      yMargins: {min: items[items.length - 1].Y ?? 0, max: items[0].Y ?? 0},
      isDragging: false,
      itemLayout: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    };
  }

  UNSAFE_componentWillMount() {
    console.log("called");
    const {yMargins, items} = this.state;
    this.arrangeItemsInCircle(0, 0, yMargins, items);
    this.addPanGesture();
  }

  // UNSAFE_componentWillReceiveProps(nextProps: CircularCarouselProps) {
  //   const {dataSource, radius = 0} = nextProps;
  //   if (dataSource.length < 1) {
  //     // console.log('Na')
  //     this.setState(() => ({items: []}));
  //   } 
  //   else if (hasPropChanged('dataSource', this.props, nextProps)) {
  //     console.log('Done');
  //     const {style, itemStyle} = getStyles(nextProps);
  //     const items: CarouselItemData[] = initializeCarouselItems(
  //       radius,
  //       style.width,
  //       itemStyle,
  //       dataSource,
  //     );
  //     const yMargins = {
  //       min: items[items.length - 1].Y ?? 0,
  //       max: items[0].Y ?? 0,
  //     };

  //     this.arrangeItemsInCircle(0, 0, yMargins, items);
  //   }
  // }

  arrangeItemsInCircle(
    angle: number,
    frontItemIndex: number,
    yMargins: {min: number; max: number},
    prevItems: CarouselItemData[],
  ): void {
    const {radius = 0} = this.props;
    const {
      style: {width: containerWidth},
      itemStyle,
    } = getStyles(this.props);
    const arrangedItems = arrangeItemsInCircle(
      frontItemIndex,
      angle,
      radius,
      containerWidth,
      itemStyle,
      yMargins,
      prevItems,
    );

    this.setState(() => ({
      yMargins,
      frontItemIndex,
      items: arrangedItems,
    }));
  }

  rotateCarousel = (activeItem: number): void => {
    const {yMargins, items} = this.state;
    const cAngle = items[activeItem].angle ?? 0;
    let rotationAngle = (360 - cAngle) % 360;

    if (rotationAngle > 180) {
      rotationAngle = rotationAngle - 360;
    } // make angle negative

    const rotateItems = (i: number) => {
      const ang = (rotationAngle < 0 ? -ROTATION_RATE : ROTATION_RATE) * i++;

      if (Math.abs(ang) > Math.abs(rotationAngle)) {
        this.arrangeItemsInCircle(0, activeItem, yMargins, items);
        return;
      }
      this.arrangeItemsInCircle(cAngle + ang, activeItem, yMargins, items);

      setTimeout(() => {
        rotateItems(i);
      }, DURATION);
    };

    rotateItems(1);
  };

  addPanGesture() {
    const panResponderCallbacks: PanResponderCallbacks = {
      onMoveShouldSetPanResponder: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) =>
        // Since we want to handle presses on individual items as well
        // Only start the pan responder when there is some movement
        this.state.items.length > 1 && Math.abs(gestureState.dx) > 10,

      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const {frontItemIndex, yMargins, items} = this.state;
        const angle =
          (gestureState.moveX - gestureState.x0) * PAN_ROTATION_RATE;

        this.arrangeItemsInCircle(angle, frontItemIndex, yMargins, items);
      },

      onPanResponderRelease: () => {
        const {items} = this.state;
        const maxYItem = maxBy('Y')(items as any) ?? 0;
        const frontItemIndex = findIndex(maxYItem)(items as any);

        this.rotateCarousel(frontItemIndex);
      },
    };
    const panResponder: PanResponderInstance = PanResponder.create(
      panResponderCallbacks,
    );
    this.panResponder = panResponder;
  }

  handleItemPress = (index: number): void => {
    const {frontItemIndex} = this.state;
    const {onItemPress} = this.props;

    if (index === frontItemIndex && onItemPress) {
      onItemPress(index);
      return;
    }

    this.rotateCarousel(index);
  };

  handleItemDrop = (index: number): void => {
    const {onItemDrop} = this.props;

    if (onItemDrop) {
      onItemDrop(index);
    }
  };

  // handleItemLayoutChange = event => {
  //   const { layout } = event.nativeEvent;
  //   const { itemLayout, items } = this.state;

  //   if (
  //     !inRange(itemLayout.width - 5, itemLayout.width + 5)(layout.width) ||
  //     !inRange(itemLayout.height - 5, itemLayout.height + 5)(layout.height)
  //   ) {
  //     console.log(items[0], layout);

  //     this.setState(() => ({ itemLayout: layout }));
  //   }
  // };

  setItemDraggingState = (isDragging: boolean) => {
    if (isDragging !== this.state.isDragging) {
      this.setState(() => ({isDragging}));
    }
  };

  render() {
    const {items, frontItemIndex, isDragging} = this.state;
    const {
      style = {},
      dropAreaLayout,
      renderItem,
      onItemDrop,
      setItemCollision,
    } = this.props;
    const panHandlers = isDragging ? {} : this.panResponder.panHandlers;

    return (
      <View style={[styles.containerStyle, style]} {...panHandlers}>
        {items.map(({data, ...item}, index) => (
          <CarouselItemWrapper
            key={index}
            isDraggable={
              frontItemIndex === index &&
              Boolean(onItemDrop) &&
              Boolean(dropAreaLayout)
            }
            data={data}
            item={item}
            dropAreaLayout={dropAreaLayout}
            renderItem={renderItem}
            onItemPress={() => this.handleItemPress(index)}
            onItemDrop={() => this.handleItemDrop(index)}
            // onItemLayoutChange={this.handleItemLayoutChange}
            setItemDraggingState={this.setItemDraggingState}
            setItemCollision={setItemCollision}
          />
        ))}
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: 'transparent',
    width: 300,
    height: 200,
    overflow: 'hidden',
  },
};

const DURATION = Platform.OS === 'ios' ? 1 : 0;
const ROTATION_RATE = Platform.OS === 'ios' ? 5 : 5;
const PAN_ROTATION_RATE = 1;
