import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import { createRazorpayOptions } from '~/utils/payment';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HotelBookingCheckoutProps = {
  bookingData: any;
  hotelData: any;
  propertyId: string;
  roomData: any;
  onClose: () => void;
};

const HotelBookingCheckout: React.FC<HotelBookingCheckoutProps> = ({
  bookingData,
  hotelData,
  propertyId,
  roomData,
  onClose,
}) => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [gstChecked, setGstChecked] = useState(false);
  const [gstDetails, setGstDetails] = useState({
    gstNumber: '',
    companyName: '',
    companyAddress: '',
  });

  // Calculate total price
  const nights = Number(bookingData?.staynight) || 1;
  const pricePerNight = roomData?.pricing?.pricePerNight || 0;
  const baseTotal = pricePerNight * nights;
  // For demo, let's say coupon gives 10% off
  const discount = couponApplied ? Math.round(baseTotal * 0.1) : 0;
  const total = baseTotal - discount;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hotel & Room Details */}
        <View className="mb-5">
          {hotelData?.image && (
            <View className="mb-4 rounded-2xl overflow-hidden">
              <Image
                source={{ uri: hotelData.image }}
                className="w-full h-40"
                resizeMode="cover"
                style={{ borderRadius: 16 }}
              />
            </View>
          )}
          <Text className="text-[20px] font-bold text-[#0E54EC] mb-1 font-poppins">
            {hotelData?.hotelName || 'Hotel Name'}
          </Text>
          <View className="flex-row items-center mb-0.5">
            <MaterialIcons name="star" size={18} color="#FFD700" />
            <Text className="ml-1 font-semibold text-[#333] font-poppins">
              {hotelData?.rating || 0}
            </Text>
            <Text className="ml-2 text-[#888] font-poppins">
              ({hotelData?.totalReviewRate || 0} reviews)
            </Text>
          </View>
          <View className="flex-row items-center mb-0.5">
            <Ionicons name="location-sharp" size={16} color="#0E54EC" />
            <Text className="ml-1 text-[#555] font-poppins">Location</Text>
          </View>
          <View className="mt-2.5 bg-[#F3F6FA] rounded-xl p-3">
            <Text className="font-semibold text-[16px] text-[#222] font-poppins">
              {roomData?.room_name || 'Room'}
            </Text>
            <Text className="text-[#666] mt-0.5 font-poppins">
              {nights} night(s) · {bookingData?.rooms || 1} Room · {bookingData?.adult || 1} Adult
              {bookingData?.child && Number(bookingData.child) > 0
                ? `, ${bookingData.child} Child`
                : ''}
            </Text>
            <Text className="text-[#666] mt-0.5 font-poppins">
              {bookingData?.todate && bookingData?.enddate
                ? `${bookingData.todate} - ${bookingData.enddate}`
                : ''}
            </Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View className="mb-5">
          <Text className="font-bold text-[18px] mb-2 font-poppins">Price Details</Text>
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-[#444] font-poppins">
              ₹{pricePerNight.toLocaleString()} x {nights} night(s)
            </Text>
            <Text className="text-[#444] font-semibold font-poppins">₹{baseTotal.toLocaleString()}</Text>
          </View>
          {couponApplied && (
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-[#22C55E] font-poppins">Coupon Discount</Text>
              <Text className="text-[#22C55E] font-semibold font-poppins">-₹{discount.toLocaleString()}</Text>
            </View>
          )}
          <View className="border-t border-[#eee] my-2" />
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-[16px] font-poppins">Total</Text>
            <Text className="font-bold text-[18px] text-[#0E54EC] font-poppins">
              ₹{total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Coupon Code */}
        <View className="mb-5">
          <Text className="font-bold text-[16px] mb-1.5 font-poppins">Have a Coupon Code?</Text>
          <View className="flex-row items-center">
            <TextInput
              value={coupon}
              onChangeText={setCoupon}
              placeholder="Enter coupon code"
              className="flex-1 border border-[#ddd] rounded-lg px-3 py-2 bg-[#F9FAFB] text-[16px] font-poppins"
              editable={!couponApplied}
              placeholderTextColor="#888"
              style={{ fontFamily: 'Poppins' }}
            />
            <Pressable
              className={`ml-2 rounded-lg px-4 py-2 ${coupon && !couponApplied ? 'bg-[#0E54EC]' : 'bg-[#ccc]'}`}
              disabled={!coupon || couponApplied}
              onPress={() => {
                // For demo, any code applies 10% off
                setCouponApplied(true);
              }}
              style={({ pressed }) => [
                { opacity: pressed ? 0.8 : 1 },
                {
                  backgroundColor: coupon && !couponApplied ? '#0E54EC' : '#ccc',
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                },
              ]}
            >
              <Text className="text-white font-bold font-poppins">
                {couponApplied ? 'Applied' : 'Apply'}
              </Text>
            </Pressable>
          </View>
          {couponApplied && (
            <Text className="text-[#22C55E] mt-1 font-poppins">
              Coupon applied! 10% discount.
            </Text>
          )}
        </View>

        {/* GST Number */}
        <View className="mb-5">
          <View className="flex-row items-center mb-1.5">
            <FontAwesome5 name="file-invoice" size={18} color="#0E54EC" />
            <Text className="ml-2 font-bold text-[16px] font-poppins">
              I have a GST Number
            </Text>
            <Switch
              value={gstChecked}
              onValueChange={setGstChecked}
              style={{ marginLeft: 12 }}
              thumbColor={gstChecked ? '#0E54EC' : '#ccc'}
              trackColor={{ false: '#ccc', true: '#B3D1FF' }}
            />
          </View>
          {gstChecked && (
            <View className="mt-2 bg-[#F3F6FA] rounded-xl p-3">
              <TextInput
                value={gstDetails.gstNumber}
                onChangeText={v => setGstDetails(d => ({ ...d, gstNumber: v }))}
                placeholder="GST Number"
                className="border border-[#ddd] rounded-lg px-3 py-2 bg-white mb-2 text-[16px] font-poppins"
                autoCapitalize="characters"
                placeholderTextColor="#888"
                style={{ fontFamily: 'Poppins' }}
              />
              <TextInput
                value={gstDetails.companyName}
                onChangeText={v => setGstDetails(d => ({ ...d, companyName: v }))}
                placeholder="Company Name"
                className="border border-[#ddd] rounded-lg px-3 py-2 bg-white mb-2 text-[16px] font-poppins"
                placeholderTextColor="#888"
                style={{ fontFamily: 'Poppins' }}
              />
              <TextInput
                value={gstDetails.companyAddress}
                onChangeText={v => setGstDetails(d => ({ ...d, companyAddress: v }))}
                placeholder="Company Address"
                className="border border-[#ddd] rounded-lg px-3 py-2 bg-white text-[16px] font-poppins"
                multiline
                placeholderTextColor="#888"
                style={{ fontFamily: 'Poppins' }}
              />
            </View>
          )}
        </View>

        {/* Continue Payment Button */}
        <Pressable
          className="bg-[#0E54EC] rounded-full py-4 items-center mt-2.5 mb-5 shadow"
          style={{
            shadowColor: '#0E54EC',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 2,
          }}
          onPress={async () => {
            setLoading(true);
            try {
              const jwtToken = await AsyncStorage.getItem('jwtToken');
              if (!jwtToken) {
                Alert.alert('Error', 'You must be logged in to book a hotel.');
                return;
              }
              // Format the data to match the required structure
              const hotelBookingData = JSON.stringify({
                property_id: propertyId,
                room_id: roomData?.id,
                festgo_coins: 0,
                check_in_date: bookingData?.todate
                  ? bookingData.todate.split('-').reverse().join('-')
                  : undefined,
                check_out_date: bookingData?.enddate
                  ? bookingData.enddate.split('-').reverse().join('-')
                  : undefined,
                num_adults: Number(bookingData?.adult) || 1,
                num_children: Number(bookingData?.child) || 0,
                num_rooms: Number(bookingData?.rooms) || 1,
                notes: bookingData?.notes || "",
                referral_id: bookingData?.referral_id || "",
                // Optionally, add coupon and GST details if needed by backend
                coupon_code: couponApplied ? coupon : null,
                coupon_discount: discount,
                gst_details: gstChecked ? gstDetails : null,
              });
              const res = await fetch('https://server.festgo.in/api/property-booking', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${jwtToken}`,
                },
                body: hotelBookingData,
              });
              console.log(res)
              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Booking failed');
              }
              const response = await res.json();
              console.log("response", response)
              
              const { booking, razorpayOrder } = response;
              
              // Create Razorpay options for WebView
              const razorpayOptions = createRazorpayOptions({
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'FestGo Hotel Booking',
                description: `Hotel booking for ${hotelData?.hotelName || 'Hotel'}`,
                orderId: razorpayOrder.id,
                bookingId: booking.id,
                prefill: {
                  email: booking.email,
                  contact: booking.phone,
                  name: booking.guest_name,
                },
                notes: {
                  booking_id: booking.id,
                  payment_for: 'hotel_booking',
                  payment_type: booking.payment_method,
                },
              });

              console.log('Created Razorpay options for hotel:', razorpayOptions);

              // Close the modal first
              onClose && onClose();

              // Navigate to PaymentWebView
              navigation.navigate('PaymentWebView', {
                razorpayOptions,
                bookingData: booking,
                bookingType: 'hotel',
              });
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Booking failed. Please try again.');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          <Text className="text-white font-bold text-[18px] font-poppins">
            {loading ? 'Processing...' : 'Continue to Payment'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HotelBookingCheckout;