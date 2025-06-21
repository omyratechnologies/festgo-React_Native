import { View, TextInput, Text } from 'react-native';

import { colors } from '~/theme/theme';

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  className?: string;
  onBlur?: () => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  onFocus?: () => void;
  editable?: boolean;
};

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  className,
  onBlur,
  keyboardType,
  onFocus,
  editable = true,
}: InputProps) => {
  return (
    <View className="mb-4">
      {label && <Text className="mb-2 font-medium text-gray-700">{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        editable={editable}
        className={`
          rounded-lg
          border
          bg-gray-50
          px-4
          py-3
          ${error ? 'border-error' : 'border-gray-300'}
          ${className}
        `}
        placeholderTextColor={colors.text.light}
        onBlur={onBlur}
        keyboardType={keyboardType}
        onFocus={onFocus}
      />
      {error && <Text className="mt-1 text-sm text-error">{error}</Text>}
    </View>
  );
};
