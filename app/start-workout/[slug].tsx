import { Platform } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from '@/components/atoms/GradientBackground';
import { tailwind } from '@/utils/tailwind';
import StartWorkoutScreen from '@/components/screens/StartWorkoutScreen';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { fetchPublicWorkoutServiceById } from '@/services/workouts';
import { REACT_QUERY_API_KEYS, REACT_QUERY_STALE_TIME } from '@/utils/appConstants';

const StartWorkoutDetail = () => {
  const queryClient = useQueryClient();
  const { slug } = useLocalSearchParams();
  const { isLargeScreen } = useBreakPoints();
  const { setWorkoutDetail } = useWorkoutDetailStore();
  const { data, refetch } = useQuery({
    queryFn: () => fetchPublicWorkoutServiceById({ id: slug }),
    queryKey: [REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS, slug],
    staleTime: REACT_QUERY_STALE_TIME.PUBLIC_WORKOUT_DETAILS,
    enabled: false,
  });

  useEffect(() => {
    const cachedData: any = queryClient.getQueryData([
      REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS,
      slug,
    ]);
    const requiredData = data || cachedData;
    // console.log('Refetch: ', { isStale }, { data });
    // console.log({ requiredData });
    if (requiredData) {
      setWorkoutDetail(requiredData);
    } else {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.PUBLIC_WORKOUT_DETAILS, slug],
        refetchType: 'all',
      });
      refetch();
    }
  }, [slug, refetch, data]);

  const renderScreenData = () => {
    return <StartWorkoutScreen />;
  };
  return (
    <SafeAreaView style={tailwind('flex-1')}>
      <GradientBackground
        styleNative={[
          Platform.select({
            web: tailwind(`${!isLargeScreen ? 'mt-24' : ''} flex-1`),
            native: tailwind('!mt-0 flex-1'),
          }),
        ]}>
        {renderScreenData()}
      </GradientBackground>
    </SafeAreaView>
  );
};

export default StartWorkoutDetail;
