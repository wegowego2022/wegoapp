import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, TextInput } from 'react-native';
import CommentItem, { CommentItemData } from './CommentItem';
import ArticleView from './ArticleView';

function CommunityView({ item, navigation }: { item: any; navigation: any; }) {
  const [comment, setComment] = useState('');
  const [isCommentInputVisible, setCommentInputVisible] = useState(false);
  const comments: CommentItem[] = CommentItemData || [];

  const handleSendComment = () => {
    if (comment.trim()) {
      const newComment: CommentItem = {
        id: comments.length + 1,
        message: comment,
        nickname: 'John',
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
    <ScrollView style={styles.container}>
      <ArticleView navigation={navigation} item={item} />

      <Text style={styles.commentTitle}>댓글</Text>
      <View style={styles.commentContainer}>
        {comments.map((comment: CommentItem) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            message={comment.message}
            nickname={comment.nickname}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
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

export default CommunityView;
