import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import LocationIcon from '~/assets/icons/location-pin.svg';
// import HeartIcon from '~/assets/icons/profile/Heart.svg';

interface OrderDetailsProps {
  route: {
    params: {
      orderId: string;
    };
  };
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ route }) => {
  const { orderId } = route.params;

  // Dummy data
  const order = {
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    name: 'Aalankrita Resort & Conventi',
    location: 'Hyderabad, India',
    bookedOn: '2024-06-01',
    bookedFor: '2024-07-15',
    refNumber: orderId,
    userName: 'Sai Adithya',
    total: 5000,
  };

  return (
    <View className="flex-1 bg-white">
      <ProfileHeaderMenu isDifferentPage pageTitle="Order Details" />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }} className="p-4">
        <View
          className="m-4 flex-col items-center rounded-3xl bg-white p-4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 1, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 9,
          }}>
          {/* Ticket Image */}
          <Image
            source={{ uri: order.image }}
            className="mb-4 h-40 w-full rounded-xl"
            resizeMode="cover"
          />

          {/* Name & Location */}
          <View className="mb-2 w-full flex-col items-start px-3">
            <Text className="pt-1 font-baloo text-xl font-bold text-gray-800">{order.name}</Text>
            <View className="mb-2 w-full flex-row items-start">
              <LocationIcon width={16} height={16} className="mr-2" />
              <Text className="mb-2 font-baloo text-base text-gray-500">{order.location}</Text>
            </View>
          </View>

          {/* Booking Success */}
          <Text className="mt-2 pt-1 font-baloo text-3xl font-bold ">Booking Success!</Text>
          <Text className="mb-4 font-baloo  text-gray-600">Your booking has been confirmed.</Text>

          {/* Divider */}
          <View className="my-4 h-2 w-[90%] border-b border-[#E8EAED]"></View>

          {/* Total Payment */}
          <Text className="text-base text-gray-700">Total Payment</Text>
          <Text className="mb-4 pt-1 font-baloo text-3xl font-bold text-green-600">
            ₹ {order.total.toLocaleString()}
          </Text>

          {/* 4 Cards in 2x2 Grid */}
          <View className="mb-4 flex-row flex-wrap justify-between">
            <View className="mb-3 w-[48%] rounded-lg border border-[#EDEDED] p-3">
              <Text className="pt-1 font-baloo text-xs text-gray-500 ">Booked On</Text>
              <Text className="pt-1 font-baloo font-semibold ">{order.bookedOn}</Text>
            </View>
            <View className="mb-3 w-[48%] rounded-lg border border-[#EDEDED] p-3">
              <Text className="pt-1 font-baloo text-xs text-gray-500 ">Booked For</Text>
              <Text className="pt-1 font-baloo font-semibold ">{order.bookedFor}</Text>
            </View>
            <View className="mb-3 w-[48%] rounded-lg border border-[#EDEDED] p-3">
              <Text className="pt-1 font-baloo text-xs text-gray-500 ">Ref Number</Text>
              <Text className="pt-1 font-baloo font-semibold ">{order.refNumber}</Text>
            </View>
            <View className="mb-3 w-[48%] rounded-lg border border-[#EDEDED] p-3">
              <Text className="pt-1 font-baloo text-xs text-gray-500 ">Name</Text>
              <Text className="pt-1 font-baloo font-semibold ">{order.userName}</Text>
            </View>
          </View>

          {/* Dummy Barcode */}
          <View className="my-4 items-center">
            <Image
              source={{
                uri:
                  'https://api.qrserver.com/v1/create-qr-code/?size=200x60&data=Order-' + orderId,
              }}
              className="h-12 w-48"
              resizeMode="contain"
            />
          </View>

          {/* Cancel Booking Button */}
          <View className="">
            <TouchableOpacity className="my-3 self-start rounded-full border border-[#D9D9D9] px-6 py-2">
              <Text className="text-center font-baloo font-bold text-[#0E54EC]">
                Cancel Booking
              </Text>
            </TouchableOpacity>
          </View>
          {/* Download Receipt Button */}
          <View className="mb-10 w-full">
            <TouchableOpacity className="my-3 w-full self-start rounded-lg bg-[#0E54EC] px-4 py-4">
              <Text className="text-center font-semibold text-white">Download Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default OrderDetails;
