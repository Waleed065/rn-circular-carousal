import { Dimensions, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'transparent',
    width,
    height,
    overflow: 'hidden',

    borderWidth: 2,
    borderColor: 'red',
    alignSelf: 'center',
  },
});

export default styles;
