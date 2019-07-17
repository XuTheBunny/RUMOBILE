import React from 'react';
import { SafeAreaView, View, Text, Image } from 'react-native';

const NotificationBar = props => {
  return (
    <View style={[styles.containerStyle, { backgroundColor: props.color }]}>
      <Text style={styles.text}>{props.text}</Text>
      <Image
        style={{ height: 36, width: 34 }}
        source={require('../images/Notification/justKumaFace.png')}
      />
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    zIndex: 1,
    width: '100%',
    position: 'absolute',
    paddingTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text: {
    marginLeft: 10,
    color: 'white',
  },
};

export default NotificationBar;
