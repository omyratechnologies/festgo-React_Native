import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import useUserStore from '~/store/userStore';

const GSTDetails = () => {
  const { userData } = useUserStore();
  const gstDetails = userData?.gst_details;

  return (
    <View className="flex-1 justify-start">
      <ProfileHeaderMenu isDifferentPage pageTitle="GST Details" />
      <ScrollView>
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800">My GST Details</Text>
          {gstDetails && gstDetails.length > 0 ? (
            gstDetails.map((gst, idx) => (
              <View
                key={gst.id || idx}
                className="mt-4 mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <Text className="font-semibold text-gray-700 mb-1">
                  GST Number:
                  <Text className="font-normal text-gray-900"> {gst.gstNumber || 'N/A'}</Text>
                </Text>
                <Text className="font-semibold text-gray-700 mb-1">
                  Registered Name:
                  <Text className="font-normal text-gray-900"> {gst.companyName || 'N/A'}</Text>
                </Text>
                <Text className="font-semibold text-gray-700 mb-1">
                  Address:
                  <Text className="font-normal text-gray-900"> {gst.address || 'N/A'}</Text>
                </Text>
                {/* Add more fields as needed */}
              </View>
            ))
          ) : (
            <Text className="mt-4 text-gray-600">No GST details found.</Text>
          )}
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default GSTDetails;
