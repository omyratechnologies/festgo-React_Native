import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import BottomMenu from '~/components/common/BottomMenu';
import Svg, { Path } from 'react-native-svg';
import { API_URL } from '~/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface PricingType {
  type: string;
  price: number;
  details: string[];
  number_of_persons: number;
  max_number_of_tickets: number;
}

interface PricingCategory {
  name: string;
  types: PricingType[];
  total_passes: number;
  available_passes: number;
}

interface CityFest {
  id: string;
  categoryId: string;
  location: string;
  event_start: string;
  event_end: string;
  highlights: string;
  image_urls: string[];
  cityfest_category_name: string;
  pricing_types: PricingCategory[];
}

const CityFestSectionSelection = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const route = useRoute<any>();
  const { festId } = route.params || {};
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');
  const [fest, setFest] = useState<CityFest | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<{
    section: string;
    type: string;
    quantity: number;
  } | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchFestDetails = async () => {
      try {
        setLoading(true);
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        
        if (!jwtToken) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        };
        
        const response = await fetch(`${API_URL}/city-fests/getall/cityfests`, {
          method: 'GET',
          headers,
        });
        const data = await response.json();
        if (data.success && data.fests) {
          const festData = data.fests.find((f: CityFest) => f.id === festId);
          if (festData) {
            setFest(festData);
            // Set first section as default
            if (festData.pricing_types && festData.pricing_types.length > 0) {
              setSelectedSection(festData.pricing_types[0].name.toLowerCase());
            }
          } else {
            console.error('Fest not found with id:', festId);
          }
        } else {
          console.error('API Error:', data);
        }
      } catch (error) {
        console.error('Error fetching fest details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (festId) {
      fetchFestDetails();
    }
  }, [festId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${month} ${day}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getSectionPrice = (sectionName: string) => {
    if (!fest?.pricing_types) return '0';
    const section = fest.pricing_types.find(
      (p) => p.name.toLowerCase() === sectionName.toLowerCase()
    );
    if (!section || !section.types || section.types.length === 0) return '0';
    return section.types[0].price.toString();
  };

  const handleSectionSelect = (sectionName: string) => {
    setSelectedSection(sectionName.toLowerCase());
    setSelectedTicketType(null);
  };

  const handleTicketSelect = (section: string, type: string, quantity: number = 1) => {
    setSelectedTicketType({ section, type, quantity });
  };

  const handleContinue = () => {
    if (!selectedTicketType || !fest) return;
    navigation.navigate('CityFestCheckout', {
      festId: fest.id,
      selectedSection: selectedTicketType.section,
      selectedType: selectedTicketType.type,
      quantity: selectedTicketType.quantity,
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0E54EC" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-white">
        {/* Header Section */}
        <View
          style={{
            height: 280,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <View className="absolute inset-0 overflow-hidden rounded-b-[30px] bg-[#0E54EC]">
            <View className="h-full w-full opacity-20" />
          </View>
          <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between bg-transparent px-8 pb-6 pt-2">
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M15 18l-6-6 6-6"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-2 text-center font-baloo text-2xl font-bold text-gray-800">
            Login Required
          </Text>
          <Text className="mb-6 text-center font-poppins text-base text-gray-600">
            Please login to select tickets
          </Text>
          <TouchableOpacity
            onPress={() => {
              const rootNavigation = navigation.getParent()?.getParent();
              if (rootNavigation) {
                (rootNavigation as any).navigate('Auth', { screen: 'Login' });
              }
            }}
            className="rounded-full bg-[#0E54EC] px-6 py-3">
            <Text className="font-poppins font-semibold text-white">Go to Login</Text>
          </TouchableOpacity>
        </View>
        <BottomMenu />
      </View>
    );
  }

  if (!fest) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="font-poppins text-gray-500">Fest not found</Text>
      </View>
    );
  }

  const selectedSectionData = fest.pricing_types?.find(
    (p) => p.name.toLowerCase() === selectedSection
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View
        style={{
          height: 280,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {/* Background Image */}
        <View className="absolute inset-0 overflow-hidden rounded-b-[30px] bg-[#0E54EC]">
          <Image
            source={{
              uri: fest.image_urls?.[0] || 'https://via.placeholder.com/400',
            }}
            className="h-full w-full opacity-30"
            resizeMode="cover"
          />
        </View>

        {/* Top Bar */}
        <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between bg-transparent px-8 pb-6 pt-2">
          <View className="flex-row items-center">
            <TouchableOpacity className="flex-row items-center">
              <View className="mr-2 h-8 w-8 rounded-full bg-white/20" />
              <Text className="mr-1 font-poppins text-base font-medium text-white">
                {selectedLocation}
              </Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M7 10l5 5 5-5"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="mr-4">
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  fill="white"
                />
                <Path
                  d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity>
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation and Title */}
        <View
          style={{
            position: 'absolute',
            top: 110,
            left: 20,
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 2,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 18l-6-6 6-6"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text className="font-baloo" style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
            {fest.cityfest_category_name || 'City Fest'}
          </Text>
        </View>

        {/* Event Details */}
        <View
          style={{
            position: 'absolute',
            top: 150,
            left: 20,
            flexDirection: 'column',
            alignItems: 'flex-start',
            zIndex: 2,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="mr-1">
              <Path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                stroke="#d1d5db"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                stroke="#d1d5db"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text className="font-poppins text-sm text-white">{fest.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="mr-1">
              <Path
                d="M8 2v2M16 2v2M3 7h18M5 11h2M9 11h2M13 11h2M17 11h2M5 15h2M9 15h2M13 15h2M17 15h2M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
                stroke="#d1d5db"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text className="font-poppins text-sm text-white">
              {formatDate(fest.event_start)} | {formatTime(fest.event_start)} -{' '}
              {formatTime(fest.event_end)}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Section Selection */}
        <View className="mb-6">
          <Text className="mb-4 font-baloo text-2xl font-bold text-black">Select a section</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-3">
              {fest.pricing_types?.map((section) => {
                const price = getSectionPrice(section.name);
                const isSelected = selectedSection === section.name.toLowerCase();
                return (
                  <TouchableOpacity
                    key={section.name}
                    onPress={() => handleSectionSelect(section.name)}
                    className={`rounded-full px-4 py-2 ${
                      isSelected ? 'bg-[#0E54EC]' : 'bg-gray-200'
                    }`}>
                    <Text
                      className={`font-poppins text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-gray-700'
                      }`}>
                      ₹{parseInt(price).toLocaleString('en-IN')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Seating Layout Visualization */}
          <View className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            {/* STAGE Section */}
            <View className="mb-4 items-center">
              <View 
                className="rounded-lg bg-white px-8 py-3"
                style={{
                  borderWidth: 1.5,
                  borderColor: '#0E54EC',
                  width: '85%',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}>
                <Text className="text-center font-poppins text-base font-semibold text-gray-800">
                  STAGE
                </Text>
              </View>
            </View>

            {/* Seating Sections - Stacked Vertically */}
            <View className="gap-3">
              {fest.pricing_types?.map((section, index) => {
                const isSelected = selectedSection === section.name.toLowerCase();
                const isAvailable = section.available_passes > 0;
                
                const colors: Record<string, { bg: string; border: string; text: string }> = {
                  diamond: { bg: '#4A90E2', border: '#4A90E2', text: 'white' },
                  gold: { bg: '#FFD700', border: '#FFD700', text: 'white' },
                  silver: { bg: '#10B981', border: '#10B981', text: 'white' },
                  general: { bg: '#87CEEB', border: '#87CEEB', text: 'white' },
                };
                
                const sectionColor = colors[section.name.toLowerCase()] || { 
                  bg: '#E0E0E0', 
                  border: '#E0E0E0', 
                  text: 'gray' 
                };
                
                // If not available, show grey
                const displayColor = isAvailable 
                  ? sectionColor
                  : { bg: '#D0D0D0', border: '#D0D0D0', text: 'gray' };
                
                return (
                  <TouchableOpacity
                    key={section.name}
                    onPress={() => handleSectionSelect(section.name)}
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: displayColor.bg,
                      borderWidth: 1.5,
                      borderColor: displayColor.border,
                      paddingVertical: 18,
                      paddingHorizontal: 16,
                      borderRadius: 10,
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isSelected ? 0.2 : 0.1,
                      shadowRadius: 3,
                      elevation: isSelected ? 4 : 2,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        fontWeight: '600',
                        color: displayColor.text === 'white' ? '#FFFFFF' : '#666666',
                      }}>
                      {section.name.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {/* Legend */}
            <View className="mt-5 flex-row items-center justify-center">
              <View 
                className="mr-2 rounded"
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: '#9CA3AF',
                }} 
              />
              <Text className="text-center font-poppins text-xs text-gray-500">
                Sold out/Unavailable stands are marked as grey
              </Text>
            </View>
          </View>
        </View>

        {/* Ticket Selection */}
        {selectedSectionData && (
          <View className="mb-6">
            <Text className="mb-4 font-baloo text-2xl font-bold text-black">Choose Tickets</Text>
            {selectedSectionData.types?.map((ticketType, index) => {
              const ticketKey = `${selectedSection}_${ticketType.type}`;
              const quantity = quantities[ticketKey] || (ticketType.type === 'single' ? 1 : 0);
              const isSelected =
                selectedTicketType?.section === selectedSection &&
                selectedTicketType?.type === ticketType.type;

              const updateQuantity = (newQuantity: number) => {
                setQuantities((prev) => ({
                  ...prev,
                  [ticketKey]: Math.max(0, Math.min(newQuantity, ticketType.max_number_of_tickets || 10)),
                }));
                if (newQuantity > 0) {
                  handleTicketSelect(selectedSection!, ticketType.type, newQuantity);
                }
              };

              return (
                <View
                  key={index}
                  className="mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <View className="mb-3 flex-row items-center justify-between">
                    <View>
                      <Text className="font-poppins text-lg font-bold text-black">
                        {selectedSectionData.name.charAt(0).toUpperCase() +
                          selectedSectionData.name.slice(1)}{' '}
                        {ticketType.type.charAt(0).toUpperCase() + ticketType.type.slice(1)}
                        {ticketType.type === 'group' &&
                          ` (${ticketType.number_of_persons} Guests)`}
                      </Text>
                      <Text className="mt-1 font-poppins text-xl font-bold text-[#0E54EC]">
                        ₹{ticketType.price.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    {ticketType.type === 'single' ? (
                      <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                          onPress={() => updateQuantity(quantity - 1)}
                          className="h-8 w-8 items-center justify-center rounded-full border border-gray-300">
                          <Text className="font-poppins text-lg">-</Text>
                        </TouchableOpacity>
                        <Text className="font-poppins text-base font-semibold">{quantity}</Text>
                        <TouchableOpacity
                          onPress={() => updateQuantity(quantity + 1)}
                          className="h-8 w-8 items-center justify-center rounded-full border border-gray-300">
                          <Text className="font-poppins text-lg">+</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          updateQuantity(1);
                        }}
                        className={`rounded-lg px-4 py-2 ${
                          isSelected ? 'bg-[#0E54EC]' : 'bg-gray-200'
                        }`}>
                        <Text
                          className={`font-poppins text-sm font-medium ${
                            isSelected ? 'text-white' : 'text-gray-700'
                          }`}>
                          Add
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View className="gap-2">
                    {ticketType.details?.map((detail, detailIndex) => (
                      <Text key={detailIndex} className="font-poppins text-sm text-gray-600">
                        • {detail}
                      </Text>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Continue Button */}
        {selectedTicketType && (
          <TouchableOpacity
            onPress={handleContinue}
            className="mb-6 overflow-hidden rounded-full bg-[#0E54EC] p-4 shadow-lg">
            <Text className="text-center font-poppins text-lg font-semibold text-white">
              Continue
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomMenu />
    </View>
  );
};

export default CityFestSectionSelection;

