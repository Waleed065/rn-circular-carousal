import { Dimensions, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'transparent',
    width,
    height,
    // alignItems: 'center',
    overflow: 'hidden',

    borderWidth: 2,
    borderColor: 'red',
    alignSelf: 'center',
  },
});

export default styles;
