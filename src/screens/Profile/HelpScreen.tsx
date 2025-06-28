import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import React, { useState } from 'react';
import BottomMenu from '~/components/common/BottomMenu';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import MailIcon from '~/assets/icons/mailWhite.svg';
import PhoneIcon from '~/assets/icons/phoneWhite.svg';

const CONTACT_PHONE = '+1234567890';
const CONTACT_EMAIL = 'support@example.com';

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to Settings > Account > Reset Password and follow the instructions.',
  },
  {
    question: 'How can I contact support?',
    answer: 'You can call or email us using the options above.',
  },
  {
    question: 'Where can I find my tickets?',
    answer: 'Your tickets are available in the "My Tickets" section of your profile.',
  },
];

const AccordionItem = ({
  question,
  answer,
  isActive,
  onPress,
}: {
  question: string;
  answer: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <View className="mb-2 " >
    <TouchableOpacity
      className="flex-row items-center rounded-2xl bg-white justify-between px-4 py-3"
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 9,
      }}>
      <Text className="text-base font-poppins font-semibold text-gray-800">{question}</Text>
      <Text className="text-xl text-gray-400">{isActive ? '-' : '+'}</Text>
    </TouchableOpacity>
    {isActive && (
      <View className="px-4 mt-3 pb-4">
        <Text className="text-gray-600 font-poppins">{answer}</Text>
      </View>
    )}
  </View>
);

const HelpScreen = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleCall = () => {
    Linking.openURL(`tel:${CONTACT_PHONE}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ProfileHeaderMenu isDifferentPage pageTitle="Help" />
      <ScrollView>
        <View className="p-4">
          {/* Contact Us Section */}
          <Text className="mb-2 p-4 font-poppins text-2xl font-bold text-gray-800">Contact Us</Text>
          <View className="mb-6 flex-row gap-4 space-x-4 p-4">
            {/* Call Us Card */}
            <TouchableOpacity
              className="flex-1 items-center rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
              onPress={handleCall}
              activeOpacity={0.85}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 4,
                elevation: 9,
              }}>
              <View className="mb-2 rounded-lg bg-[#F15A29] p-3">
                <PhoneIcon width={20} height={20} color="#02AFFF" />
              </View>
              <Text className="mb-1 font-poppins text-base font-semibold text-gray-800">
                Call Us
              </Text>
              <Text className="text-center font-poppins text-sm text-gray-600">
                Our team is on the line
              </Text>
              <Text className="mt-1 font-poppins text-xs text-gray-400">Mon-Fri • 9-17</Text>
            </TouchableOpacity>
            {/* Email Us Card */}
            <TouchableOpacity
              className="flex-1 items-center rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
              onPress={handleEmail}
              activeOpacity={0.85}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 4,
                elevation: 9,
              }}>
              <View className="mb-2 rounded-lg bg-[#F15A29] p-3">
                <MailIcon width={20} height={20} color="#02AFFF" />
              </View>
              <Text className="mb-1 font-poppins text-base font-semibold text-gray-800">
                Email Us
              </Text>
              <Text className="text-center font-poppins text-sm text-gray-600">
                support@exaple.com
              </Text>
              <Text className="mt-1 font-poppins text-xs text-gray-400">We reply within 24h</Text>
            </TouchableOpacity>
          </View>

          {/* FAQ Section */}
          <Text className="mb-2 p-4 font-poppins text-2xl font-bold text-gray-800">FAQs</Text>
          <View>
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isActive={activeIndex === idx}
                onPress={() => setActiveIndex(activeIndex === idx ? null : idx)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default HelpScreen;
