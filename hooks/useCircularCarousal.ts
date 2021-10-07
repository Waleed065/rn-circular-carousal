import {findIndex, maxBy} from 'lodash/fp';
import {useEffect, useRef, useState} from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderCallbacks,
  PanResponderGestureState,
  PanResponderInstance,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {CarouselItemData, yMarginType} from '../types';
import {
  arrangeItemsInCircle,
  getStyles,
  initializeCarouselItems,
} from '../utils';

const DURATION = 1;
const ROTATION_RATE = 5;
const PAN_ROTATION_RATE = 1;

interface schema {
  radius?: number;
  dataSource: any[];

  style?: ViewStyle;
  itemStyle?: StyleProp<any>;
}

export default function useCircularCarousal({
  radius = 100,
  dataSource,

  style,
  itemStyle,
}: schema) {
  const {wH, itemWH} = getStyles({
    style,
    itemStyle,
  });

  const initialItems: CarouselItemData[] = initializeCarouselItems(
    radius,
    wH.width,
    itemWH,
    dataSource,
  );
  const [items, setItems] = useState<CarouselItemData[]>(initialItems);
  const [frontItemIndex, setFrontItemIndex] = useState(0);
  const [yMargins, setYMargins] = useState<yMarginType>({
    min: items[items.length - 1].Y ?? 0,
    max: items[0].Y ?? 0,
  });

  const panResponderRef = useRef<PanResponderInstance | {panHandlers: unknown}>(
    {
      panHandlers: {},
    },
  );

  useEffect(() => {
    const addPanGesture = () => {
      const panResponderCallbacks: PanResponderCallbacks = {
        onMoveShouldSetPanResponder: (
          _: GestureResponderEvent,
          gestureState: PanResponderGestureState,
        ) =>
          // Since we want to handle presses on individual items as well
          // Only start the pan responder when there is some movement
          items.length > 1 && Math.abs(gestureState.dx) > 10,

        onPanResponderMove: (
          _: GestureResponderEvent,
          gestureState: PanResponderGestureState,
        ) => {
          // const {frontItemIndex, yMargins, items} = this.state;
          const angle =
            (gestureState.moveX - gestureState.x0) * PAN_ROTATION_RATE;

          arrangeItems(angle, frontItemIndex, yMargins, items);
        },

        onPanResponderRelease: () => {
          const maxYItem = maxBy('Y')(items as any) ?? 0;
          const frontItemIndex = findIndex(maxYItem)(items as any);

          rotateCarousel(frontItemIndex);
        },
      };
      const newPanResponder: PanResponderInstance = PanResponder.create(
        panResponderCallbacks,
      );
      panResponderRef.current = newPanResponder;
    };

    arrangeItems(0, 0, yMargins, items);
    addPanGesture();
  }, []);

  // const isMounted = useRef(false);
  // useEffect(() => {
  //   if (!isMounted.current) {
  //     isMounted.current = true;
  //     return;
  //   }

  //   if (dataSource.length < 1) {
  //     setItems([]);
  //   }
  //   // else if (hasPropChanged('dataSource', props, nextProps)) {

  //   // const newStyle = getStyles({style, itemStyle});
  //   const items: CarouselItemData[] = initializeCarouselItems(
  //     radius,
  //     newStyle.width,
  //     newItemStyle,
  //     dataSource,
  //   );
  //   const yMargins = {
  //     min: items[items.length - 1].Y ?? 0,
  //     max: items[0].Y ?? 0,
  //   };

  //   arrangeItems(0, 0, yMargins, items);
  //   // }
  // }, [props]);

  const arrangeItems = (
    angle: number,
    frontItemIdx: number,
    yM: yMarginType,
    prevItems: CarouselItemData[],
  ): void => {
    // const {radius = 0} = props;

    const arrangedItems = arrangeItemsInCircle(
      frontItemIdx,
      angle,
      radius,
      wH.width,
      itemWH,
      yM,
      prevItems,
    );

    setYMargins(yM);
    setFrontItemIndex(frontItemIdx);
    setItems(arrangedItems);
  };

  const rotateCarousel = (activeItem: number): void => {
    // const {yMargins, items} = this.state;
    const cAngle = items[activeItem].angle ?? 0;
    let rotationAngle = (360 - cAngle) % 360;

    if (rotationAngle > 180) {
      rotationAngle = rotationAngle - 360;
    } // make angle negative

    const rotateItems = (i: number) => {
      const ang = (rotationAngle < 0 ? -ROTATION_RATE : ROTATION_RATE) * i++;

      if (Math.abs(ang) > Math.abs(rotationAngle)) {
        arrangeItems(0, activeItem, yMargins, items);
        return;
      }
      arrangeItems(cAngle + ang, activeItem, yMargins, items);

      setTimeout(() => {
        rotateItems(i);
      }, DURATION);
    };

    rotateItems(1);
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

  return {
    items,
    frontItemIndex,
    panHandlersRef: panResponderRef.current.panHandlers,
    rotateCarousel,
  };
}
