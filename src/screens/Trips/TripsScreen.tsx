import { View, Text } from 'react-native'
import React from 'react'
import HotelBookingHeaderMenu from '~/components/HotelBooking/HotelBookingHeaderMenu'

const TripsScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <HotelBookingHeaderMenu />
      <Text>TripsScreen</Text>
    </View>
  )
}

export default TripsScreen