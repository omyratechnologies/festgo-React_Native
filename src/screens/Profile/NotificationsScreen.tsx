import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import SorryImage from '~/assets/images/sorry.svg';
import BellIcon from '~/assets/icons/hotelBooking/Wineglass.svg';
import TicketIcon from '~/assets/icons/hotelBooking/Wineglass.svg';
import StarIcon from '~/assets/icons/hotelBooking/Wineglass.svg';

// const notifications = [
//   {
//     id: '1',
//     icon: <BellIcon width={32} height={32} />,
//     head: 'Event Reminder',
//     time: '2 hours ago',
//     description: "Don't forget your event starts at 7 PM today!",
//   },
//   {
//     id: '2',
//     icon: <TicketIcon width={32} height={32} />,
//     head: 'Ticket Booked',
//     time: 'Yesterday',
//     description: 'Your ticket for "Music Fest 2024" has been confirmed.',
//   },
//   {
//     id: '3',
//     icon: <StarIcon width={32} height={32} />,
//     head: 'New Achievement',
//     time: '3 days ago',
//     description: 'You have unlocked the "Early Bird" badge!',
//   },
// ];

const notifications: any[] = [];

const NotificationsScreen = () => {
  return (
    <View className="flex-1 justify-start bg-white">
      <ProfileHeaderMenu isDifferentPage pageTitle="Notifications" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4">
          {notifications.length === 0 ? (
            <View
              style={styles.emptyContainer}
              className="h-full flex-1 items-center justify-center">
              <SorryImage width={120} height={120} />
              <Text className="mt-6 text-center font-poppins text-base font-semibold text-gray-700">
                No notifications
              </Text>
              <Text className="mt-2 text-center font-poppins text-gray-500">
                Please check again later
              </Text>
            </View>
          ) : (
            notifications.map((notif) => (
              <View
                key={notif.id}
                style={styles.notificationBox}
                className="mb-4 flex-row items-center rounded-xl">
                <View className="mr-4">{notif.icon}</View>
                <View className="flex-1">
                  <Text className="font-poppins text-base font-semibold text-gray-900">
                    {notif.head}
                  </Text>
                  <Text className="font-poppins text-xs text-gray-500">{notif.time}</Text>
                  <Text className="mt-1 font-poppins text-sm text-gray-700">
                    {notif.description}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  notificationBox: {
    backgroundColor: '#FFF8F8',
    borderWidth: 1,
    borderColor: '#0000004F',
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 72,
  },
});

export default NotificationsScreen;
