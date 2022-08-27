import React from 'react';
import {
    View,
    Text,
    PermissionsAndroid,
    Button,
    StyleSheet
} from 'react-native'
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import SpeechRecognizer from '../voice-regconizer/voice-regconizer';

const commandMap = {
    'auto': 0,
    'go straight': 1,
    'turn left': 2,
    'turn right': 3,
    'go backward': 4,
    'stop': 5
}

const requestAccessFineLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: 'Access fine location required for recovery',
            message: 'To discover other devices',
            buttonPositive: 'Permit',
            buttonNegative: 'Refuse',
            buttonNeutral: 'Ask me later'
        }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
}

// const TARGET_NAME = 'HC-05';
const TARGET_ADDRESS = '00:21:10:01:0F:42';
const PC_ADDRESS = 'D4:D2:52:AA:C7:B9';
let CONN_ADDRESS = TARGET_ADDRESS;

export default class Bluetooth extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            devices: [],
            target: undefined,
            discovering: false,
            targetStatus: '',
            connected: false,
            sendStatus: 'idle',
            cmd: 5
        }
    }

    async componentDidMount(){
        await this.getBondedDevices();
        await this.checkTargetConnected();
    }

    async componentWillUnmount(){
        if(this.state.connected){
            try {
                await this.state.target.disconnect();
            } catch (err) {
                console.log('error: ' + err.message);
            }
        }
    }

    reduceToCmd = (results) => {
        const lowerResults = results.map(res => res.toLowerCase());
        for(let cmd in commandMap){
            if(lowerResults.indexOf(cmd) != -1){
                return cmd;
            }
        }
        return 'none';
    }

    mapToCmdCode = (cmd) => {
        return commandMap[cmd];
    }

    checkTargetConnected = async () => {
        await this.getBondedDevices();
        const device = this.state.devices.find(device => device.address === CONN_ADDRESS);
        if(device){
            let connection = await device.isConnected();
            if(connection){
                this.setState({
                    target: device,
                    targetStatus: 'Target connected',
                    connected: true
                })
            } else {
                this.setState({
                    target: device,
                    targetStatus: 'Target found but not connected',
                    connected: false
                })
            }
        } else {
            this.setState({
                targetStatus: 'Target not found',
                connected: false
            })
        }
    }

    getBondedDevices = async (unloading) => {
        try {
            let bondedDevices = await RNBluetoothClassic.getBondedDevices();
            if(!unloading){
                this.setState({ devices: bondedDevices });
            }
        } catch (error) {
            this.setState({ devices: [] });
            console.log('Error: ' + error.message);
        }
    };

    sendData = async (data) => {
        if(!this.state.connected){
            this.setState({
                sendStatus: 'target not connected'
            });
            return;
        }
        try {
            let message = data + '\r';
            await RNBluetoothClassic.writeToDevice(this.state.target.address, message);
            let buffData = Buffer.alloc(10, 0xEF);
            await this.state.target.write(buffData);
            this.setState({
                sendStatus: 'Sent'
            })
        } catch (error) {
            this.setState({
                sendStatus: 'send fail' + error.message
            })
        }
    }

    setCmd = (cmdCode) => {
        this.setState({
            cmd: cmdCode
        })
    }

    connectToTarget = async () => {
        if(!this.state.connected && this.state.target){
            try{
                const connection = await this.state.target.connect();
                this.setState({
                    connected: connection
                })
            } catch (err) {
                console.log('error: ' + err.message);
            }
        }
    }

    onRefresh = async () => {
        await this.getBondedDevices();
        await this.connectToTarget();
        await this.checkTargetConnected();
    }

    render(){
        let targetColor = this.state.target? '#27ba16' : '#ff0000';
        return (
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 14}}>{`CurrentCode: ${this.state.cmd}`}</Text>
                <Button 
                    title='Refresh'
                    onPress={async () => await this.onRefresh()}
                    style={{marginBottom: 5}}
                ></Button>
                <Text>Devicelist</Text>
                {this.state.devices.map(device => {
                    return (
                        <Text key={`device_${device.address}`}>{`${device.name},${device.address}`}</Text>
                    )
                })}
                <Text style={{color: targetColor}}>{`TargetStatus: ${this.state.targetStatus}`}</Text>
                <Text style={{alignContent: 'center'}}>{`${this.state.sendStatus}`}</Text>
                <SpeechRecognizer 
                    sendData={this.sendData} 
                    reduceToCmd={this.reduceToCmd} 
                    mapToCmd={this.mapToCmdCode}
                    setCommandCode={this.setCmd}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    roundButton: {
        borderRadisu: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})