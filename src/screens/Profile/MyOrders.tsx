import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

const orders = [
  {
    id: '1',
    type: 'upcoming',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    title: 'Hotel Best Auto Hogar',
    location: 'Central Park, NY',
    bookedOn: '2024-06-10',
    bookedDate: '2024-06-20',
  },
  {
    id: '2',
    type: 'upcoming',
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    title: 'Art Expo',
    location: 'Gallery Lane, LA',
    bookedOn: '2024-06-09',
    bookedDate: '2024-06-22',
  },
  {
    id: '3',
    type: 'completed',
    image:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    title: 'Food Carnival',
    location: 'Downtown, SF',
    bookedOn: '2024-05-01',
    bookedDate: '2024-05-10',
  },
];

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
];

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigation = useNavigation<MainTabNavigationProp>();
  const filteredOrders = orders.filter((order) => order.type === activeTab);

  const getDaysLeft = (date: string) => {
    const today = dayjs();
    const eventDate = dayjs(date);
    const diff = eventDate.diff(today, 'day');
    return diff > 0 ? `${diff} days left` : true;
  };

  return (
    <View className="flex-1 bg-white">
      <ProfileHeaderMenu isDifferentPage pageTitle="My Orders" />
      {/* Tabs */}
      <View className="w-full flex-row items-center justify-center px-12 pb-2 pt-4 ">
        {TABS.map((tab) => (
          <TouchableOpacity key={tab.key} className=" w-1/2" onPress={() => setActiveTab(tab.key)}>
            <Text
              style={{
                color: activeTab === tab.key ? '#F15A29' : '#888',
                fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab.key ? '#F15A29' : '#D9D9D9',
                paddingBottom: 4,
                fontSize: 16,
              }}
              className="text-center font-baloo">
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        <View className="p-4">
          {filteredOrders.length === 0 && (
            <Text className="mt-8 text-center text-gray-500">No orders found.</Text>
          )}
          {filteredOrders.map((order) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('MyOrderDetails', { orderId: order.id })}
              key={order.id}
              className="relative mb-4 flex-row items-center rounded-3xl bg-white p-3 shadow"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 4,
                elevation: 9,
              }}>
              {/* Image */}
              <Image
                source={{ uri: order.image }}
                className="h-full w-28 rounded-lg"
                resizeMode="cover"
              />
              {/* Details */}
              <View className="ml-4 flex-1">
                <Text className="pt-1 font-baloo text-base font-bold text-gray-900">
                  {order.title}
                </Text>
                <View className="mt-1 flex-row items-center">
                  <Ionicons name="location-sharp" size={16} color="#F15A29" />
                  <Text className="ml-1 pt-1 font-baloo text-sm text-gray-700">
                    {order.location}
                  </Text>
                </View>
                <Text className="mt-2 font-baloo text-xs text-gray-500">
                  Booked on:{' '}
                  <Text className="font-medium text-black">
                    {dayjs(order.bookedOn).format('DD MMM YYYY')}
                  </Text>
                </Text>
                <Text className="font-baloo text-xs text-gray-500">
                  Booked date:{' '}
                  <Text className="font-baloo font-medium text-black">
                    {dayjs(order.bookedDate).format('DD MMM YYYY')}
                  </Text>
                </Text>
              </View>
              {/* Chevron */}
              <Ionicons name="chevron-forward" size={24} color="#000" />
              {activeTab === 'upcoming' ? (
                (() => {
                  const daysLeft = getDaysLeft(order.bookedDate);
                  return daysLeft ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 36,
                        backgroundColor: '#22C55E',
                        borderRadius: 12,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                      }}>
                      <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>
                        {/* {daysLeft} */}3 days left
                      </Text>
                    </View>
                  ) : null;
                })()
              ) : (
                <View
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 36,
                    backgroundColor: '#F15A29',
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                  }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Finished</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default MyOrders;
