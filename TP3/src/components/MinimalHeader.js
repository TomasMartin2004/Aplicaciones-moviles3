import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MinimalHeader({ title, right, left, style }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top }, style]}>
      <View style={styles.side}>{left}</View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECEFF4',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F0',
    paddingHorizontal: 16,
    height: 56,
    minHeight: 56,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3440',
  },
  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
