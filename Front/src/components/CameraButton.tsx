import React, {useState} from 'react';
import {StyleSheet, Modal, View, Pressable, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UploadModeModal from './UploadModeModal';

function CameraButton( ) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <View>
                <Pressable 
                  android_ripple={{ color: '#ffffff', }}
                  style={styles.cameraCircle}
                  onPress={()=> setModalVisible(true)}
                  >
                  <Icon name="camera-alt" style={styles.cameraIcon} />
                </Pressable>
            </View>
            <UploadModeModal 
                visible={modalVisible}
                onClose={()=> setModalVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    cameraCircle: {
        marginTop: 20,
        width: 60,
        height: 60,
        backgroundColor: '#141414',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ff4376',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cameraIcon: {
        color: 'white',
        fontSize: 26,
      },
})
export default CameraButton;