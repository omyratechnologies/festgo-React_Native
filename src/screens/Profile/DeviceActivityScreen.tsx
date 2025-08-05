import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import useUserStore from '~/store/userStore';
import { MaterialIcons } from '@expo/vector-icons';
import type { LoginHistory } from '~/types/user';

const DeviceActivityScreen = () => {
  const { userData } = useUserStore();
  const deviceActivity: LoginHistory[] = userData?.loginHistories || [];

  return (
    <View className="flex-1 justify-start bg-white">
      <ProfileHeaderMenu isDifferentPage pageTitle="Device Activity" />
      <ScrollView>
        <View className="p-4">
          <Text className="text-2xl font-baloo font-bold mb-4 px-4 py-3">
            Manage your devices
          </Text>
          {deviceActivity.length > 0 ? (
            deviceActivity.map((device, idx) => (
              <View
                key={device.id || idx}
                className="flex-row items-center mb-4  p-4 "
              >
                <View className="mr-4">
                  <MaterialIcons name="phone-android" size={32} color="#00A44E" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold font-poppins text-gray-700">
                    {device.deviceBrand && device.deviceModel
                      ? `${device.deviceBrand} ${device.deviceModel}`
                      : 'Unknown Device'}
                  </Text>
                  <Text className="text-gray-500 font-poppins text-sm">
                    {device.location || 'Unknown Location'}
                  </Text>
                  <Text className="text-gray-400 font-poppins text-xs mt-1">
                    Last active: {device.loginTime ? new Date(device.loginTime).toLocaleString() : 'N/A'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="mt-4 text-gray-600">No device activity found.</Text>
          )}
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default DeviceActivityScreen;
