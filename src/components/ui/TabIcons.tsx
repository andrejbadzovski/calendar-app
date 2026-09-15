import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  color: string;
};

export function CalendarIcon({ color }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.calendarFrame, { borderColor: color }]}>
        <View style={[styles.calendarBar, { backgroundColor: color }]} />
        <View style={styles.calendarDots}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <View style={[styles.dot, { backgroundColor: color }]} />
          <View style={[styles.dot, { backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}

export function ProfileIcon({ color }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.profileHead, { borderColor: color }]} />
      <View style={[styles.profileBody, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarFrame: {
    width: 22,
    height: 21,
    borderWidth: 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  calendarBar: {
    height: 5,
    width: '100%',
  },
  calendarDots: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  profileHead: {
    width: 9,
    height: 9,
    borderRadius: 999,
    borderWidth: 2,
  },
  profileBody: {
    width: 17,
    height: 9,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginTop: 2,
  },
});
