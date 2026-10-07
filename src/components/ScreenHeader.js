import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

/* Consistent bold header used at the top of every tab. */
export const ScreenHeader = ({ title, subtitle, right, brand = false }) => (
  <View style={styles.header}>
    <View style={styles.textCol}>
      <Text style={brand ? styles.brandTitle : styles.title} numberOfLines={1}>
        {title}
      </Text>
      {!!subtitle && (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </View>
    {right ? <View style={styles.right}>{right}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 8 : 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e6df',
    backgroundColor: '#fcfbf9',
  },
  textCol: { flex: 1, paddingRight: 12 },
  brandTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#c85a32',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  right: { flexDirection: 'row', alignItems: 'center' },
});
