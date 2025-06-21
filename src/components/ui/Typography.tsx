import { Text, TextProps } from 'react-native';

import { typography, colors } from '~/theme/theme';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'tiny';

type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  color?: keyof typeof colors.text;
  children: React.ReactNode;
  className?: string;
}

export const Typography = ({
  variant = 'body',
  weight = 'regular',
  color = 'DEFAULT',
  children,
  className = '',
  ...props
}: TypographyProps) => {
  const fontWeights = {
    regular: 'font-[PlusJakartaSans-Regular] font-normal',
    medium: 'font-[PlusJakartaSans-Regular] font-medium',
    semibold: 'font-[PlusJakartaSans-SemiBold] font-semibold',
    bold: 'font-[PlusJakartaSans-Bold] font-bold',
  };

  const variantStyles = {
    // display: 'text-[32px]',
    h1: typography.h1,
    h2: typography.h2,
    h3: typography.h3,
    h4: typography.h4,
    body: typography.body,
    small: typography.small,
    tiny: typography.tiny,
  };

  const defaultWeights = {
    h1: 'bold',
    h2: 'bold',
    h3: 'semibold',
    h4: 'semibold',
    body: 'normal',
    small: 'normal',
    tiny: 'normal',
  };

  return (
    <Text
      className={`
        font-[PlusJakartaSans-Regular]
        ${fontWeights[weight || defaultWeights[variant]]}
        ${variantStyles[variant]}
        text-text-${color.toLowerCase()}
        ${className}
        font-bold
      `}
      {...props}>
      {children}
    </Text>
  );
};

export default Typography;
