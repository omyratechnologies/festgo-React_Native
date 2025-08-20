import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '~/utils/api';
import useUserStore from '~/store/userStore';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

// --- Consistent TextInput Styles ---
const inputBaseClass =
  'rounded-lg border px-3 py-2 bg-white font-poppins text-base text-gray-800';
const inputActiveBorder = 'border-[#02AFFF]';
const inputInactiveBorder = 'border-gray-300';

interface EditProfileForm {
  _activeField: string;
  firstname: string;
  lastname: string;
  date_of_birth: string;
  gender: string;
  location: string;
  email: string;
  number: string;
  image_url: string;
  billing_address: string;
  pincode: string;
  state: string;
}

const EditProfile = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const { userData } = useUserStore();
  const [formData, setFormData] = useState<EditProfileForm>({
    firstname: '',
    lastname: '',
    date_of_birth: '',
    gender: '',
    location: '',
    email: '',
    number: '',
    image_url: '',
    billing_address: '',
    pincode: '',
    state: '',
    _activeField: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        date_of_birth: userData.date_of_birth || '',
        gender: userData.gender || '',
        location: userData.location || '',
        email: userData.email || '',
        number: userData.number || '',
        image_url: userData.image_url || '',
        billing_address: userData.billing_address || '',
        pincode: userData.pincode || '',
        state: userData.state || '',
        _activeField: '',
      });
      setEmailVerified(!!userData.email_verified);
      setPhoneVerified(!!userData.mobile_verified);
    }
  }, [userData]);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  }, []);

  const uploadImage = useCallback(async (uri: string) => {
    try {
      setIsUploading(true);
      const jwtToken = await AsyncStorage.getItem('jwtToken');

      if (!jwtToken) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'profile-image.jpg',
      } as any);

      const response = await fetch(`${API_URL}/upload/public`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, image_url: data.url }));
        Alert.alert('Success', 'Image uploaded successfully');
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDateChange = (_event: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
      const formattedDate = selected.toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, date_of_birth: formattedDate }));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const jwtToken = await AsyncStorage.getItem('jwtToken');

      if (!jwtToken) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await fetch(`${API_URL}/update-profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.status === 200) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = () => {
    Alert.alert('Info', 'Email verification feature will be implemented');
  };

  const handleVerifyPhone = () => {
    Alert.alert('Info', 'Phone verification feature will be implemented');
  };

  // --- Helper for consistent TextInput ---
  const renderInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    field,
    keyboardType = 'default',
    multiline = false,
    numberOfLines,
    onFocus,
    onBlur,
    ...rest
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    field: string;
    keyboardType?: any;
    multiline?: boolean;
    numberOfLines?: number;
    onFocus?: () => void;
    onBlur?: () => void;
    [key: string]: any;
  }) => (
    <View className="mb-4 flex-1 items-start w-full">
      <Text className="-mb-2 mx-2 z-10 px-2 bg-white font-poppins text-sm font-medium text-gray-700">
        {label}
      </Text>
      <View
        className={`${inputBaseClass} ${
          formData._activeField === field || (value && value.length > 0)
            ? inputActiveBorder
            : inputInactiveBorder
        } w-full`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="text-base text-gray-800 font-poppins py-1"
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => {
            setFormData((prev) => ({ ...prev, _activeField: field }));
            if (onFocus) onFocus();
          }}
          onBlur={() => {
            setFormData((prev) => ({ ...prev, _activeField: '' }));
            if (onBlur) onBlur();
          }}
          style={{
            borderColor: formData._activeField === field ? '#02AFFF' : undefined,
            padding: 0,
            margin: 0,
            backgroundColor: 'transparent',
          }}
          {...rest}
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">

      <ProfileHeaderMenu isDifferentPage pageTitle="Edit Profile" />
      <ScrollView className="mb-32 flex-1 px-4">
        {/* Profile Completion Banner */}
        <View className="mt-6">
          <View className="mx-4 rounded-xl bg-[#F15A29] p-4">
            <View className="h-3 overflow-hidden rounded-full bg-white">
              <View
                className="h-3 rounded-full"
                style={{
                  width: `${userData?.profileCompletion ? userData.profileCompletion : 0}%`,
                  backgroundColor: '#08F67C',
                }}
              />
            </View>
            <Text className="mt-2 font-baloo text-sm text-white">
              Your profile is{' '}
              {userData?.profileCompletion && userData.profileCompletion > 0
                ? userData.profileCompletion
                : 0}
              % completed.
            </Text>
          </View>
        </View>
        {/* Profile Photo Section */}
        <View className="items-center py-6">
          <TouchableOpacity onPress={pickImage} className="relative" disabled={isUploading}>
            <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200">
              {formData.image_url ? (
                <Image
                  source={{ uri: formData.image_url }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={40} color="#9CA3AF" />
              )}
            </View>
            {isUploading && (
              <View className="absolute inset-0 items-center justify-center rounded-full bg-black bg-opacity-50">
                <ActivityIndicator color="white" />
              </View>
            )}
            <View className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 p-1">
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="mt-2 font-poppins text-sm text-gray-600">Tap to change photo</Text>
        </View>

        {/* Personal Information */}
        <View className="mb-6 px-4">
          <Text className="mb-4 font-baloo text-xl font-semibold text-[#F15A29]">
            Personal Information
          </Text>

          {/* Gender */}
          {/* <View className="mb-6">
            <Text className="mb-2 font-poppins text-sm font-medium text-gray-700">Gender</Text>
            <View className="flex-row space-x-4">
              {['Male', 'Female', 'Other'].map((genderOption) => (
                <TouchableOpacity
                  key={genderOption}
                  onPress={() => {
                    setFormData((prev) => ({
                      ...prev,
                      gender: genderOption,
                    }));
                  }}
                  className={`flex-row items-center rounded-lg py-2 ${
                    formData?.gender === genderOption
                      ? 'border-[#F15A29] bg-[#F15A29] shadow-sm'
                      : 'border-gray-300'
                  }`}
                  style={{ minWidth: 90, justifyContent: 'center', marginRight: 8 }}
                  activeOpacity={0.8}
                >
                  <View
                    className={`mr-2 h-4 w-4 items-center justify-center rounded-full border-2 ${
                      formData?.gender === genderOption
                        ? 'border-white bg-white'
                        : 'border-[#F15A29] bg-transparent'
                    }`}
                  >
                    {formData?.gender === genderOption && (
                      <View className="h-2 w-2 rounded-full bg-[#F15A29]" />
                    )}
                  </View>
                  <Text
                    className={`font-poppins text-sm ${
                      formData?.gender === genderOption
                        ? 'font-semibold text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {genderOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View> */}

          {renderInput({
            label: 'First Name',
            value: formData.firstname,
            onChangeText: (text) => setFormData((prev) => ({ ...prev, firstname: text })),
            placeholder: 'Enter first name',
            field: 'firstname',
          })}

          {renderInput({
            label: 'Last Name',
            value: formData.lastname,
            onChangeText: (text) => setFormData((prev) => ({ ...prev, lastname: text })),
            placeholder: 'Enter last name',
            field: 'lastname',
          })}

          {/* Date of Birth */}
          <View className="mb-4 flex-1 items-start w-full">
            <Text className="-mb-2 mx-2 z-10 px-2 bg-white font-poppins text-sm font-medium text-gray-700">
              Date of Birth
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className={`${inputBaseClass} ${inputInactiveBorder} w-full`}>
              <Text className="text-base text-gray-800">
                {formData.date_of_birth || 'Select date of birth'}
              </Text>
            </TouchableOpacity>
          </View>

          {renderInput({
            label: 'Location',
            value: formData.location,
            onChangeText: (text) => setFormData((prev) => ({ ...prev, location: text })),
            placeholder: 'Enter your location',
            field: 'location',
            multiline: true,
          })}
        </View>

        {/* Contact Information */}
        <View className="mb-6 px-4">
          <Text className="mb-4 font-baloo text-xl font-semibold text-[#F15A29]">
            Contact Information
          </Text>

          {/* Email */}
          <View className="mb-4 flex-1 items-start w-full">
            <Text className="-mb-2 mx-2 z-10 px-2 bg-white font-poppins text-sm font-medium text-gray-700">
              Email
            </Text>
            <View
              className={`${inputBaseClass} ${
                formData._activeField === 'email' || (formData.email && formData.email.length > 0)
                  ? inputActiveBorder
                  : inputInactiveBorder
              } w-full flex-row items-center`}
            >
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
                className="flex-1 text-base text-gray-800 font-poppins py-1"
                placeholder="Enter email address"
                keyboardType="email-address"
                onFocus={() => setFormData((prev) => ({ ...prev, _activeField: 'email' }))}
                onBlur={() => setFormData((prev) => ({ ...prev, _activeField: '' }))}
                style={{
                  borderColor: formData._activeField === 'email' ? '#02AFFF' : undefined,
                  padding: 0,
                  margin: 0,
                  backgroundColor: 'transparent',
                }}
              />
              <TouchableOpacity
                onPress={handleVerifyEmail}
                className={`ml-2 rounded-full px-2 py-1 ${
                  emailVerified ? 'bg-green-500' : 'bg-blue-500'
                } flex-row items-center`}
                style={{ minHeight: 32, minWidth: 32, justifyContent: 'center', alignItems: 'center' }}
              >
                {emailVerified ? (
                  <Ionicons name="checkmark" size={18} color="white" />
                ) : (
                  <Text className="text-xs text-white font-poppins">Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Phone */}
          <View className="mb-4 flex-1 items-start w-full">
            <Text className="-mb-2 mx-2 z-10 px-2 bg-white font-poppins text-sm font-medium text-gray-700">
              Phone Number
            </Text>
            <View
              className={`${inputBaseClass} ${
                formData._activeField === 'number' || (formData.number && formData.number.length > 0)
                  ? inputActiveBorder
                  : inputInactiveBorder
              } w-full flex-row items-center`}
            >
              <TextInput
                value={formData.number}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, number: text }))}
                className="flex-1 text-base text-gray-800 font-poppins py-1"
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                onFocus={() => setFormData((prev) => ({ ...prev, _activeField: 'number' }))}
                onBlur={() => setFormData((prev) => ({ ...prev, _activeField: '' }))}
                style={{
                  borderColor: formData._activeField === 'number' ? '#02AFFF' : undefined,
                  padding: 0,
                  margin: 0,
                  backgroundColor: 'transparent',
                }}  
              />
              <TouchableOpacity
                onPress={handleVerifyPhone}
                className={`ml-2 rounded-full px-2 py-1 ${
                  phoneVerified ? 'bg-green-500' : 'bg-blue-500'
                } flex-row items-center`}
                style={{ minHeight: 32, minWidth: 32, justifyContent: 'center', alignItems: 'center' }}
              >
                {phoneVerified ? (
                  <Ionicons name="checkmark" size={18} color="white" />
                ) : (
                  <Text className="text-xs text-white font-poppins">Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Billing Information */}
        <View className="mb-6 px-4">
          <Text className="mb-4 font-baloo text-xl font-semibold text-[#F15A29]">
            Billing Information
          </Text>

          {renderInput({
            label: 'Billing Address',
            value: formData.billing_address,
            onChangeText: (text) => setFormData((prev) => ({ ...prev, billing_address: text })),
            placeholder: 'Enter billing address',
            field: 'billing_address',
            multiline: true,
            numberOfLines: 3,
          })}

          {renderInput({
            label: 'Pincode',
            value: formData.pincode,
            onChangeText: (text) => setFormData((prev) => ({ ...prev, pincode: text })),
            placeholder: 'Enter pincode',
            field: 'pincode',
            keyboardType: 'numeric',
          })}

          {renderInput({
            label: 'State',
            value: formData.state,
            onChangeText: (text) => setFormData((prev) => ({ ...prev, state: text })),
            placeholder: 'Enter state',
            field: 'state',
          })}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          className={`mb-6 w-1/2 mx-auto rounded-full py-3 ${isLoading ? 'bg-gray-400' : 'bg-[#F15A29]'}`}>
          {isLoading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="white" size="small" />
              <Text className="ml-2 text-base font-medium text-white">Saving...</Text>
            </View>
          ) : (
            <Text className="text-center text-base font-medium text-white">Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <BottomMenu />
    </View>
  );
};

export default EditProfile;
