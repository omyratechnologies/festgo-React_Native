import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const ScreenLayout = ({ children, className = '' }: ScreenLayoutProps) => {
  return (
    <SafeAreaView className={`flex-1 bg-white ${className}`}>
      <View className="flex-1 px-4">{children}</View>
    </SafeAreaView>
  );
};
