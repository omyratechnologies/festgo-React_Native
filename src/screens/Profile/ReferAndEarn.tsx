import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ToastAndroid, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather, FontAwesome, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import { LinearGradient } from 'expo-linear-gradient';
import BottomMenu from '~/components/common/BottomMenu';

const referralCode = 'HELLO123';

const referrals = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
];

const ReferAndEarn = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    Clipboard.setStringAsync(referralCode);
    setCopied(true);
    ToastAndroid.show('Copied!', ToastAndroid.SHORT);
    setTimeout(() => setCopied(false), 1500);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderReferral = ({ item }: { item: { id: string; name: string } }) => (
    <View
      className={
        'mb-3 mx-4 flex-row items-center justify-between rounded-2xl border border-[#F9F9F9] bg-white px-4 py-5'
      }>
      <View className={'flex-row items-center'}>
        <FontAwesome name="user-circle" size={28} color="#F15A29" />
        <Text className={'ml-3 text-base font-medium text-gray-800'}>{item.name}</Text>
      </View>
      <View className={'rounded-full bg-[#FFE386] px-3 py-1'}>
        <Text className={'text-xs font-bold text-gray-800'}>+ 200 points</Text>
      </View>
    </View>
  );
  
  const renderReferralEmpty = () => (
    <View className={'mt-12 items-center'}>
      <FontAwesome name="users" size={48} color="#F15A29" />
      <Text className={'mt-4 text-center text-base font-medium text-gray-500'}>
        Start referring your friends and family{'\n'}
        and earn vouchers worth up-to ₹500
      </Text>
    </View>
  );

  return (
    <View className="flex-1">
      <ProfileHeaderMenu isDifferentPage pageTitle="Refer" />
      <FlatList
        ListHeaderComponent={
          <>
            <View
              className={'pb-6 pt-10'}
              style={{
                backgroundColor: '#F15A29',
                borderBottomLeftRadius: 60,
                borderBottomRightRadius: 60,
              }}>
              <View className={'px-6'}>
                <View className="">
                  <Text
                    className={'mb-6  px-16 text-center font-baloo text-3xl font-bold text-white'}>
                    Refer your friends and Earn
                  </Text>
                  {/* Referral Code Button */}
                  <View className="mb-6 flex-row items-center justify-between rounded-2xl border border-dashed border-white bg-[#FF9B7B73] px-4 py-3">
                    <Text
                      className={'font-baloo text-lg font-semibold tracking-widest text-white '}>
                      {referralCode}
                    </Text>
                    <TouchableOpacity
                      onPress={handleCopy}
                      className={'ml-4 flex-row items-center'}
                      activeOpacity={0.7}>
                      {copied ? (
                        <Feather name="check" size={22} color="#ffff" />
                      ) : (
                        <Feather name="copy" size={22} color="#ffff" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                {/* Share Buttons */}
                <View className={'-mb-10  flex-row justify-center gap-2 space-x-6'}>
                  <TouchableOpacity
                    className={'flex-row items-center overflow-hidden rounded-full p-0'}>
                    <LinearGradient
                      colors={['#2B2B2B', '#555555']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 9999,
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingVertical: 8,
                      }}>
                      <Entypo name="cross" size={22} color="white" />
                      <Text className={'ml-2 pt-1 font-baloo text-xs font-semibold text-white'}>
                        Twitter
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity className={'overflow-hidden rounded-full p-0'}>
                    <LinearGradient
                      colors={['#00EB62', '#3AFF8C']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        borderRadius: 9999,
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingVertical: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <FontAwesome name="whatsapp" size={22} color="white" />
                      <Text className={'ml-2 pt-1 font-baloo text-xs font-semibold text-white'}>
                        Whatsapp
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity className={'overflow-hidden rounded-full p-0'}>
                    <LinearGradient
                      colors={['#2F78FF', '#528FFF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        borderRadius: 9999,
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingVertical: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <MaterialCommunityIcons name="facebook-messenger" size={22} color="white" />
                      <Text className={'ml-2 pt-1 font-baloo text-xs font-semibold text-white'}>
                        Messages
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className={'mt-16 px-6'}>
              <Text className={'mb-4 font-baloo text-lg font-bold text-gray-800'}>
                My referrals
              </Text>
              <View className="">
                {referrals.length === 0 && (
                  <View className={'mt-12 items-center'}>
                    <FontAwesome name="users" size={48} color="#F15A29" />
                    <Text className={'mt-4 text-center text-base font-medium text-gray-500'}>
                      Start referring your friends and family{'\n'}
                      and earn vouchers worth up-to ₹500
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        }
        data={referrals}
        keyExtractor={(item) => item.id}
        renderItem={referrals.length === 0 ? renderReferralEmpty : renderReferral}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
      <BottomMenu />
    </View>
  );
};
export default ReferAndEarn;
