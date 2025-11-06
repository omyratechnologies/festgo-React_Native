import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '~/utils/api';
import { MainTabNavigationProp } from '~/navigation/types';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import { Button } from '~/components/ui/Button';
import Checkbox from '~/components/ui/Checkbox';
import { Ionicons } from '@expo/vector-icons';
import FestBiteIcon from '~/assets/images/homepage/details/FestBite.svg';
import HotelBookingHeaderMenu from '~/components/HotelBooking/HotelBookingHeaderMenu';
import HotelBackgroundImage from '~/assets/images/homepage/HomeBackground.svg';

interface MenuType {
  id: string;
  typeName: string;
  createdAt: string;
  updatedAt: string;
}

interface MenuItem {
  id: string;
  itemName: string;
  menuTypeId: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const FestBite = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0: form, 1: menu, 2: details

  // Step 0: Initial Form State
  const [occasion, setOccasion] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [preferredDate, setPreferredDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Step 1: Menu Selection State
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [selectedMenuType, setSelectedMenuType] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState<Set<string>>(new Set());
  const [loadingMenuTypes, setLoadingMenuTypes] = useState(false);
  const [loadingMenuItems, setLoadingMenuItems] = useState(false);

  // Step 2: Final Form State
  const [numberOfVegEaters, setNumberOfVegEaters] = useState('');
  const [numberOfNonVegEaters, setNumberOfNonVegEaters] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [cateringServersRequired, setCateringServersRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch menu types on mount
  useEffect(() => {
    fetchMenuTypes();
  }, []);

  // Fetch menu items when menu type is selected
  useEffect(() => {
    if (selectedMenuType) {
      fetchMenuItems(selectedMenuType);
    }
  }, [selectedMenuType]);

  const fetchMenuTypes = async () => {
    try {
      setLoadingMenuTypes(true);
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (!jwtToken) {
        Alert.alert('Error', 'Please login to continue');
        return;
      }

      const response = await fetch(`${API_URL}/festbite/menu-types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMenuTypes(data);
      if (data.length > 0) {
        setSelectedMenuType(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching menu types:', error);
      Alert.alert('Error', 'Failed to load menu types. Please try again.');
    } finally {
      setLoadingMenuTypes(false);
    }
  };

  const fetchMenuItems = async (menuTypeId: string) => {
    try {
      setLoadingMenuItems(true);
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (!jwtToken) {
        return;
      }

      const response = await fetch(`${API_URL}/festbite/menu-items/type/${menuTypeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      Alert.alert('Error', 'Failed to load menu items. Please try again.');
    } finally {
      setLoadingMenuItems(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setPreferredDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleMenuItem = (itemId: string) => {
    setSelectedMenuItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (step === 0) {
      if (!occasion || !numberOfGuests) {
        Alert.alert('Missing Information', 'Please fill all required fields');
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (selectedMenuItems.size === 0) {
        Alert.alert('Missing Information', 'Please select at least one menu item');
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep((s) => (s > 0 ? ((s - 1) as any) : s));
    }
  };

  const handleSubmit = async () => {
    if (!numberOfVegEaters || !numberOfNonVegEaters || !eventLocation) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (!jwtToken) {
        Alert.alert('Error', 'Please login to continue');
        return;
      }

      const bookingData = {
        occasion,
        numberOfGuests: parseInt(numberOfGuests),
        preferredDate: preferredDate.toISOString().split('T')[0],
        selectedMenuItems: Array.from(selectedMenuItems),
        numberOfVegEaters: parseInt(numberOfVegEaters),
        numberOfNonVegEaters: parseInt(numberOfNonVegEaters),
        eventLocation,
        referralCode: referralCode || undefined,
        cateringServersRequired,
      };

      console.log(JSON.stringify(bookingData))
      // TODO: Replace with actual API endpoint
      const response = await fetch(`${API_URL}/festbite/festbites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert(
        'Thank You For Booking with FestGo!',
        'Our event manager will contact you within 2 hours to confirm your details. Please keep your phone available.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('HomePage');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting booking:', error);
      Alert.alert('Error', 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <View className="mb-6 mt-4 flex-row items-center justify-center gap-2">
        {[0, 1, 2].map((i) => {
          const isActive = i === step;
          return (
            <View
              key={i}
              className={`h-2 rounded-full ${isActive ? 'w-9 bg-[#0E54EC]' : 'w-3 bg-[#D9D9D9]'}`}
            />
          );
        })}
      </View>
    );
  };

  const renderStep0 = () => {
    return (
      <View className="flex-1">
        {/* Branding Area */}
      
        <View className="mb-6 rounded-2xl bg-white p-6">
          <Text className="mb-6 font-baloo text-2xl font-bold text-gray-800">Let's Get Started</Text>

          {/* Occasion */}
          <View className="mb-4">
            <Text className="mb-2 font-baloo text-base font-medium text-gray-700">What's the occasion?</Text>
            <View className="flex-row items-center rounded-[35px] border border-[#A4A4A4] bg-white px-[25px] py-3">
              <TextInput
                className=" flex-1 text-gray-800 font-poppins"
                placeholder="Select an occasion"
                placeholderTextColor="#9CA3AF"
                value={occasion}
                onChangeText={setOccasion}
              />
            </View>
          </View>

          {/* Number of Guests */}
          <View className="mb-4">
            <Text className="mb-2 font-baloo text-base font-medium text-gray-700">Number of guests</Text>
            <View className="flex-row items-center rounded-[35px] border border-[#A4A4A4] bg-white px-[25px] py-3">
              <Ionicons name="people-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="ml-2 flex-1 text-gray-800 font-poppins"
                placeholder="Enter Number of guests"
                placeholderTextColor="#9CA3AF"
                value={numberOfGuests}
                onChangeText={setNumberOfGuests}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Preferred Date */}
          <View className="mb-4">
            <Text className="mb-2 font-baloo text-base font-medium text-gray-700">Preferred date</Text>
            <TouchableOpacity
              onPress={() => {
                setShowDatePicker(true);
                Keyboard.dismiss();
              }}
              className="flex-row items-center rounded-[35px] border border-[#A4A4A4] bg-white px-[25px] py-3">
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              <Text className="ml-2 flex-1 text-gray-800">{formatDate(preferredDate)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <View className="mt-2">
                <DateTimePicker
                  value={preferredDate}
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
        </View>

        <Button title="Next" onPress={handleNext} className="mb-4" variant="secondary" />
        {renderStepIndicator()}
      </View>
    );
  };

  const renderStep1 = () => {
    return (
      <View className="flex-1">
        <View className="mb-4">
          {/* Menu Type Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-4 px-4 pt-12">
              {menuTypes.map((type) => {
                const isActive = selectedMenuType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => setSelectedMenuType(type.id)}
                    className="items-center">
                    <Text
                      className={`font-baloo text-base capitalize font-semibold ${
                        isActive ? 'text-[#F15A29]' : 'text-gray-600'
                      }`}>
                      {type.typeName}
                    </Text>
                    {isActive && (
                      <View className="mt-1 h-0.5 w-full bg-[#F15A29]" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Menu Items */}
          {loadingMenuItems ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#0E54EC" />
            </View>
          ) : (
            <ScrollView className="flex-1 px-4">
              {menuItems.map((item) => {
                const isSelected = selectedMenuItems.has(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => toggleMenuItem(item.id)}
                    className={`mb-3 flex-row items-center rounded-xl border p-4 ${
                      isSelected ? 'border-[#0E54EC] bg-[#0E54EC]/10' : 'border-gray-300 bg-white'
                    }`}>
                    <View className="flex-1">
                      <Text className="font-baloo text-base font-semibold text-gray-800">{item.itemName}</Text>
                    </View>
                    {item.imageUrl && (
                      <Image
                        source={{ uri: item.imageUrl }}
                        className="ml-3 h-16 w-16 rounded-lg"
                        resizeMode="cover"
                      />
                    )}
                    {isSelected && (
                      <View className="absolute right-2 top-2">
                        <Ionicons name="checkmark-circle" size={24} color="#0E54EC" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
              {menuItems.length === 0 && (
                <View className="py-10">
                  <Text className="text-center font-baloo text-gray-500">No menu items available</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>

        <Button title="Next" onPress={handleNext} className="mb-4" variant='secondary' />
        {renderStepIndicator()}
      </View>
    );
  };

  const renderStep2 = () => {
    return (
      <View className="flex-1">
        <View className="mb-6 rounded-2xl bg-white p-6">
          <Text className="mb-6 font-baloo text-2xl font-bold text-gray-800">Catering</Text>

          {/* Number of Veg Eaters */}
          <View className="mb-4">
            <Text className="mb-2 font-baloo text-base font-medium text-gray-700">Number of Veg eaters</Text>
            <View className="flex-row items-center rounded-[35px] border border-[#A4A4A4] bg-white px-[25px] py-3">
              <Ionicons name="leaf-outline" size={20} color="#00A450" />
              <TextInput
                className="ml-2 flex-1 text-gray-800 font-poppins"
                placeholder="Enter number of people who eat veg"
                placeholderTextColor="#9CA3AF"
                value={numberOfVegEaters}
                onChangeText={setNumberOfVegEaters}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Number of Non-Veg Eaters */}
          <View className="mb-4">
            <Text className="mb-2 font-baloo text-base font-medium text-gray-700">Number of Non-Veg eaters</Text>
            <View className="flex-row items-center rounded-[35px] border border-[#A4A4A4] bg-white px-[25px] py-3">
              <Ionicons name="restaurant-outline" size={20} color="#F15A29" />
              <TextInput
                className="ml-2 flex-1 text-gray-800 font-poppins"
                placeholder="Enter number of people who eat non veg"
                placeholderTextColor="#9CA3AF"
                value={numberOfNonVegEaters}
                onChangeText={setNumberOfNonVegEaters}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Event Location */}
          <View className="mb-4">
            <Text className="mb-2 font-baloo text-base font-medium text-gray-700">Event Location</Text>
            <View className="flex-row items-center rounded-[35px] border border-[#A4A4A4] bg-white px-[25px] py-3">
              <Ionicons name="location-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="ml-2 flex-1 text-gray-800 font-poppins"
                placeholder="Enter your location"
                placeholderTextColor="#9CA3AF"
                value={eventLocation}
                onChangeText={setEventLocation}
              />
            </View>
          </View>

          {/* Referral Code */}
          <View className="mb-4">
            <Text className="mb-2 font-baloo text-base font-medium text-gray-700">Referral Code (optional)</Text>
            <View className="flex-row items-center rounded-[35px] border border-[#A4A4A4] bg-white px-[25px] py-3">
              <Ionicons name="person-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="ml-2 flex-1 text-gray-800 font-poppins"
                placeholder="Enter your Referral code"
                placeholderTextColor="#9CA3AF"
                value={referralCode}
                onChangeText={setReferralCode}
              />
            </View>
          </View>

          {/* Catering Servers Required */}
          <View className="mb-4 flex-row items-center">
            <Checkbox
              checked={cateringServersRequired}
              onCheck={setCateringServersRequired}
              className="mr-3"
            />
            <Text className="font-baloo text-base text-gray-700">Catering servers required</Text>
          </View>
        </View>

        <Button
          title={submitting ? 'Submitting...' : 'Submit'}
          onPress={handleSubmit}
          disabled={submitting}
          loading={submitting}
          className="mb-4"
          variant='secondary'
        />
        {renderStepIndicator()}
      </View>
    );
  };

  const getStepTitle = () => {
    switch (step) {
      case 0:
        return 'FestBite';
      case 1:
        return 'Menu';
      case 2:
        return 'Catering';
      default:
        return 'FestBite';
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      className="bg-white">
       <View style={{ height: 280, position: 'relative' }}>
          {/* Header Menu at top */}
          <HotelBookingHeaderMenu white />
          {/* Background Image covers all */}
          <HotelBackgroundImage
            width="100%"
            height="100%"
            style={StyleSheet.absoluteFill}
            preserveAspectRatio="none"
          />
          {/* FestBiteIcon and text at bottom center */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '30%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FestBiteIcon width={120} height={60} />
            <Text className="mt-2 font-baloo text-sm font-medium text-white">
              Where Every Bite Feels Like a Festival
            </Text>
          </View>
        </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="flex-1 px-4 -mt-20 bg-white rounded-t-[40px]" contentContainerStyle={{ paddingBottom: 120 }}>
          {step === 0 && renderStep0()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </ScrollView>
      </TouchableWithoutFeedback>
      <BottomMenu />
    </KeyboardAvoidingView>
  );
};

export default FestBite;
