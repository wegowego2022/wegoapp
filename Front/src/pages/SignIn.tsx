import React from 'react';
import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { View, Text, Image, StyleSheet, Pressable, TextInput, ActivityIndicator, Platform } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from '../../../AppInner';
import DismissKeyboardView from '../components/DismissKeyboardView';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback((text:any) => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback((text:any) => {
    setPassword(text.trim());
  }, []);

  const onSubmit = useCallback(async() => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/users/signin`, {
        email,
        password,
      });
      console.log(response.data);
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
          // refreshToken: response.data.data.refreshToken,
        }),
      );
      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.data.refreshToken,
      );
    } catch (error) {
      console.log(error);
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', (errorResponse.data as { message: string }).message);
      }
    } finally {
      setLoading(false);
    }
    Alert.alert('알림', '로그인 되었습니다.');
    console.log(email);
  }, [loading, dispatch, email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);


    const canGoNext = email && password;
    return (
        <DismissKeyboardView style={[styles.container]}>
            <View style={styles.containerr}>
                <Image style={styles.logo} source={require('../../assets/images/login/logo.png')} />
                <View>
                    <View>
                        <Text style={styles.label}>이메일</Text>
                        <TextInput 
                            placeholder="이메일을 입력해주세요." 
                            placeholderTextColor='gray' 
                            style={styles.input}
                            value={email}
                            onChangeText={onChangeEmail} 
                            importantForAutofill="yes"
                            autoComplete='email'
                            textContentType='emailAddress'
                            keyboardType='email-address'
                            returnKeyType='next'
                            onSubmitEditing={() => {
                                passwordRef.current?.focus()
                            }}
                            blurOnSubmit={false}
                            ref={emailRef}
                            clearButtonMode="while-editing"
                            />
                    </View>
                    <View>
                        <Text style={styles.label}>비밀번호</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)." 
                            placeholderTextColor='#666' 
                            onChangeText={onChangePassword}
                            value={password}
                            keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
                            textContentType="password"
                            secureTextEntry
                            importantForAutofill='yes'
                            autoComplete="password"
                            returnKeyType="send"
                            clearButtonMode='while-editing'
                            ref={passwordRef}
                            onSubmitEditing={onSubmit}
                            />
                    </View>
                    <View>
                        <Pressable 
                          style={
                            canGoNext
                            ? StyleSheet.compose(styles.loginbtn, styles.loginbtnActive)
                            : styles.loginbtn
                          }
                            disabled={!canGoNext || loading}
                            onPress={onSubmit}>
                            {loading ? (
                              <ActivityIndicator color="white" />
                              ) : (
                                <Text style={styles.loginText}>로그인</Text>
                                )}
                        </Pressable>
                     
                        <Pressable onPress={toSignUp}>
                            <Text style={styles.signup}>회원가입하기</Text>
                        </Pressable>
                    </View>
                </View>



                <Text style={styles.text}>OTT콘텐츠 속 위시 아이템을 위고위고에서 빠르게 만나보세요!</Text>
                <View style={styles.button}>
                    <Pressable>
                        <Image style={styles.each_button} source={require('../../assets/images/login/kakao.png')} />
                    </Pressable>
                    <Pressable>
                    <Image style={styles.each_button} source={require('../../assets/images/login/google.png')} />
                    </Pressable>
                    <Pressable>
                    <Image style={styles.each_button} source={require('../../assets/images/login/apple.png')} />
                    </Pressable>
                </View>
                <Text style={styles.enter}>먼저, 둘러볼께요.</Text>
            </View>
        </DismissKeyboardView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: 'white',
        backgroundColor: 'black'
    },
    containerr: {
        alignItems: "center",
    },
    logo: {
        marginTop: 100,
        marginBottom:40,
    },

    label: {
        marginVertical: 1,
        padding: 5,
        color: 'white',
        fontWeight: 'bold',

    },
    input: {
        color: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        width: 200,
    },

    loginbtn: {
        color: 'white',
        backgroundColor: 'gray',
        textAlign: 'center',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    loginbtnActive: {
        backgroundColor: '#ff4376',
    },
    loginText: {
        color: 'white',
        textAlign: 'center',
    },

    signup: {
        color: 'white',
        padding: 10,
        textAlign: 'center',
    },

    text: {
        marginTop: 80,
        color: "gray",
        fontSize: 13,
        width: 190,
    },
    button: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    each_button: {
        marginRight: 6,
        marginLeft: 6,
    },
    enter: {
        marginTop: 30,
        color: "white",
        textDecorationLine: 'underline',
    }
})

export default SignIn;