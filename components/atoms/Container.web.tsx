import React from 'react';

export default function Container(props: {
  children?: React.ReactNode;
  className?: string; // for web styling
}) {
  const { children, className } = props;
  return <div className={className}>{children}</div>;
}
