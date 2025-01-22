import { getStatusColor } from '@/utils/helper';
import { tailwind } from '@/utils/tailwind';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function WorkoutStatus(props: { itemStatus: 'COMPLETED' | 'PENDING' | 'FINISHED' }) {
  const { itemStatus } = props;
  const [colorObject, setColorObject] = useState<{
    background: string;
    text: string;
  }>({
    background: 'bg-gray-400',
    text: 'text-gray-400',
  });

  useEffect(() => {
    if (itemStatus) {
      const status = itemStatus === 'FINISHED' ? 'COMPLETED' : itemStatus;
      const result = getStatusColor(status) as {
        background: string;
        text: string;
      };
      setColorObject(result);
    }
  }, [itemStatus]);

  return (
    <View style={tailwind(`items-center justify-center  ${colorObject.background} `)}>
      <Text
        style={tailwind(
          `rounded-full text-center text-sm font-medium ${colorObject.text} px-2 py-1`,
        )}>
        {itemStatus || 'Unknown'}
      </Text>
    </View>
  );
}
