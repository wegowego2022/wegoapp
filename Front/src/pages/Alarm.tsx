import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, TextInput, FlatList, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionic from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import {RootState} from '../store/reducer';
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../store';
import setFind  from '../slices/find';
import CommunityView from '../components/CommunityView';
import CommentItem, { CommentItemData} from '../components/CommentItem';

function ArticleView() {
    const [like, setLike] = useState(true);
    const navigation = useNavigation();
    const findName = useSelector((state: RootState) => state.find.findName);
    const findSeries = useSelector((state: RootState) => state.find.findSeries);
    const findEpisode = useSelector((state: RootState) => state.find.findEpisode);
    const findHour = useSelector((state: RootState) => state.find.findHour);
    const findMinute = useSelector((state: RootState) => state.find.findMinute);
    const findSecond = useSelector((state: RootState) => state.find.findSecond);

    const findText = useSelector((state: RootState) => state.find.findText);
    const findImage = useSelector((state: RootState) => state.find.findImage);

    const name = useSelector((state: RootState) => state.user.name);
    const profilepicture = useSelector((state: RootState) => state.user.profilepicture);

    const dispatch = useAppDispatch();
    
    const [comment, setComment] = useState('');
    const [isCommentInputVisible, setCommentInputVisible] = useState(false);
    const comments: CommentItem[] = CommentItemData || [];

    const handleSendComment = () => {
        if (comment.trim()) {
          const newComment: CommentItem = {
            id: comments.length + 1,
            message: comment,
            nickname: name,
            publishedAt: new Date().toLocaleString(), 
          };
    
          setComment('');
          comments.push(newComment); 
          setCommentInputVisible(false); 
        }
      };
    
      const handleCommentButtonPress = () => {
        setCommentInputVisible(true as boolean); 
      };

    return (
        <View style={styles.block}>
            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.icon} name="arrow-back-outline" />
            </Pressable>

            <Text style={styles.category}>찾아주세요</Text>
            
            <View style={styles.profileContainer}>
                <View>
                    <Image style={styles.profile} source={require('../../assets/images/Home/profile-gray.png')} />
                </View>
                <View>
                    <Text style={styles.nickname}>{name}</Text>
                    <Text style={styles.time}>3분전</Text>
                </View>
            </View>


            <Text style={styles.title}>{findName}</Text>
            <Text style={styles.text}>{findText}</Text>
            <View style={styles.episodeContainer}>
                <Text style={styles.episode}>{findSeries} {findEpisode}화</Text>
                <Text style={styles.episodeTime}>- {findHour}시 {findMinute}분 {findSecond}초</Text>
            </View>
            {findImage && (
                <Image style={styles.image} source={{uri:findImage}} />
            )}

            <View style={styles.flex}>
                    <Text style={styles.like}>
                        <Pressable onPress={() => setLike(!like)}>
                            <AntDesign
                                name={like ? 'heart' : 'hearto'}
                                style={{
                                    fontSize: 25,
                                    color: like ? '#ff4376' : 'dimgray',
                                    marginRight: 6,
                                }}
                            />
                        </Pressable>
                        {like}

                    </Text>
                    <Text style={styles.comment}>
                        <Pressable>
                            <Ionic 
                                name="ios-chatbubble-outline"
                                style={{ fontSize: 25, color: 'dimgray', paddingRight: 6, }}
                            />
                        </Pressable>
                       {comment+1}
                    </Text>
            </View>
        
        
    <Text style={styles.commentTitle}>댓글</Text>
      <View style={styles.commentContainer}>
        {comments.map((comment: CommentItem) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            message={comment.message}
            nickname={name}
            publishedAt={comment.publishedAt}
          />
        ))}

        {!isCommentInputVisible && (
          <Pressable style={styles.commentButton} onPress={handleCommentButtonPress}>
            <Text style={styles.commentButtonText}>댓글 달기  +</Text>
          </Pressable>
        )}

        {isCommentInputVisible && (
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="댓글을 입력하세요..."
              value={comment}
              onChangeText={setComment}
            />
            <Pressable style={styles.sendButton} onPress={handleSendComment}>
              <Text style={styles.sendButtonText}>보내기</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>

)
}
const styles = StyleSheet.create({
    block: {
        backgroundColor: 'black',
        color: 'white',
        flex: 1,
        paddingHorizontal: 15,
    },
    icon: {
        fontSize: 23,
        color: 'white',
        paddingVertical: 14,
    },
    profileContainer: {
        flexDirection: 'row',
        marginVertical: 20,
    },
    category: {
        color: 'white',
        backgroundColor: '#2b2b2b',
        width: 60,
        textAlign: 'center',
        borderRadius: 3,
        padding: 6,
        fontSize: 10,
        
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        color: 'white',
        fontSize: 15,
        marginBottom: 20,
    },
    episodeContainer: {
        flexDirection: 'row',
        paddingBottom:10,
    },
    episode: {
        color: 'white',
        fontSize: 15,
    },
    episodeTime: {
        marginLeft: 10,
        color: 'gray',
        fontSize: 14,
    },
    image: {
        width: '100%',
        height: 350,
        resizeMode: 'cover',
    },
    time: {
        color: 'white',

    },
   
    profile: {
        width: 37,
        height: 37,
        resizeMode: 'contain',
        marginRight: 14,
    },
    nickname: {
        color: 'white',
        fontWeight: 'bold',
        
    },
    flex: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        fontSize: 20,
        paddingVertical: 10,

    },
    like: {
        fontSize: 14,
        color: 'dimgray',
        
    },
    comment: {
       fontSize: 14,
        color: 'dimgray',

    },

    //댓글 
    commentTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 15,
      },
      commentContainer: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingBottom: 200,
        color: 'white',
      },
      commentButton: {
        width: 110,
        backgroundColor: '#ff4376',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginVertical: 10,
      },
      commentButtonText: {
        color: 'white',
        fontSize: 15,
      },
      commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
      },
      commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginRight: 10,
        color: 'white',
      },
      sendButton: {
        backgroundColor: '#ff4376',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
      },
      sendButtonText: {
        color: 'white',
        fontSize: 15,
      },

});

export default ArticleView;