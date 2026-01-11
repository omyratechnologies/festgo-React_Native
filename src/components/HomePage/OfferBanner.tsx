import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '~/utils/api';

const { width } = Dimensions.get('window');

// Consistent card dimensions
const CARD_HORIZONTAL_PADDING = 16; // px-4
const CARD_WIDTH = width - CARD_HORIZONTAL_PADDING * 2;
const CARD_HEIGHT = 120; // Fixed consistent height

const styles = StyleSheet.create({
  banner: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});

const OfferBanner = () => {
  const [bannerContent, setBannerContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/homescreen-banner`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data && data.data.content && data.data.content.length > 0) {
          // Get the first content item
          setBannerContent(data.data.content[0]);
        }
      } catch (error) {
        console.error('Error fetching banner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading) {
    return (
      <View style={{ paddingHorizontal: CARD_HORIZONTAL_PADDING, paddingVertical: 16 }}>
        <View style={[styles.banner, { backgroundColor: '#f3f4f6', justifyContent: 'center' }]}>
          <ActivityIndicator size="small" color="#0E54EC" />
        </View>
      </View>
    );
  }

  if (!bannerContent) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: CARD_HORIZONTAL_PADDING}}>
      <LinearGradient
        colors={['#00E871', '#008742']}
        style={styles.banner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text className="font-baloo" style={styles.text}>
          {bannerContent}
        </Text>
      </LinearGradient>
    </View>
  );
};

export default OfferBanner;
