import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput as RNTextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginLogo from '~/assets/images/auth/Group.svg';
import { Button } from '~/components/ui/Button';
import MailIcon from '~/assets/icons/mail.svg';
import PhoneIcon from '~/assets/icons/phone.svg';
import LocationIcon from '~/assets/icons/location.svg';
import LockIcon from '~/assets/icons/lock.svg';
import ReferralIcon from '~/assets/icons/referral.svg';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';

const SignupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [form, setForm] = useState({
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  const emailRef = useRef<RNTextInput>(null);
  const phoneRef = useRef<RNTextInput>(null);
  const locationRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const confirmPasswordRef = useRef<RNTextInput>(null);
  const referralCodeRef = useRef<RNTextInput>(null);

  const handleInputChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled">
            {/* Logo */}
            <View className="my-6 items-center">
              <LoginLogo width={256} height={256} />
            </View>

            {/* Headings */}
            <View className="mb-4 items-center">
              <Text className="font-blackshield text-3xl font-bold leading-[140%] text-gray-800">
                Welcome to <Text className="text-[#F15A29]">FestGo</Text> world
              </Text>
              <Text className="mt-1 font-baloo text-gray-500">Sign up for an account</Text>
            </View>

            {/* Input fields */}
            <InputField
              icon={<MailIcon width={20} height={20} />}
              placeholder="Email"
              value={form.email}
              onChangeText={(text: string) => handleInputChange('email', text)}
              ref={emailRef}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
            <InputField
              icon={<PhoneIcon width={20} height={20} />}
              placeholder="Phone"
              value={form.phone}
              onChangeText={(text: string) => handleInputChange('phone', text)}
              ref={phoneRef}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => locationRef.current?.focus()}
            />
            <InputField
              icon={<LocationIcon width={20} height={20} />}
              placeholder="Location"
              value={form.location}
              onChangeText={(text: string) => handleInputChange('location', text)}
              ref={locationRef}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <InputField
              icon={<LockIcon width={20} height={20} />}
              placeholder="Password"
              value={form.password}
              onChangeText={(text: string) => handleInputChange('password', text)}
              ref={passwordRef}
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />
            <InputField
              icon={<LockIcon width={20} height={20} />}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(text: string) => handleInputChange('confirmPassword', text)}
              ref={confirmPasswordRef}
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => referralCodeRef.current?.focus()}
            />
            <InputField
              icon={<ReferralIcon width={20} height={20} />}
              placeholder="Referral Code (Optional)"
              value={form.referralCode}
              onChangeText={(text: string) => handleInputChange('referralCode', text)}
              ref={referralCodeRef}
              returnKeyType="done"
            />

            {/* Confirm Button */}
            <Button
              title="Confirm"
              variant="primary"
              className="mb-4 mt-6 items-center rounded-full bg-[#F15A29] p-3 font-blackshield"
              onPress={() =>
                navigation.navigate('Auth', {
                  screen: 'Onboarding',
                })
              }
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View className="absolute bottom-0 left-0 right-0 h-4 flex-row">
        <View className="flex-1 rounded-l-md bg-[#00A450]" />
        <View className="flex-1 rounded-r-md bg-[#F15A29]" />
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const InputField = React.forwardRef<RNTextInput, any>(
  (
    {
      icon,
      placeholder,
      secureTextEntry,
      keyboardType,
      value,
      onChangeText,
      returnKeyType,
      onSubmitEditing,
    },
    ref
  ) => {
    return (
      <View className="mt-4 h-14 flex-row items-center rounded-[35px] border border-[#A4A4A4] bg-white px-[25px]">
        {icon}
        <TextInput
          ref={ref}
          className="ml-2 flex-1 text-gray-800"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={{ paddingVertical: 0 }}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    );
  }
);
