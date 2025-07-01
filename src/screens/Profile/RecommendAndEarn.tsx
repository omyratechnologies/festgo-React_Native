import { View, Text, ScrollView, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import React, { useState } from 'react';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import ChevronRightIcon from '~/assets/images/profile/ChevronRight.svg';

const faqData = [
  {
    question: 'What is the Recommend & Earn program?',
    answer:
      'The Recommend & Earn program allows FestGo users to share their hotel/resort bookings with friends. When someone books through your shared recommendation link, you earn FestGo Coins.',
  },
  {
    question: 'How do I recommend a hotel to someone?',
    answer:
      'The Recommend & Earn program allows FestGo users to share their hotel/resort bookings with friends. When someone books through your shared recommendation link, you earn FestGo Coins.',
  },
  {
    question: 'Is there a limit to how many people I can refer?',
    answer:
      'The Recommend & Earn program allows FestGo users to share their hotel/resort bookings with friends. When someone books through your shared recommendation link, you earn FestGo Coins.',
  },
  {
    question: 'What if my friend cancels the booking?',
    answer:
      'The Recommend & Earn program allows FestGo users to share their hotel/resort bookings with friends. When someone books through your shared recommendation link, you earn FestGo Coins.',
  },
];

const RecommendAndEarn = () => {
  const [faqVisible, setFaqVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View className="flex-1 justify-start bg-white">
      <ProfileHeaderMenu isDifferentPage pageTitle="Recommend & Earn" />
      <ScrollView>
        <View className="items-center p-4">
          <Image
            source={require('~/assets/images/profile/RecommendAndEarn.png')}
            style={{ width: '100%', marginBottom: 24 }}
            resizeMode="contain"
          />
          <View
            style={{ backgroundColor: '#FFF3F3', borderRadius: 24, padding: 20, width: '100%' }}>
            <Text className="mb-2 text-center font-baloo text-2xl font-bold">Recommend & Earn</Text>
            <View className="mb-2">
              <Text className="mb-1 font-baloo text-lg text-gray-800">
                • Step 1: Book a Resort or Hotel Stay on FestGo app.
              </Text>
              <Text className="mb-1 font-baloo text-lg text-gray-800">
                • Step 2: Recommend the Resort or Hotel stay to your network.
              </Text>
              <Text className="font-baloo text-lg text-gray-800">
                • Step 3: Earn FestGo coins when they complete their booking through your link.
              </Text>
            </View>
            <View className="mt-4 flex-col justify-between gap-4">
              <TouchableOpacity
                className="mr-2 w-full flex-row items-center justify-between rounded-full bg-white p-4"
                onPress={() => setFaqVisible(true)}>
                <Text className="text-start font-semibold text-black">FAQs</Text>
                <ChevronRightIcon width={24} height={24} className="pr-12 text-pink-700" />
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-2 w-full flex-row items-center justify-between rounded-full bg-white p-4"
                onPress={() => setTermsVisible(true)}>
                <Text className="text-start font-semibold text-black">Terms & Conditions</Text>
                <ChevronRightIcon width={24} height={24} className="pr-12 text-pink-700" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomMenu />

      {/* FAQ Modal */}
      <Modal visible={faqVisible} animationType="slide" transparent={false}>
        <View className="flex-1 bg-white">
          <ProfileHeaderMenu isDifferentPage pageTitle="FAQs" />
          <ScrollView>
            <View className="p-4">
              <Text className="mb-4 px-4 py-6 font-baloo text-3xl font-bold">FAQs</Text>
              {faqData.map((item, idx) => (
                <View key={idx} className="mb-3">
                  <Pressable
                    onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
                    style={{
                      backgroundColor: '#FFF',
                      borderRadius: 16,
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      shadowColor: '#000',
                      shadowOffset: { width: 1, height: 2 },
                      shadowOpacity: 0.07,
                      shadowRadius: 4,
                      elevation: 9,
                    }}>
                    <Text className="font-baloo text-base font-semibold text-gray-800">
                      {item.question}
                    </Text>
                    <Text className="text-xl text-pink-600">{openIndex === idx ? '-' : '+'}</Text>
                  </Pressable>
                  {openIndex === idx && (
                    <View
                      style={{
                        backgroundColor: '#00000008',
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        padding: 14,
                      }}>
                      <Text className="font-baloo text-gray-700">{item.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal visible={termsVisible} animationType="slide" transparent={false}>
        <View className="flex-1 bg-white">
          <ProfileHeaderMenu isDifferentPage pageTitle="Terms & Conditions" />
          <ScrollView>
            <View className="p-4">
              <Text className="mb-4 px-4 py-6 font-baloo text-xl font-bold">
                Terms & Conditions
              </Text>
              <View style={{ padding: 20 }}>
                <Text className="mb-2 font-baloo text-base text-gray-800">
                  1. This program is available only to registered users of the FestGo app.
                </Text>
                <Text className="mb-2 font-baloo text-base text-gray-800">
                  2. The referrer must have booked and completed a stay at the property they are
                  recommending.
                </Text>
                <Text className="mb-2 font-baloo text-base text-gray-800">
                  3. The referred user must use the shared recommendation link to book the same
                  hotel.
                </Text>
                <Text className="mb-2 font-baloo text-base text-gray-800">
                  4. FestGo Coins will be credited within 48 hours after the referred guest
                  successfully completes their stay.
                </Text>
                <Text className="mb-2 font-baloo text-base text-gray-800">
                  5. Only one reward will be given per referred user per hotel.
                </Text>
                <Text className="mb-2 font-baloo text-base text-gray-800">
                  6. Bookings made through external websites or without using the shared link are
                  not eligible.
                </Text>
                <Text className="mb-2 font-baloo text-base text-gray-800">
                  7. FestGo Coins have no monetary value and cannot be transferred or exchanged for
                  cash.
                </Text>
                <Text className="mb-2 font-baloo text-base text-gray-800">
                  8. FestGo reserves the right to modify, suspend, or terminate the program at any
                  time without prior notice.
                </Text>
                <Text className="text-base text-gray-800">
                  9. Any misuse of the program (e.g., self-referrals, fake accounts) will result in
                  disqualification and account suspension.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default RecommendAndEarn;
