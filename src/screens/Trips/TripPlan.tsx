import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Modal,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '~/utils/api';
import { MainTabNavigationProp } from '~/navigation/types';
import WalletIcon from '~/assets/images/common/Navbar/walletLight.svg';
import NotificationIcon from '~/assets/images/common/Navbar/NotificationLight.svg';
import UserProfileLight from '~/assets/images/common/Navbar/userProfileLight.svg';
import Svg, { Path } from 'react-native-svg';
import BottomMenu from '~/components/common/BottomMenu';
import { Ionicons } from '@expo/vector-icons';

const TRAVEL_TYPES = ['group', 'individual'];
const AMENITIES_OPTIONS = ['ac', 'water', 'wifi', 'food', 'parking', 'pool'];
const HOTEL_CATEGORIES = ['ac luxury', 'non-ac', 'budget', 'premium', 'deluxe'];

const TripPlan: React.FC = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const [activeTab, setActiveTab] = useState<'basic' | 'trip'>('basic');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Basic Info State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [travelType, setTravelType] = useState('');
  const [showTravelTypeDropdown, setShowTravelTypeDropdown] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalPersons, setTotalPersons] = useState('');
  const [referralId, setReferralId] = useState('');

  // Trip Info State
  const [from, setFrom] = useState('');
  const [destination, setDestination] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showAmenitiesDropdown, setShowAmenitiesDropdown] = useState(false);
  const [hotelCategory, setHotelCategory] = useState('');
  const [showHotelCategoryDropdown, setShowHotelCategoryDropdown] = useState(false);
  const [requestedCoins, setRequestedCoins] = useState('');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleNext = () => {
    if (!name || !phone || !travelType || !totalPersons) {
      Alert.alert('Missing Information', 'Please fill all required fields in Basic Info');
      return;
    }
    setActiveTab('trip');
  };

  const handleSubmit = async () => {
    if (!from || !destination || !hotelCategory) {
      Alert.alert('Missing Information', 'Please fill all required fields in Trip Info');
      return;
    }

    if (amenities.length === 0) {
      Alert.alert('Missing Information', 'Please select at least one amenity');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Login required', 'Please login to continue');
        setLoading(false);
        return;
      }

      const body = {
        name,
        number: phone,
        travelType,
        totalPersons: parseInt(totalPersons) || 1,
        date: formatDateForAPI(date),
        from,
        destination,
        amenities,
        hotelCategory,
        referralId: referralId || '',
        requestedCoins: requestedCoins || '',
      };

      const resp = await fetch(`${API_URL}/trips/planmytrip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await resp.json();
      if (!resp.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit trip plan');
      }

      setShowModal(true);
    } catch (e: any) {
      console.error('Trip plan error', e);
      Alert.alert('Error', e.message || 'Failed to submit trip plan');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Reset form
    setName('');
    setPhone('');
    setTravelType('');
    setDate(new Date());
    setTotalPersons('');
    setReferralId('');
    setFrom('');
    setDestination('');
    setAmenities([]);
    setHotelCategory('');
    setRequestedCoins('');
    setActiveTab('basic');
  };

  return (
    <View className="flex-1 bg-white">
      <View
        style={{
          height: 280,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {/* Background Image */}
        <View className="absolute inset-0 overflow-hidden">
          <Image
            source={require('~/assets/images/trips/bg.png')}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        {/* Top Bar with Location and Icons */}
        <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between px-8 pb-6 pt-2">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <UserProfileLight width={32} height={32} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')} className="mr-4">
              <WalletIcon width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <NotificationIcon width={28} height={28} />
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
            Plan my Trip
          </Text>
        </View>
      </View>

      {/* Content Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-white -mt-20 rounded-t-[40px]" style={{ paddingHorizontal: 16, paddingTop: 52 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled">
              {/* Illustration */}
              <View className="items-center mb-6">
                <Image
                  source={require('~/assets/images/trips/illustration.png')}
                  style={{ width: '100%', height: 180 }}
                  resizeMode="contain"
                />
              </View>

              {/* Instructional Text */}
              <Text className="text-center text-gray-700 mb-6 text-base">
                Provide basic information about my trip
              </Text>

              {/* Tabs */}
              <View className="flex-row mb-6 border-b border-gray-200">
                <TouchableOpacity
                  onPress={() => setActiveTab('basic')}
                  className={`flex-1 pb-3 ${activeTab === 'basic' ? 'border-b-2 border-[#0E54EC]' : ''}`}>
                  <Text
                    className={`text-center font-semibold ${activeTab === 'basic' ? 'text-[#0E54EC]' : 'text-gray-500'}`}>
                    Basic Info
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab('trip')}
                  className={`flex-1 pb-3 ${activeTab === 'trip' ? 'border-b-2 border-[#0E54EC]' : ''}`}>
                  <Text
                    className={`text-center font-semibold ${activeTab === 'trip' ? 'text-[#0E54EC]' : 'text-gray-500'}`}>
                    Trip Info
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <View>
              <View className="mb-4">
                <Text className="mb-1 text-gray-700 font-medium">Name</Text>
                <View className="flex-row items-center rounded-xl border border-gray-300 bg-white px-3 py-3">
                  <Ionicons name="person-outline" size={20} color="#666" style={{ marginRight: 8 }} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter Name"
                    className="flex-1 text-base"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-gray-700 font-medium">Phone no.</Text>
                <View className="flex-row items-center rounded-xl border border-gray-300 bg-white px-3 py-3">
                  <Text className="text-gray-700 mr-2">+91</Text>
                  <Ionicons name="call-outline" size={20} color="#666" style={{ marginRight: 8 }} />
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    className="flex-1 text-base"
                  />
                </View>
              </View>

              <View className="mb-4" style={{ zIndex: 100 }}>
                <Text className="mb-1 text-gray-700 font-medium">Travel Type</Text>
                <Pressable
                  className="relative flex-row items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-3"
                  onPress={() => {
                    setShowTravelTypeDropdown(!showTravelTypeDropdown);
                    setShowAmenitiesDropdown(false);
                    setShowHotelCategoryDropdown(false);
                  }}>
                  <Text className={`text-base ${travelType ? 'text-gray-900' : 'text-gray-400'}`}>
                    {travelType || 'Select travel type'}
                  </Text>
                  <Ionicons
                    name={showTravelTypeDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#0E54EC"
                  />
                </Pressable>
                {showTravelTypeDropdown && (
                  <ScrollView
                    style={{
                      position: 'absolute',
                      top: 56,
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: '#E5E7EB',
                      zIndex: 999,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 5,
                      maxHeight: 150,
                    }}>
                    {TRAVEL_TYPES.map((type) => (
                      <Pressable
                        key={type}
                        className={`px-4 py-3 ${travelType === type ? 'bg-[#0E54EC]/10' : ''}`}
                        onPress={() => {
                          setTravelType(type);
                          setShowTravelTypeDropdown(false);
                        }}>
                        <Text
                          className={`text-base ${travelType === type ? 'font-semibold text-[#0E54EC]' : 'text-gray-700'}`}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-gray-700 font-medium">Date</Text>
                <Pressable
                  onPress={() => {
                    setShowDatePicker(true);
                    setShowTravelTypeDropdown(false);
                    setShowAmenitiesDropdown(false);
                    setShowHotelCategoryDropdown(false);
                  }}
                  className="flex-row items-center rounded-xl border border-gray-300 bg-white px-3 py-3">
                  <Ionicons name="calendar-outline" size={20} color="#666" style={{ marginRight: 8 }} />
                  <Text className="flex-1 text-base text-gray-900">{formatDate(date)}</Text>
                </Pressable>
                {showDatePicker && (
                  <View>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                    />
                    {Platform.OS === 'ios' && (
                      <View className="mt-2 flex-row justify-end gap-2">
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}
                          className="rounded-lg bg-gray-200 px-4 py-2">
                          <Text className="text-gray-700">Done</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-gray-700 font-medium">Total Persons</Text>
                <TextInput
                  value={totalPersons}
                  onChangeText={setTotalPersons}
                  keyboardType="number-pad"
                  placeholder="e.g. 4"
                  className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-base"
                />
              </View>

              <View className="mb-6">
                <Text className="mb-1 text-gray-700 font-medium">Referral Code (optional)</Text>
                <View className="flex-row items-center rounded-xl border border-gray-300 bg-white px-3 py-3">
                  <Ionicons name="person-outline" size={20} color="#666" style={{ marginRight: 8 }} />
                  <TextInput
                    value={referralId}
                    onChangeText={setReferralId}
                    placeholder="Enter your Referral code"
                    className="flex-1 text-base"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleNext}
                disabled={loading}
                className="rounded-full bg-[#0E54EC] py-3">
                <Text className="text-center text-white font-semibold text-base">Next</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Trip Info Tab */}
          {activeTab === 'trip' && (
            <View>
              <View className="mb-4">
                <Text className="mb-1 text-gray-700 font-medium">From</Text>
                <TextInput
                  value={from}
                  onChangeText={setFrom}
                  placeholder="Enter origin"
                  className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-base"
                />
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-gray-700 font-medium">Destination</Text>
                <TextInput
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="Enter destination"
                  className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-base"
                />
              </View>

              <View className="mb-4" style={{ zIndex: 90 }}>
                <Text className="mb-1 text-gray-700 font-medium">Amenities</Text>
                <Pressable
                  className="relative flex-row items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-3"
                  onPress={() => {
                    setShowAmenitiesDropdown(!showAmenitiesDropdown);
                    setShowTravelTypeDropdown(false);
                    setShowHotelCategoryDropdown(false);
                  }}>
                  <Text className={`text-base ${amenities.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                    {amenities.length > 0 ? amenities.join(', ') : 'Select amenities'}
                  </Text>
                  <Ionicons
                    name={showAmenitiesDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#0E54EC"
                  />
                </Pressable>
                {showAmenitiesDropdown && (
                  <ScrollView
                    style={{
                      position: 'absolute',
                      top: 56,
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: '#E5E7EB',
                      zIndex: 999,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 5,
                      maxHeight: 200,
                    }}>
                    {AMENITIES_OPTIONS.map((amenity) => (
                      <Pressable
                        key={amenity}
                        className={`px-4 py-3 flex-row items-center justify-between ${amenities.includes(amenity) ? 'bg-[#0E54EC]/10' : ''}`}
                        onPress={() => toggleAmenity(amenity)}>
                        <Text
                          className={`text-base ${amenities.includes(amenity) ? 'font-semibold text-[#0E54EC]' : 'text-gray-700'}`}>
                          {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                        </Text>
                        {amenities.includes(amenity) && (
                          <Ionicons name="checkmark" size={20} color="#0E54EC" />
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>

              <View className="mb-4" style={{ zIndex: 80 }}>
                <Text className="mb-1 text-gray-700 font-medium">Hotel Category</Text>
                <Pressable
                  className="relative flex-row items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-3"
                  onPress={() => {
                    setShowHotelCategoryDropdown(!showHotelCategoryDropdown);
                    setShowTravelTypeDropdown(false);
                    setShowAmenitiesDropdown(false);
                  }}>
                  <Text className={`text-base ${hotelCategory ? 'text-gray-900' : 'text-gray-400'}`}>
                    {hotelCategory || 'Select hotel category'}
                  </Text>
                  <Ionicons
                    name={showHotelCategoryDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#0E54EC"
                  />
                </Pressable>
                {showHotelCategoryDropdown && (
                  <ScrollView
                    style={{
                      position: 'absolute',
                      top: 56,
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: '#E5E7EB',
                      zIndex: 999,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 5,
                      maxHeight: 200,
                    }}>
                    {HOTEL_CATEGORIES.map((category) => (
                      <Pressable
                        key={category}
                        className={`px-4 py-3 ${hotelCategory === category ? 'bg-[#0E54EC]/10' : ''}`}
                        onPress={() => {
                          setHotelCategory(category);
                          setShowHotelCategoryDropdown(false);
                        }}>
                        <Text
                          className={`text-base ${hotelCategory === category ? 'font-semibold text-[#0E54EC]' : 'text-gray-700'}`}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>

              <View className="mb-6">
                <Text className="mb-1 text-gray-700 font-medium">Coins to use (optional)</Text>
                <TextInput
                  value={requestedCoins}
                  onChangeText={setRequestedCoins}
                  keyboardType="number-pad"
                  placeholder="e.g. 100"
                  className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-base"
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="rounded-full bg-[#0E54EC] py-3">
                {loading ? (
                  <Text className="text-center text-white font-semibold text-base">Submitting...</Text>
                ) : (
                  <Text className="text-center text-white font-semibold text-base">Submit</Text>
                )}
      </TouchableOpacity>
            </View>
          )}
    </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Confirmation Modal */}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent
        onRequestClose={handleModalClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 24,
              width: '100%',
              maxWidth: 400,
              alignItems: 'center',
            }}>
            {/* Icon */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#0E54EC',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Text style={{ fontSize: 40, color: 'white' }}>✓</Text>
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: 12,
                textAlign: 'center',
              }}
              className='font-baloo'
              >
              Thank You for Booking with FestGo!
            </Text>

            {/* Message */}
            <Text
              style={{
                fontSize: 14,
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: 24,
                lineHeight: 20,
              }}
              className='font-baloo'
              >
              Our event manager will contact you within 2 hours to confirm your details. Please keep
              your phone available.
            </Text>

            {/* OK Button */}
            <TouchableOpacity
              onPress={handleModalClose}
              style={{
                backgroundColor: '#0E54EC',
                borderRadius: 25,
                paddingVertical: 12,
                paddingHorizontal: 40,
                width: '100%',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomMenu />
    </View> 
  );
};

export default TripPlan;
