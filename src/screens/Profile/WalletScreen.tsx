import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import WalletBackground from '~/assets/images/WalletBackground.svg';
import ReferFriends from '~/assets/images/ReferFriends.svg';
// import LocationIcon from '~/assets/icons/location.svg';
import CoinIcon from '~/assets/icons/coinIcon.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import useUserStore from '~/store/userStore';

type Transaction = {
  id: string;
  image: any;
  heading: string;
  location: string;
  date: string;
  amount: number;
};

const WalletScreen = () => {
  const navigation = useNavigation<MainTabNavigationProp>();

  const [refreshing, setRefreshing] = useState(false);
  const { userData, fetchUserProfile } = useUserStore();

  const [walletBalance, setWalletBalance] = useState(userData?.festgo_coins);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [txnLoading, setTxnLoading] = useState<boolean>(false);
  const [txnError, setTxnError] = useState<string | null>(null);


  const fetchRecentTransactions = useCallback(async () => {
    setTxnLoading(true);
    setTxnError(null);
    try {

      await new Promise((resolve) => setTimeout(resolve, 800));
      setRecentTransactions([]);
    } catch (error) {
      setTxnError(
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching transactions'
      );
      setRecentTransactions([]);
    } finally {
      setTxnLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentTransactions();
  }, [fetchRecentTransactions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    await fetchRecentTransactions();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-white">
      <ProfileHeaderMenu isDifferentPage pageTitle="Wallet" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="mx-4 mt-4 overflow-hidden rounded-2xl">
          <View className="relative">
            <WalletBackground width="100%" />
            <View className="absolute left-6 top-6 flex-row items-center rounded-full bg-white px-3 py-1 ">
              <Text className="text-xs font-semibold text-gray-800">1 Rupee = 10 FestGo Coins</Text>
            </View>
            <View className="absolute bottom-8 left-6 flex items-start justify-center">
              <Text className="font-baloo text-base font-semibold text-white">
                Balance FestGo Coins
              </Text>
              <Text className=" font-baloo text-5xl font-bold leading-normal text-white">
                {walletBalance}
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-4 mt-6 flex-row items-center overflow-hidden rounded-2xl bg-white shadow-md">
          <View className="flex-1">
            <ReferFriends width="100%" height={100} />
          </View>
          <View className="absolute right-0 h-full flex-row items-center justify-end pr-4">
            <View className="mr-3 w-1/2">
              <Text className="font-baloo text-lg font-bold text-white">Refer and Earn More</Text>
            </View>
            <TouchableOpacity
              className="rounded-full px-4 py-2"
              style={{ backgroundColor: '#F4B300' }}
              onPress={() => navigation.navigate('ReferAndEarn')}>
              <Text className="font-semibold text-white">Refer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="mx-4 mt-8">
          <Text className="mb-4 w-full text-center font-baloo text-2xl font-bold text-gray-800">
            Recent Transactions
          </Text>
          {txnLoading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#F15A29" />
            </View>
          ) : txnError ? (
            <View className="items-center justify-center py-8">
              <Text className="font-poppins text-base text-red-500">
                {txnError}
              </Text>
              <TouchableOpacity
                className="mt-3 rounded-full bg-orange-500 px-4 py-2"
                onPress={fetchRecentTransactions}
              >
                <Text className="font-semibold text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : recentTransactions.length === 0 ? (
            <View className="items-center justify-center py-8">
              <Text className="font-poppins text-base text-gray-500">No transactions yet.</Text>
            </View>
          ) : (
            recentTransactions.map((txn) => (
              <View
                key={txn.id}
                className="mb-4 flex-row items-center rounded-xl bg-white p-3 shadow-sm"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 4,
                  elevation: 2,
                }}>
                <Image
                  source={txn.image}
                  className="mr-3 h-full w-20 rounded-lg"
                  resizeMode="cover"
                />
                <View className="flex-1 gap-1">
                  <Text className="font-poppins font-semibold text-gray-900">{txn.heading}</Text>
                  <View className="mt-1 flex-row items-center">
                    {/* <LocationIcon width={14} height={14} /> */}
                    <Text className="ml-1 font-poppins text-xs text-gray-500">{txn.location}</Text>
                  </View>
                  <Text className="font-poppins text-xs text-gray-400">
                    Transaction date: {txn.date}
                  </Text>
                </View>
                <View
                  className="ml-2 flex-row items-center rounded-full px-3 py-1"
                  style={{ backgroundColor: '#FF8686' }}>
                  <CoinIcon width={16} height={16} />
                  <Text className="ml-1 font-bold text-white">{txn.amount}</Text>
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

export default WalletScreen;
