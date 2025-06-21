import { TouchableOpacity, Text, ActivityIndicator, Animated } from 'react-native';

import Typography from './Typography';

import { colors } from '~/theme/theme';

type ButtonProps = {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
}: ButtonProps) => {
  const baseStyles = 'rounded-[100px] flex-row items-center justify-center';

  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-4 py-[18px]',
    lg: 'px-4 py-[18px]',
  };

  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'border-2 border-primary',
  };

  const textStyles = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-primary',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={[
        {
          gap: 10,
        },
      ]}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary.DEFAULT : 'white'} />
      ) : (
        <Typography variant="h4" weight="semibold" className={`${textStyles[variant]} font-baloo`}>
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
};
