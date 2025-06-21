import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import LoginLogo from '~/assets/images/auth/Group.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/Button';
import MailIcon from '~/assets/icons/mail.svg';
import FacebookIcon from '~/assets/icons/facebook.svg';
import GoogleIcon from '~/assets/icons/google.svg';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1 justify-between bg-white px-6">
        {/* SVG Graphic (Placeholder) */}
        <View className="mb-6 items-center">
          <LoginLogo width="256" height="256" />
        </View>

        {/* Heading */}
        <View className="mb-2 items-center">
          <Text className="font-blackshield text-3xl font-bold leading-[140%] text-gray-800">
            Welcome to <Text className="text-[#F15A29]">FestGo</Text> world
          </Text>
          <Text className="mt-1 font-baloo text-gray-500">Sign in to your account</Text>
        </View>

        {/* Input Fields */}
        <View className="mt-4 h-14 flex-row items-center rounded-[35px] border border-[#A4A4A4] bg-white px-[25px]">
          <MailIcon width={20} height={20} style={{ marginRight: 10 }} />
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            style={{ paddingVertical: 0 }}
          />
        </View>

        <View className="flex w-full items-end justify-end">
          <Text className="text-md mb-3 mt-2 font-baloo font-bold leading-[140%] text-[#F15A29]">
            Login/signup of account
          </Text>
        </View>

        {/* Signup Button */}
        <Button
          title="Confirm"
          variant="primary"
          className="mb-4  items-center rounded-full bg-[#F15A29] p-3 font-blackshield"
          onPress={() => navigation.push('Auth', { screen: 'OTP' })}
        />

        {/* Divider */}
        <View className="mb-4 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-3 text-gray-500">or login with</Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>

        {/* Social Buttons */}
        <TouchableOpacity className="h-14 flex-row items-center justify-center rounded-2xl border border-[#E2E8F0] p-3">
          <FacebookIcon width={20} height={20} />
          <Text className="ml-2 font-baloo text-gray-700">Login with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity className="h-14 flex-row items-center justify-center rounded-2xl border border-[#E2E8F0] p-3">
          <GoogleIcon width={20} height={20} />
          <Text className="ml-2 font-baloo text-gray-700">Login with Google</Text>
        </TouchableOpacity>

        {/* Bottom Color Div */}
        <View className="mt-6 h-4 flex-row">
          <View className="flex-1 rounded-l-md bg-[#00A450]" />
          <View className="flex-1 rounded-r-md bg-[#F15A29]" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
