import { ExerciseElement } from '@/services/interfaces';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import 'react-native-gesture-handler';
import { tailwind } from '@/utils/tailwind';
import { Image } from 'expo-image';
import { IMAGES } from '@/utils/images';
import ExerciseCard from '../atoms/ExerciseCard';
import { getReorderItemsForSortingWorkoutExercises } from '@/utils/helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sortExercisesRequest } from '@/services/workouts';
import { useLocalSearchParams } from 'expo-router';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import useWorkoutNonLoggedInUser from '@/hooks/useWorkoutNonLoggedInUser';
import { useAuthStore } from '@/store/authStore';

const DraggableExercises = (props: {
  setIsPendingExerciseCardAction: (loading: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const { setIsPendingExerciseCardAction } = props;
  const { updateWorkoutExercises } = useWorkoutDetailStore();
  const { slug } = useLocalSearchParams() as any;
  const exercisesList: any[] = useWorkoutDetailStore(state => state.workoutDetail?.exercises) ?? [];
  const { handleSortExerciseForNonLoggedInUser } = useWorkoutNonLoggedInUser();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const [data, setData] = useState<ExerciseElement[]>(
    [...exercisesList].sort((a, b) => a.order - b.order),
  );

  const { mutate: mutateSortExercise, isPending } = useMutation({
    mutationFn: sortExercisesRequest,
    onSuccess: async data => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug] });
      // queryClient.setQueryData([REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug], data?.data);
      updateWorkoutExercises(data?.data?.exercises);
    },
  });

  useEffect(() => {
    const sortedExercisesList = [...exercisesList].sort((a, b) => a.order - b.order);
    setData(sortedExercisesList);
  }, [exercisesList]);

  // Use a ref to avoid triggering continuous re-renders
  useEffect(() => {
    if (setIsPendingExerciseCardAction) {
      setIsPendingExerciseCardAction(isPending);
    }
  }, [isPending, setIsPendingExerciseCardAction]);

  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<ExerciseElement>) => {
    const index = getIndex();
    return (
      <ScaleDecorator>
        <ExerciseCard
          data={item}
          index={index ?? 0}
          handleSubmit={() => {}}
          setIsPendingExerciseCardAction={setIsPendingExerciseCardAction}>
          <TouchableOpacity onPressIn={drag} onLongPress={drag} onPress={drag} disabled={isActive}>
            <Image source={IMAGES.dragDot} contentFit="contain" style={tailwind(' h-5 w-5 ')} />
          </TouchableOpacity>
        </ExerciseCard>
      </ScaleDecorator>
    );
  };

  const handleDragEnd = ({ data }: any) => {
    // console.log(data, 'DATA');
    const modifiedData = getReorderItemsForSortingWorkoutExercises(data);
    const payload = {
      queryParams: { id: slug },
      formData: { ...modifiedData },
    };
    if (isAuthenticated) {
      mutateSortExercise(payload);
    } else {
      handleSortExerciseForNonLoggedInUser(modifiedData);
      console.log('Not authenticated');
    }
    setData(data);
  };

  return (
    <>
      <DraggableFlatList
        data={data}
        onDragEnd={handleDragEnd}
        keyExtractor={(item, index) => item?._id + index}
        getItemLayout={(data, index) => {
          return { index, length: 100, offset: 100 * index };
        }}
        style={{
          marginBottom: 55,
        }}
        initialNumToRender={1}
        // maxToRenderPerBatch={10}
        // updateCellsBatchingPeriod={10}
        // windowSize={5}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      />
    </>
  );
};
export default DraggableExercises;
