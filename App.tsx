import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { ChannelProfileType, RtcSurfaceView, createAgoraRtcEngine } from 'react-native-agora';

const APP_ID = 'cee58a26f39c41b2b0a0805037ffa71f';
const CHANNEL_NAME = 'test';
const UID = 0;

const agora = createAgoraRtcEngine();
agora.initialize({
  appId: APP_ID,
  channelProfile: ChannelProfileType.ChannelProfileCommunication,
});
agora.registerEventHandler({
  onJoinChannelSuccess(connection, elapsed) {
    console.log('Joined channel', { elapsed });
  },
  onRejoinChannelSuccess(connection, elapsed) {
    console.log('Rejoined channel', { elapsed });
  },
  onConnectionStateChanged(connection, state, reason) {
    console.log('Connection state changed:', { state, reason });
  },
  onUserOffline(connection, remoteUid, reason) {
    console.log('User offline', { reason, remoteUid });
  },
  onPermissionError(permissionType) {
    console.log('Permission error', permissionType);
  },
  onUserJoined(connection, remoteUid, elapsed) {
    console.log('User joined', { remoteUid, elapsed });
  },
  onLeaveChannel(connection, stats) {
    console.log(`Left channel`);
  },
  onError(errorCodeType, msg) {
    console.log('Agora error', errorCodeType, msg);
  },
  onConnectionInterrupted(connection) {
    console.log('Agora connection interrupted', connection);
  },
  onConnectionBanned(connection) {
    console.log('Agora connection banned', connection);
  },
  onExtensionError(provider, extension, error, message) {
    console.log('Agora extension error', error, message);
  },
  onEncryptionError(connection, errorType) {
    console.log('Agora encryption error', errorType);
  },
  onStreamMessageError(connection, remoteUid, streamId, code) {
    console.log('Agora stream message error', code);
  },
  onLocalVideoTranscoderError(stream, error) {
    console.log('Agora local video error', error);
  },
});

function RootScreen({ navigation }) {
  useEffect(() => {
    agora.joinChannel(APP_ID, CHANNEL_NAME, UID, {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });

    agora.enableVideo();
    agora.startPreview();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Root Screen</Text>
      <Button title="Go to Screen A" onPress={() => navigation.navigate('SubStack')} />
      <RtcSurfaceView canvas={{ uid: UID }} style={{ width: 200, height: 200, backgroundColor: 'purple' }} />
    </View>
  );
}

function ScreenA({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen A</Text>
      <Button title="Go to Screen B" onPress={() => navigation.navigate('ScreenB')} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <RtcSurfaceView canvas={{ uid: UID }} style={{ width: 200, height: 200, backgroundColor: 'purple' }} />
    </View>
  );
}

function ScreenB() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen B</Text>
      <RtcSurfaceView canvas={{ uid: UID }} style={{ width: 200, height: 200, backgroundColor: 'purple' }} />
    </View>
  );
}

const SubStack = createNativeStackNavigator();
function SubStackNavigator() {
  return (
    <SubStack.Navigator>
      <SubStack.Screen name="ScreenA" component={ScreenA} />
      <SubStack.Screen name="ScreenB" component={ScreenB} />
    </SubStack.Navigator>
  );
}

const MainStack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="Root">
        <MainStack.Screen name="Root" component={RootScreen} />
        <MainStack.Screen
          name="SubStack"
          component={SubStackNavigator}
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
