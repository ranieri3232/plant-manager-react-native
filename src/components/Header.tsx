import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import { StyleSheet, View, Text, Image } from 'react-native';

import userImg from '../assets/ranieri.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
  const [userName, setuserName] = useState<string>();

  useEffect(() => {
    async function loadStorageUserName() {
      const user = await AsyncStorage.getItem('@plantmanager:user');
      setuserName(user || '');
    }
    loadStorageUserName();
  }, []);
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá, </Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <Image style={styles.userImage} source={userImg} />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 30
  },
  greeting: {
    fontFamily: fonts.text,
    fontSize: 32,
    color: colors.heading
  },
  userName: {
    fontFamily: fonts.heading,
    fontSize: 32,
    color: colors.heading,
    lineHeight: 40
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35
  }

});
