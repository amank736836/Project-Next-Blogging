import React from 'react';

const SIZES = {
  sm: 'max-w-5xl',
  md: 'max-w-6xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[86rem]',
  prose: 'max-w-3xl',
};

export default function Container({
  children,
  size = 'lg',
  as: Tag = 'div',
  className = '',
  ...props
}) {
  return (
    <Tag
      className={`mx-auto w-full px-5 sm:px-6 lg:px-8 ${SIZES[size] || SIZES.lg} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
