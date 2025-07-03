import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import BackIcon from '~/assets/icons/hotelBooking/BackIcon.svg';
import SearchIcon from '~/assets/icons/search.svg';
import LocationIcon from '~/assets/icons/navigationPin.svg';
import { API_URL } from '~/utils/api';
import { SearchParams } from '~/screens/HotelBooking/HotelBookingSearch';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TABS = ['Hotels', 'Resorts', 'HourlyStay'];

// Mock data for recent and popular searches
const RECENT_SEARCHES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Vishakapatnam'];
const POPULAR_SEARCHES = ['Goa', 'Udaipur', 'Jaipur', 'Kerala', 'Manali', 'Shimla'];
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Generate months for date picker
const generateMonths = () => {
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      monthName: date.toLocaleDateString('en', { month: 'long', year: 'numeric' }),
      days: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      firstDay: date.getDay(),
    });
  }

  return months;
};

const HotelBookingCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Hotels');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [guestsModalVisible, setGuestsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Location state
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Date state
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState('Select dates');

  // Guests state
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestsText, setGuestsText] = useState('1 Room, 2 Adults');

  const navigation = useNavigation<MainTabNavigationProp>();
  const months = generateMonths();

  // Update guests text when values change
  useEffect(() => {
    let text = `${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Adult${adults > 1 ? 's' : ''}`;
    if (children > 0) {
      text += `, ${children} Child${children > 1 ? 'ren' : ''}`;
    }
    setGuestsText(text);
  }, [rooms, adults, children]);

  // Location handlers
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setLocationSearch(location);
    setLocationModalVisible(false);
  };

  const handleNearMeLocation = async () => {
    // Mock location for demo - in real app, use geolocation
    console.log('Requesting location permissions');
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    console.log('Getting current position');
    let location = await Location.getCurrentPositionAsync({});
    console.log('Current position:', location.coords);
    handleLocationSelect('Current Location');
  };

  // Date handlers
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      if (date >= selectedStartDate) {
        setSelectedEndDate(date);
      } else {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate) return false;
    if (!selectedEndDate) return date.getTime() === selectedStartDate.getTime();

    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateRangeStart = (date: Date) => {
    return selectedStartDate && date.getTime() === selectedStartDate.getTime();
  };

  const isDateRangeEnd = (date: Date) => {
    return selectedEndDate && date.getTime() === selectedEndDate.getTime();
  };

  const handleDateModalClose = () => {
    if (selectedStartDate && selectedEndDate) {
      const startStr = selectedStartDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
      const endStr = selectedEndDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
      setDateRange(`${startStr} - ${endStr}`);
    }
    setDateModalVisible(false);
  };

  // Guest handlers
  const incrementValue = (type: 'rooms' | 'adults' | 'children') => {
    switch (type) {
      case 'rooms':
        if (rooms < 10) setRooms(rooms + 1);
        break;
      case 'adults':
        if (adults < 20) setAdults(adults + 1);
        break;
      case 'children':
        if (children < 10) setChildren(children + 1);
        break;
    }
  };

  const decrementValue = (type: 'rooms' | 'adults' | 'children') => {
    switch (type) {
      case 'rooms':
        if (rooms > 1) setRooms(rooms - 1);
        break;
      case 'adults':
        if (adults > 1) setAdults(adults - 1);
        break;
      case 'children':
        if (children > 0) setChildren(children - 1);
        break;
    }
  };

  // Search handler
  const handleSearch = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location');
      return;
    }

    if (!selectedStartDate || !selectedEndDate) {
      Alert.alert('Error', 'Please select check-in and check-out dates');
      return;
    }

    setLoading(true);

    try {
      const stayNights = Math.ceil(
        (selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const requestBody: SearchParams = {
        property_type:
          activeTab === 'Hotels' ? 'Hotel' : activeTab === 'Resorts' ? 'Resort' : 'HourlyStay',
        latitude: null,
        longitude: null,
        location: selectedLocation,
        rooms: rooms.toString(),
        adult: adults.toString(),
        child: children.toString(),
        todate: selectedStartDate.toLocaleDateString('en-GB'),
        enddate: selectedEndDate.toLocaleDateString('en-GB'),
        staynight: stayNights.toString(),
      };
      // console.log('Search request body:', requestBody);
      const response = await fetch(`${API_URL}/properties/p/active-r`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to search results with the data
        navigation.navigate('HotelBookingSearch', {
          searchResults: data,
          searchParams: requestBody,
        });
        console.log('Search results:', data);
      } else {
        Alert.alert('Error', data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCalendarDay = (day: number, monthData: any) => {
    const date = new Date(monthData.year, monthData.month, day);
    const isDisabled = isDateDisabled(date);
    const inRange = isDateInRange(date);
    const isStart = isDateRangeStart(date);
    const isEnd = isDateRangeEnd(date);

    return (
      <TouchableOpacity
        key={day}
        disabled={isDisabled}
        onPress={() => handleDateSelect(date)}
        style={{
          width: `${100 / 7}%`,
          aspectRatio: 1,
          borderRadius: isStart || isEnd ? 20 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDisabled
            ? 'transparent'
            : isStart || isEnd
              ? '#02AFFF'
              : inRange
                ? '#02AFFF13'
                : 'transparent',
          opacity: isDisabled ? 0.3 : 1,
        }}>
        <Text
          style={{
            color: isDisabled
              ? '#D1D5DB'
              : isStart || isEnd
                ? '#FFFFFF'
                : inRange
                  ? '#0E54EC'
                  : '#1F2937',
            fontWeight: isStart || isEnd ? '700' : '500',
            fontFamily: 'Poppins',
          }}>
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMonth = (monthData: any) => {
    const days = [];
    const { firstDay, days: totalDays } = monthData;

    // Fill initial empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={{ width: 48, height: 48, margin: 4 }} />);
    }

    // Fill day slots
    for (let day = 1; day <= totalDays; day++) {
      days.push(renderCalendarDay(day, monthData));
    }

    // Split into rows of 7
    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(
        <View key={`week-${i}`} style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          {days.slice(i, i + 7)}
        </View>
      );
    }

    return (
      <View key={`${monthData.year}-${monthData.month}`} style={{ marginBottom: 24 }}>
        {/* Month title */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: '#1F2937',
            paddingHorizontal: 16,
            marginBottom: 16,
            fontFamily: 'Poppins',
          }}>
          {monthData.monthName}
        </Text>

        {/* Weekday headers */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: 8,
            paddingHorizontal: 8,
          }}>
          {DAYS_OF_WEEK.map((day) => (
            <View key={day} style={{ width: 48, height: 24, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#6B7280',
                  fontWeight: '500',
                  fontFamily: 'Poppins',
                }}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar days grid */}
        <View style={{ paddingHorizontal: 8 }}>{rows}</View>
      </View>
    );
  };

  return (
    <>
      <View className="absolute -bottom-1/2 mx-4 w-[85%] rounded-[30px] bg-white p-7 shadow-md">
        {/* Tabs */}
        <View className="mx-1 mb-4 flex-row justify-between overflow-hidden rounded-full bg-blue-100">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-3 ${activeTab === tab ? 'rounded-full bg-[#0E54EC]' : 'bg-blue-100'}`}
              onPress={() => setActiveTab(tab)}>
              <Text className={`text-center ${activeTab === tab ? 'text-white' : 'text-black'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location */}
        <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
          <View className="mb-4 rounded-2xl border border-[#00000024] p-3 py-4">
            <Text className="text-gray-700">{selectedLocation || 'Select Location'}</Text>
          </View>
        </TouchableOpacity>

        {/* Date and Guests */}
        <View className="flex-row space-x-4">
          <TouchableOpacity
            onPress={() => setDateModalVisible(true)}
            className="flex-1 rounded-l-2xl border-y border-l border-[#00000024] p-3">
            <Text className="text-sm text-gray-500">Date</Text>
            <Text className="text-gray-700">{dateRange}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGuestsModalVisible(true)}
            className="flex-1 rounded-r-2xl border border-[#00000024] p-3">
            <Text className="text-sm text-gray-500">Guests</Text>
            <Text className="text-gray-700">{guestsText}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          onPress={handleSearch}
          disabled={loading}
          className={`mt-6 rounded-full py-3 ${loading ? 'bg-gray-400' : 'bg-[#0E54EC]'}`}>
          <Text className="text-center text-lg font-semibold text-white">
            {loading ? 'Searching...' : 'Search'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location Modal */}
      <Modal
        visible={locationModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setLocationModalVisible(false)}>
        <View className="flex-1 bg-white ">
          {/* Header */}
          <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>

          <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
            <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text className="text-center text-lg font-semibold">Select Location</Text>
            <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
              <Text className="font-medium text-[#0E54EC]">Done</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="mx-6 mb-6 mt-4 flex-row items-center rounded-xl border border-gray-300 px-4 py-3">
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Search location..."
              value={locationSearch}
              onChangeText={(text) => setLocationSearch(text)}
              autoFocus
            />
            <SearchIcon width={20} height={20} color="#666" />
          </View>

          <ScrollView className="flex-1">
            {/* Near Me */}
            <TouchableOpacity
              onPress={handleNearMeLocation}
              className="flex-row items-center border-b border-gray-100 bg-[#023E8A]/10 px-6 py-6">
              <LocationIcon width={20} height={20} color="#0E54EC" />
              <View className="ml-3">
                <Text className="font-poppins font-medium text-[#0E54EC]">Near me</Text>
                <Text className="font-poppins text-sm text-gray-500">
                  Properties near your current location
                </Text>
              </View>
            </TouchableOpacity>

            {/* Recent Searches */}
            <View className="mt-6 px-6 ">
              <Text className="mb-3 font-poppins font-semibold text-gray-800">Recent Searches</Text>
              {RECENT_SEARCHES.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleLocationSelect(location)}
                  className="border-b border-gray-100 py-3">
                  <Text className="font-poppins text-gray-700">{location}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Popular Searches */}
            <View className="mb-6 mt-6 px-6">
              <Text className="mb-3 font-poppins font-semibold text-gray-800">
                Popular Destinations
              </Text>
              {POPULAR_SEARCHES.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleLocationSelect(location)}
                  className="border-b border-gray-100 py-3">
                  <Text className="font-poppins text-gray-700">{location}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Date Modal */}
      <Modal
        visible={dateModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleDateModalClose}>
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>

          <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
            <TouchableOpacity onPress={handleDateModalClose}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">Select Dates</Text>
            <TouchableOpacity onPress={handleDateModalClose}>
              <Text className="font-medium text-[#0E54EC]">Done</Text>
            </TouchableOpacity>
          </View>

          {/* Date Info */}
          <View className=" px-6 py-4">
            <View className="flex-row rounded-lg  border border-[#00000024] bg-white">
              <View className="w-1/2 flex-col items-start justify-between border-r border-[#00000020] px-4 py-4 pl-5">
                <Text className="font-poppins  text-lg font-semibold">Check-in</Text>
                <Text className="font-poppins text-xl text-[#02AFFF]">
                  {selectedStartDate
                    ? selectedStartDate.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Select date'}
                </Text>
              </View>
              <View className="w-1/2 flex-col items-start justify-between px-4 py-4 pl-5">
                <Text className="font-poppins text-lg font-semibold">Check-out</Text>
                <Text className="font-poppins text-xl text-[#02AFFF]">
                  {selectedEndDate
                    ? selectedEndDate.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Select date'}
                </Text>
              </View>
            </View>
          </View>

          {/* Calendar */}
          <ScrollView className="flex-1 px-6 py-4">
            {months.map((monthData) => renderMonth(monthData))}
          </ScrollView>
        </View>
      </Modal>

      {/* Guests Modal */}
      <Modal
        visible={guestsModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setGuestsModalVisible(false)}>
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>

          <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
            <TouchableOpacity onPress={() => setGuestsModalVisible(false)}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">Guests & Rooms</Text>
            <TouchableOpacity onPress={() => setGuestsModalVisible(false)}>
              <Text className="font-medium text-[#0E54EC]">Done</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-6 py-6">
            {/* Rooms */}
            <View className="flex-row items-center justify-between border-b border-gray-100 py-6">
              <Text className="text-lg text-gray-800">Rooms</Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => decrementValue('rooms')}
                  className="h-10 w-10 items-center justify-center rounded-full border border-gray-300">
                  <Text className="text-xl text-gray-600">-</Text>
                </TouchableOpacity>
                <Text className="mx-6 text-lg font-semibold">{rooms}</Text>
                <TouchableOpacity
                  onPress={() => incrementValue('rooms')}
                  className="h-10 w-10 items-center justify-center rounded-full border border-gray-300">
                  <Text className="text-xl text-gray-600">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Adults */}
            <View className="flex-row items-center justify-between border-b border-gray-100 py-6">
              <View>
                <Text className="text-lg text-gray-800">Adults</Text>
                <Text className="text-sm text-gray-500">Age 18+</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => decrementValue('adults')}
                  className="h-10 w-10 items-center justify-center rounded-full border border-gray-300">
                  <Text className="text-xl text-gray-600">-</Text>
                </TouchableOpacity>
                <Text className="mx-6 text-lg font-semibold">{adults}</Text>
                <TouchableOpacity
                  onPress={() => incrementValue('adults')}
                  className="h-10 w-10 items-center justify-center rounded-full border border-gray-300">
                  <Text className="text-xl text-gray-600">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Children */}
            <View className="flex-row items-center justify-between py-6">
              <View>
                <Text className="text-lg text-gray-800">Children</Text>
                <Text className="text-sm text-gray-500">Age 0-17</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => decrementValue('children')}
                  className="h-10 w-10 items-center justify-center rounded-full border border-gray-300">
                  <Text className="text-xl text-gray-600">-</Text>
                </TouchableOpacity>
                <Text className="mx-6 text-lg font-semibold">{children}</Text>
                <TouchableOpacity
                  onPress={() => incrementValue('children')}
                  className="h-10 w-10 items-center justify-center rounded-full border border-gray-300">
                  <Text className="text-xl text-gray-600">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default HotelBookingCard;
