import React from 'react';
import Voice from '@react-native-voice/voice';
import {
    Text,
    View,
    TouchableHighlight,
    Image,
    StyleSheet,
} from 'react-native'

export default class SpeechRecognizer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            recognized: '',
            pitch: '',
            error: '',
            end: '',
            started: '',
            results: [],
            partialResults: [],
            res: 'none',
            status: 'Idle'
        }
        Voice.onSpeechStart = this.onSpeechStart;
        Voice.onSpeechEnd = this.onSpeechEnd;
        Voice.onSpeechRecognized = this.onSpeechRecognized;
        Voice.onSpeechError = this.onSpeechError;
        Voice.onSpeechResults = this.onSpeechResults;
        Voice.onSpeechPartialResults = this.onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
    }

    // async componentDidMount(){
    //     console.log(await Voice.getSpeechRecognitionServices());
    //     console.log(await Voice.isAvailable());
    // }
    
    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
    }

    onSpeechStart = (e) => {
        console.log('onSpeechStart: ', e);
        this.setState({
            recognized: 'o',
            status: 'Recognizing'
        });
    }

    onSpeechEnd = (e) => {
        console.log('onSpeechEnd: ', e);
        this.setState({
            end: 'o',
            status: 'Speech ended. Processing'
        });
    }

    onSpeechError = (e) => {
        console.log('onSpeechError: ', e);
        this.setState({
            error: JSON.stringify(e.error),
            status: 'Error'
        });
    }

    onSpeechResults = async (e) => {
        const cmd = this.props.reduceToCmd(e.value);
        console.log('onSpeechResult: ' + e);
        this.setState({
            results: e.value,
            res: cmd,
            status: 'Done recognizing'
        });
        const cmdCode = this.props.mapToCmd(cmd);
        this.props.setCommandCode(cmdCode)
        await this.props.sendData(cmdCode);
    }

    onSpeechRecognized = (e) => {
        console.log('onSpeechRecognized: ', e);
        this.setState({
            recognized: 'o',
        });
    };

    onSpeechPartialResults = (e) => {
        console.log('onSpeechPartialResult: ' + e);
        this.setState({
            partialResults: e.value,
            res: this.props.reduceToCmd(e.value),
            status: 'Done partial recognizing'
        });
    }

    onSpeechVolumeChanged = (e) => {
        console.log('onSpeechVolumeChanged: ' + e);
        this.setState({
            pitch: e.value,
        });
    }

    _startRecognizing = async () => {
        this.setState({
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: '',
            status: 'Recognizing',
            res: 'none'
        });

        try {
            await Voice.start('en-US');
        } catch (e) {
            console.error(e);
        }
    };

    _stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    _cancelRecognizing = async () => {
        try {
            await Voice.cancel();
        } catch (e) {
            console.error(e);
        }
    };

    _destroyRecognizer = async () => {
        try {
            await Voice.destroy();
        } catch (e) {
            console.error(e);
        }
        this.setState({
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: '',
            status: 'Idle',
            res: 'none'
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 24, justifyContent: 'center', marginBottom: 30}}>{this.state.res}</Text>
                <Text style={{fontSize: 16, justifyContent: 'center', marginTop: 10, marginBottom: 10}}>{this.state.status}</Text>
                <TouchableHighlight style={styles.roundButton} onPress={this._startRecognizing}>
                    <Image style={styles.button} source={require('./button.png')} />
                </TouchableHighlight>
                <View style={{flexDirection: 'row'}}>
                    <TouchableHighlight onPress={this._stopRecognizing}>
                        <Text style={styles.action}>Stop Recognizing</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this._cancelRecognizing}>
                        <Text style={styles.action}>Cancel</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this._destroyRecognizer}>
                        <Text style={styles.action}>Destroy</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
      width: 50,
      height: 50,
    },
    roundButton: {
        borderRadisu: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    action: {
      textAlign: 'center',
      color: '#0000FF',
      marginVertical: 5,
      fontWeight: 'bold',
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    stat: {
      textAlign: 'center',
      color: '#B0171F',
      marginBottom: 3,
    },
});