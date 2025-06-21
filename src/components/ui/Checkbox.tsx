import React from 'react';
import { Pressable, Text } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onCheck: (checked: boolean) => void;
  className?: string;
}

const Checkbox = ({ checked, onCheck, className = '' }: CheckboxProps) => {
  return (
    <Pressable
      onPress={() => onCheck(!checked)}
      className={`h-5 w-5 items-center justify-center rounded border ${
        checked ? 'border-[#07662D] bg-white' : 'border-gray-300'
      } ${className}`}>
      {checked && <Text className="text-white bg-[#07662D] w-full h-full text-md text-center  font-bold">✓</Text>}
    </Pressable>
  );
};

export default Checkbox;