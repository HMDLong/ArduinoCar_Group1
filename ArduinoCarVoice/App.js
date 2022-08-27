/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  ImageBackground
} from 'react-native';
import Bluetooth from './src/components/bluetooth/bluetooth';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showBluetooth: false
    }
  }

  render() {
    return (
      <View style={{flex: 1, 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    backgroundColor: '#F5FCFF'}}>
        <ImageBackground
          source={{uri: 'https://drive.google.com/file/d/1SX0-JZHIljm75RJt7b-CW-m7m0oB7YZw/view?usp=sharing'}}
          resizeMode="cover"
          style={{flex: 1, justifyContent: 'center'}}>
          <Bluetooth />
        </ImageBackground>
      </View>
    );
  }
}

export default App;
