import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';

const EditProfile = () => {
  return (
    <View className="flex-1 justify-start">
      <ProfileHeaderMenu isDifferentPage pageTitle="Edit Profile" />
      <ScrollView>
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800">Edit Profile</Text>
          {/* Add your form fields here */}
          <Text className="mt-4 text-gray-600">
            This is where you can edit your profile details.
          </Text>
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default EditProfile;
