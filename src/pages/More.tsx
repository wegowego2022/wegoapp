import React, {useCallback, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View, Image, Modal, TextInput, Platform } from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';


function More( ) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const name = useSelector((state: RootState) => state.user.name);
  const email = useSelector((state: RootState) => state.user.email);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  // name revise modal
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState(name);

  // 프로필 이미지
  const [response, setResponse] = useState(null);

  const handlePress = () => {
    setShowModal(true);
    setNewName(name);
  };

  // 확인 버튼 누른 후
  const handleSubmit = () => {
    // setNewName(newName);
    dispatch(userSlice.actions.setUser({ name: newName, email}))
    setShowModal(false);
  };

  const onLogout = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL}/api/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      Alert.alert('알림', '로그아웃 되었습니다.');
      dispatch(
        userSlice.actions.setUser({ //로그아웃 후 리덕스setUser초기화
          name: '',
          email: '',
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
    }
  }, [accessToken, dispatch]);

  // 프로필 이미지 선택하기
  const onSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
      },
      (res) => {
        if (res.didCancel) {
          // 이미지 선택 취소했을 경우
          return;
        }
        setResponse(res);
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon style={styles.icon} name="arrow-back-outline" />
        </Pressable>
        <View style={styles.icons}>
          <Pressable>
            <Icon style={styles.icon} name="notifications-outline"  />
          </Pressable>
          <Pressable>
              <Image
                source={require('../../assets/images/more/profile-gray.png')}  
                style={{width: 30, height: 25, marginLeft: 8}}
              />
          </Pressable>
        </View>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profilePicture}>
          <Pressable onPress={onSelectImage}>
            <Image
              style={styles.circle}
              resizeMode='contain'
              source={require('../../assets/images/more/profile-gray.png')} 
            />
          </Pressable>
        </View>

        <View style={styles.nickEmail}>
          <View style={styles.nicknameContainer}>
              <Text style={styles.nickname}>{name}</Text>
            <Pressable onPress={handlePress}>
              <Image source={require('../../assets/images/more/icon-revise.png')} />
            </Pressable>
          </View>
          <View style={styles.emailContainer}>
            <Image source={require('../../assets/images/more/small-kakao.png')} />
            <Text style={styles.email}> {email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.WHContainer}>
        <View style={styles.con}>
          <Pressable>
            <Image source={require('../../assets/images/more/mywriting.png')} />
            <Text style={styles.conText}>내가 작성한 글</Text>
          </Pressable>
        </View>
        <View style={styles.con}>
          <Pressable>
            <Image source={require('../../assets/images/more/history.png')} />
            <Text style={styles.conText}>내 히스토리</Text>
          </Pressable>
        </View>
      </View>


      <View style={styles.listContainer}>
        <Pressable>
          <View style={styles.list}>
            <Image source={require('../../assets/images/more/customercenter.png')} />
            <Text style={styles.listText}>  고객센터</Text>
          </View>
        </Pressable>
        <Pressable>
          <View style={styles.list}>
            <Image source={require('../../assets/images/more/notice.png')} />
            <Text style={styles.listText}>  공지/이벤트</Text>
          </View>
        </Pressable>
        <Pressable>
          <View style={styles.list}>
            <Image source={require('../../assets/images/more/terms.png')} />
            <Text style={styles.listText}>  이용약관/개인정보취급방침</Text>
          </View>
        </Pressable>
        <Pressable>
          <View style={styles.list}>
            <Image source={require('../../assets/images/more/versioninfo.png')} />
            <Text style={styles.listText}>  버전정보</Text>
          </View>
        </Pressable>
        
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={StyleSheet.compose(
            styles.loginButton,
            styles.loginButtonActive,
          )}
          onPress={onLogout}>
          <Text style={styles.loginButtonText}>로그아웃</Text>
        </Pressable>
      </View>
      <Modal visible={showModal} transparent={true}>
        <View style={styles.modal}>
          <View style={styles.modalButton}>
            <Pressable>
              <Text style={styles.cancel}>취소</Text>
            </Pressable>
            <Pressable onPress={handleSubmit}>
              <Text style={styles.cancel}>확인</Text>
            </Pressable>
          </View>
            <TextInput
              style={styles.reviseText}
              placeholder={name}
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleSubmit}
            />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  icons: {
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 10,
  },
  icon: {
    fontSize: 23,
    color: 'white',
    paddingHorizontal: 8,
  },
 
  profileContainer: {
    flexDirection: 'row',
    color: 'white',
  },
  profilePicture: {
    paddingLeft: 12,
  },
  circle: {
    width: 50,
    height: 55,
    margin: 5,
  },
  nickEmail: {
    padding: 10,
  },
  nicknameContainer: {
    flexDirection: 'row',
  },
  nickname: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailContainer: {
    flexDirection: 'row',
    paddingTop: 6,
  },
  email: {
    color: 'white',
    fontSize: 12,
  },

 
  WHContainer: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 18,
    justifyContent: 'space-around',
  },
  con: {
    width: '50%',
    marginLeft: 10,

  },
  conText: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: 'white',
    fontWeight: 'bold',
  },

  listContainer: {
    marginTop: 30,
    flexDirection: 'column',
  },
  list: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingVertical: 16,
  },
  listText: {
    color: 'white',
    fontSize: 16,
  },

  buttonZone: {
    alignItems: 'center',
    paddingTop: 110,

  },
  loginButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginButtonActive: {
    backgroundColor: 'gray',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 13,
  },

  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flex: 1,
    color: 'white',
  },
  modalButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancel: {
    color: 'white',
    padding: 15,
    fontSize: 16,
  },
  reviseText: {
    marginTop: 50,
    borderBottomColor: 'white',
    borderWidth: 1,
    color: 'white',
    marginHorizontal: 20,
    justifyContent: 'center',

  },
});

export default More;