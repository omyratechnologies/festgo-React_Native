import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import BottomMenu from '~/components/common/BottomMenu';
import HotelBookingHeaderMenu from '~/components/HotelBooking/HotelBookingHeaderMenu';
import EventDetailBackgroundImage from '~/assets/images/events/EventDetailBackground.svg';
import { Picker } from '@react-native-picker/picker';

const EVENT_TYPES = ['Conference', 'Wedding', 'Birthday', 'Concert', 'Other'];
const VENUE_OPTIONS = ['Indoor', 'Outdoor'];
type AdditionalServiceKey = 'decoration' | 'djBand' | 'returnGifts' | 'transportation' | 'others';
type Additional = {
  decoration: boolean;
  djBand: boolean;
  returnGifts: boolean;
  transportation: boolean;
  others: boolean;
  othersText: string;
};

const ADDITIONAL_SERVICES: { key: AdditionalServiceKey; label: string }[] = [
  { key: 'decoration', label: 'Decoration' },
  { key: 'djBand', label: 'DJ/Band' },
  { key: 'returnGifts', label: 'Return Gifts' },
  { key: 'transportation', label: 'Transportation' },
  { key: 'others', label: 'Others' },
];

const EventInfoPage = () => {
  const [form, setForm] = useState<{
    location: string;
    eventType: string;
    date: Date;
    showDatePicker: boolean;
    showEventTypeOptions: boolean;
    budget: string;
    guests: string;
    themeImage: string | null;
    venue: string;
    soundSystem: string;
    photography: string;
    additional: Additional;
  }>({
    location: '',
    eventType: '',
    date: new Date(),
    showDatePicker: false,
    showEventTypeOptions: false,
    budget: '',
    guests: '',
    themeImage: null,
    venue: '',
    soundSystem: '',
    photography: '',
    additional: {
      decoration: false,
      djBand: false,
      returnGifts: false,
      transportation: false,
      others: false,
      othersText: '',
    },
  });

  const handleInput = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdditional = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      additional: { ...prev.additional, [key]: value },
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      handleInput('themeImage', result.assets[0].uri);
    }
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    handleInput('showDatePicker', Platform.OS === 'ios');
    if (selectedDate) handleInput('date', selectedDate);
  };

  const handleSubmit = () => {
    // Submit logic here
    // e.g., validate and send form data
  };

  return (
    <View className="flex-1 bg-white">
      <HotelBookingHeaderMenu />
      <ScrollView className="mt-28 p-4">
        <View className="rounded-2xl bg-white p-4 pb-44">
          <EventDetailBackgroundImage
            width="100%"
            height={200}
            style={{ marginBottom: 16 }}
            preserveAspectRatio="none"
          />

          {/* Event Location */}
          <Text className="mb-2 font-poppins font-medium text-gray-700">Event Location</Text>
          <TextInput
            className="mb-4 rounded-xl border border-[#00000036] px-4 py-3 focus:border-[#0E54EC]"
            placeholder="Enter location"
            value={form.location}
            onChangeText={(v) => handleInput('location', v)}
            placeholderTextColor="#9CA3AF"
          />
            <Text className="mb-2 font-poppins font-medium text-gray-700">Event Type</Text>
            <View style={{ zIndex: 100 }}>
              <Pressable
                className="mb-4 relative rounded-xl border border-[#00000036] bg-white px-4 py-3 flex-row items-center justify-between"
                onPress={() => handleInput('showEventTypeOptions', !form.showEventTypeOptions)}
              >
                <Text className={`font-poppins text-base ${form.eventType ? 'text-gray-900' : 'text-gray-400'}`}>
                  {form.eventType || 'Select event type'}
                </Text>
                <Ionicons
                  name={form.showEventTypeOptions ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#0E54EC"
                />
              </Pressable>
              {form.showEventTypeOptions && (
                <View
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
                  }}
                >
                  {EVENT_TYPES.map((type) => (
                    <Pressable
                      key={type}
                      className={`px-4 py-3 ${form.eventType === type ? 'bg-[#0E54EC]/10' : ''}`}
                      onPress={() => {
                        handleInput('eventType', type);
                        handleInput('showEventTypeOptions', false);
                      }}
                    >
                      <Text className={`font-poppins text-base ${form.eventType === type ? 'text-[#0E54EC] font-semibold' : 'text-gray-700'}`}>
                        {type}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>


          {/* Event Date */}
            <Text className="mb-2 font-poppins font-medium text-gray-700">Event Date</Text>
            <TouchableOpacity
              className="mb-4 flex-row items-center rounded-xl border border-[#00000036] px-4 py-3"
              onPress={() => handleInput('showDatePicker', true)}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={20} color="#0E54EC" style={{ marginRight: 8 }} />
              <Text className="text-gray-700">{form.date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {form.showDatePicker && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 9999,
                }}
              >
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    padding: 16,
                    width: '100%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 10,
                  }}
                >
                  <DateTimePicker
                    value={form.date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === 'android') {
                        handleInput('showDatePicker', false);
                        if (selectedDate) handleInput('date', selectedDate);
                      } else if (event.type === 'set' && selectedDate) {
                        handleInput('date', selectedDate);
                      }
                    }}
                    minimumDate={new Date()}
                    style={{ backgroundColor: 'white', borderRadius: 12 }}
                  />
                  <TouchableOpacity
                    className="mt-4 items-center rounded-xl bg-[#0E54EC] py-3"
                    onPress={() => handleInput('showDatePicker', false)}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-semibold text-base">Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}


          {/* Event Budget */}
          <Text className="mb-2 font-poppins font-medium text-gray-700">Event Budget (₹)</Text>
          <TextInput
            className="mb-4 rounded-xl font-poppins border border-[#00000036] px-4 py-3 focus:border-[#0E54EC]"
            placeholder="Enter budget"
            keyboardType="numeric"
            value={form.budget}
            onChangeText={(v) => handleInput('budget', v.replace(/[^0-9]/g, ''))}
            placeholderTextColor="#9CA3AF"
          />

          {/* Number of Guests */}
          <Text className="mb-2 font-poppins font-medium text-gray-700">Number of Guests</Text>
          <TextInput
            className="mb-4 font-poppins rounded-xl border border-[#00000036] px-4 py-3 focus:border-[#0E54EC]"
            placeholder="Enter number"
            keyboardType="numeric"
            value={form.guests}
            onChangeText={(v) => handleInput('guests', v.replace(/[^0-9]/g, ''))}
            placeholderTextColor="#9CA3AF"
          />

          {/* Reference Theme Image Upload */}
          <Text className="mb-2 font-poppins font-medium text-gray-700">Reference Theme Image</Text>
          <TouchableOpacity
            className="mb-4 font-poppins items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6"
            onPress={pickImage}
            activeOpacity={0.7}>
            {form.themeImage ? (
              <Image
                source={{ uri: form.themeImage }}
                className="mb-2 h-20 w-32 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="image-outline" size={32} color="#9CA3AF" />
            )}
            <Text className="mt-2 text-gray-500">
              {form.themeImage ? 'Change Image' : 'Upload Image'}
            </Text>
          </TouchableOpacity>

          {/* Venue Option Radio Buttons */}
          <Text className="mb-2 font-poppins font-medium text-gray-700">Venue Option</Text>
          <View className="mb-4 flex-col gap-2 items-start">
            {VENUE_OPTIONS.map((option) => (
              <Pressable
                key={option}
                className={`mr-6 flex-row items-center rounded-lg py-2`}
                onPress={() => handleInput('venue', option)}>
                <View
                  className={`mr-2 h-5 w-5 rounded-full border-2 ${
                    form.venue === option
                      ? 'border-[#0E54EC] bg-[#0E54EC]'
                      : 'border-gray-300 bg-white'
                  }`}
                />
                <Text
                  className={`text-base font-poppins ${
                    form.venue === option ? 'font-semibold text-[#0E54EC]' : 'text-gray-700'
                  }`}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Sound System Yes/No */}
          <Text className="mb-2 font-poppins font-medium text-gray-700">Sound System</Text>
          <View className="mb-4 flex-col item-start">
            {['Referred by FestGo', 'Not Required'].map((val) => (
              <Pressable
                key={val}
                className={`mr-6 flex-row items-center rounded-lg py-2`}
                onPress={() => handleInput('soundSystem', val)}>
                <View
                  className={`mr-2 h-5 w-5 rounded-full border-2 ${
                    form.soundSystem === val
                      ? 'border-[#0E54EC] bg-[#0E54EC]'
                      : 'border-gray-300 bg-white'
                  }`}
                />
                <Text
                  className={`font-poppins text-base ${
                    form.soundSystem === val ? 'font-semibold text-[#0E54EC]' : 'text-gray-700'
                  }`}>
                  {val}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Photography Yes/No */}
          <Text className="mb-2 font-poppins font-medium text-gray-700">Photography</Text>
          <View className="mb-4 flex-col items-start">
            {['Referred by FestGo', 'Not Required'].map((val) => (
              <Pressable
                key={val}
                className={`mr-6 flex-row items-center rounded-lg py-2`}
                onPress={() => handleInput('photography', val)}>
                <View
                  className={`mr-2 h-5 w-5 rounded-full border-2 ${
                    form.photography === val
                      ? 'border-[#0E54EC] bg-[#0E54EC]'
                      : 'border-gray-300 bg-white'
                  }`}
                />
                <Text
                  className={`text-base font-poppins ${
                    form.photography === val ? 'font-semibold text-[#0E54EC]' : 'text-gray-700'
                  }`}>
                  {val}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Additional Services */}
          <Text className="mb-2 font-poppins font-medium text-gray-700">Additional Services</Text>
          <View className="mb-4">
            {ADDITIONAL_SERVICES.map((service) => (
              <View key={service.key} className="mb-2 flex-row items-center">
                <Pressable
                  className={`mr-3 h-5 w-5 items-center justify-center rounded border-2 ${
                    form.additional[service.key]
                      ? 'border-[#0E54EC] bg-[#0E54EC]'
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => handleAdditional(service.key, !form.additional[service.key])}>
                  {form.additional[service.key] && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </Pressable>
                <Text className="font-poppins text-base text-gray-700">{service.label}</Text>
                {service.key === 'others' && form.additional.others && (
                  <TextInput
                    className="ml-3 flex-1 rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2"
                    placeholder="Please specify"
                    value={form.additional.othersText}
                    onChangeText={(v) => handleAdditional('othersText', v)}
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              </View>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="mt-4 items-center rounded-xl bg-[#0E54EC] py-4"
            onPress={handleSubmit}
            activeOpacity={0.8}>
            <Text className="text-lg font-poppins font-bold text-white">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default EventInfoPage;
