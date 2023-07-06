import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';

type CommentItem = {
    id: number;
    message: string;
    nickname: string;
    publishedAt: string;
};



function CommentItem({message, nickname, publishedAt}: CommentItem) {
    // const formattedDate = new Date(publishedAt).toDateString();
    // {formattedDate}
    return (
        <View style={styles.block}>
            <View style={styles.head}>
                <Image style={styles.image} source={require('../../assets/images/more/profile-gray.png')}/>
                <Text style={styles.nickname}>{nickname}</Text>
                <Text style={styles.date}>{publishedAt}</Text>
            </View>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}
export const CommentItemData: CommentItem[] = [
    {
      id: 1,
      message: 'This is the first comment.',
      publishedAt: '10:30 AM',
      nickname: 'John',
    },
    {
      id: 2,
      message: 'This is the second comment.',
      publishedAt: '2023-06-02 02:45 PM',
      nickname: 'Jane',
    },
    {
      id: 3,
      message: 'This is the third comment.',
      publishedAt: '2023-06-03 09:15 AM',
      nickname: 'Bob',
    },
  ];
const styles = StyleSheet.create({
    block: {
        color:'white',
        paddingVertical: 8,
        padding: 5,
        marginBottom: 12,
        borderBottomColor: 'gray',
        borderWidth: 1,
    },
    head: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    image: {
        width: 35,
        height: 35,
        borderRadius: 15,
        marginRight: 10,
    },
    nickname: {
        fontWeight: 'bold',
        color: 'white',
        marginRight: 15,
    },
    date: {
        opacity: 0.8,
        fontSize: 13,
        color: 'white',
    },
    message: {
        color: 'white',
        fontSize: 15,
    },
})
export default CommentItem;