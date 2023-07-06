import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import More from './src/pages/More';

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';
import { useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';
import userSlice from './src/slices/user';
import { useAppDispatch } from './src/store';
import { Alert } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import usePermissions from './src/hooks/usePermissions';
import MainTab from './MainTab';
import CommunityView from './src/components/CommunityView';
import PlaceInfo from './src/components/PlaceInfo';
import Alarm from './src/pages/Alarm';
import WriteFind from './src/components/WriteFind';
import HomeThismonthScreen from './src/components/HomeThismonthScreen';
import GoodsInfo from './src/components/GoodsInfo';
import WegoPickInfo from './src/components/WegoPickInfo';
import PlacePickInfo from './src/components/PlacePickInfo';
import PlacePickInfo2 from './src/components/PlacePickInfo2';

type Item = {
  id: number;
  title: string;
  category: string;
  text: string;
  time: string;
  profile: any;
  nickname: string;
  picture: any;
  isLiked: boolean;
  like: number;
  comment: number;
  age: string;
  year: string;
  episodeNum: string;
  titleInfo:string;
  cast: string;
  type: string;
  image: string;
};

  export type RootStackParamList = {
    MainTab: undefined;
    More: undefined;
    CommunityView: { item: Item };
    PlaceInfo: { item: Item };
    WriteFind: {item: Item };
    Alarm: undefined;
    SignIn: undefined;
    SignUp: undefined;
    HomeThismonthScreen: { item: Item };
    GoodsInfo: { item: Item };
    WegoPickInfo: { item: Item };
    PlacePickInfo: { item: Item };
    PlacePickInfo2: { item: Item };

  };

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const dispatch = useAppDispatch();
    const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

    usePermissions(); // 카메라, 위치 허용
    // 앱 자동 로그인
    useEffect(() => {
      const getTokenAndRefresh = async () => {
        try {
          const token = await EncryptedStorage.getItem('refreshToken');
          if (!token) {
            SplashScreen.hide();
            return;
          }
          const response = await axios.post(
            `${Config.API_URL}/api/refreshToken`,
            {},
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            },
          );
          dispatch(
            userSlice.actions.setUser({
              name: response.data.data.name,
              email: response.data.data.email,
              accessToken: response.data.data.accessToken,
            }),
          );
        } catch (error) {
          console.error(error);
          if ((error as AxiosError<{ code: any }>).response?.data.code === 'expired') {
            Alert.alert('알림', '다시 로그인 해주세요.');
          }
        } finally {
          SplashScreen.hide();
        }
      };
      getTokenAndRefresh();
    }, [dispatch]);



    return isLoggedIn ? (
           
           <Stack.Navigator>
            <Stack.Screen 
              name="MainTab"
              component={MainTab}
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name="More"
              component={More}
              options={{headerShown: false}}
            />

            <Stack.Screen 
              name="WriteFind"
              component={WriteFind}
              options={{headerShown: false}}
            />

            <Stack.Screen 
              name="CommunityView"
              options={{headerShown: false}}
            >
              {({ navigation, route }: { navigation: any; route: any }) => (
                <CommunityView navigation={navigation} item={route.params.item} />
              )}
            </Stack.Screen>

            <Stack.Screen 
              name="PlaceInfo"
              options={{headerShown: false}}
            >
              {({ navigation, route }: { navigation: any; route: any }) => (
                <PlaceInfo navigation={navigation} item={route.params.item} />
              )}
            </Stack.Screen>



            <Stack.Screen 
              name="Alarm"
              component={Alarm}
              options={{headerShown: false}}
            />

            <Stack.Screen 
              name="HomeThismonthScreen"
              options={{headerShown: false}}
            >
              {({ navigation, route }: { navigation: any; route: any }) => (
                <HomeThismonthScreen navigation={navigation} item={route.params.item} />
              )}
            </Stack.Screen>

            <Stack.Screen 
              name="GoodsInfo"
              options={{headerShown: false}}
            >
              {({ navigation, route }: { navigation: any; route: any }) => (
                <GoodsInfo navigation={navigation} item={route.params.item} />
              )}
            </Stack.Screen>


            <Stack.Screen 
              name="WegoPickInfo"
              options={{headerShown: false}}
            >
              {({ navigation, route }: { navigation: any; route: any }) => (
                <WegoPickInfo navigation={navigation} item={route.params.item} />
              )}
            </Stack.Screen>

            <Stack.Screen 
              name="PlacePickInfo"
              options={{headerShown: false}}
            >
              {({ navigation, route }: { navigation: any; route: any }) => (
                <PlacePickInfo navigation={navigation} item={route.params.item} />
              )}
            </Stack.Screen>

            <Stack.Screen 
              name="PlacePickInfo2"
              options={{headerShown: false}}
            >
              {({ navigation, route }: { navigation: any; route: any }) => (
                <PlacePickInfo2 navigation={navigation} item={route.params.item} />
              )}
            </Stack.Screen>

           </Stack.Navigator>
            ) : (
            <Stack.Navigator>
                <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{headerShown: false}}
                />
                <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{
                  headerStyle: {
                    backgroundColor: 'black',
                  },
                  headerTitleStyle: {
                    color: '#ff4376',
                  },
                  headerTitle: '회원가입',
                  headerTintColor: '#ff4376',
                }}
                />
              
                
            </Stack.Navigator>
    );


}


export default AppInner;