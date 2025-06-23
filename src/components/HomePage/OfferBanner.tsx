import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const OfferBanner = () => {
  return (
    <View className="px-4">
      <LinearGradient
        colors={['#00E871', '#008742']}
        style={styles.banner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text className="font-baloo" style={styles.text}>
          Get Up to <Text style={styles.highlight}>50% OFF</Text> on Festive Bookings
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 32, // Increased left and right padding
    borderRadius: 16, // Increased border radius
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  highlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default OfferBanner;
