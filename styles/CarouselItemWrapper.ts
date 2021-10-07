import { CarouselItemData } from '../types';

export function wrapperStyle(item: CarouselItemData) {
  const {h, opacity, w, X, Y, zIndex} = item;
  const wrapperStyle = {
    ...(opacity && {opacity}),
    ...(zIndex && {zIndex}),
    ...(Y && {marginTop: Y}),
    ...(X && {marginLeft: X}),
    ...(w && {width: w}),
    ...(h && {height: h}),
    position: 'absolute' as any,
    flex: 1,
    justifyContent: 'center' as any,
    alignItems: 'center' as any,
  };

  return wrapperStyle;
}
