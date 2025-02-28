import { Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import { tailwind } from '@/utils/tailwind';
import Container from './Container';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import useTimer from '@/hooks/useTimer';
import { Foundation } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import ExerciseNotesModal from '../modals/ExerciseNotesModal';
import useModal from '@/hooks/useModal';

const ActiveWorkoutNotes = () => {
  const { isLargeScreen } = useWebBreakPoints();
  const { hideModal, showModal, openModal } = useModal();
  const { elapsedTime, remainingTime, handlePlay, handlePause, handleStop } = useTimer();
  const isActiveRepExerciseCard = useWorkoutSessionStore(state => state.isActiveRepExerciseCard);

  const handleActiveWorkoutIconClick = () => {
    console.log('Active Workout Icon Clicked');
    handlePause();
    showModal();
  };

  const getContainerWebStyle = () => {
    if (isActiveRepExerciseCard) {
      return isLargeScreen ? 'bottom-4 right-[75px]' : `bottom-4 right-28`;
    }
    return isLargeScreen ? 'bottom-4 right-[75px]' : `bottom-4 right-[218px]`;
  };

  const getContainerNativeStyle = () => {
    if (isActiveRepExerciseCard) {
      return 'bottom-4 right-[60px]';
    }
    return 'bottom-4 right-[60px]';
  };
  return (
    <>
      <Container
        style={Platform.select({
          web: tailwind(`absolute  ${getContainerWebStyle()} z-50 `),
          native: tailwind(`absolute  ${getContainerNativeStyle()} z-50 `),
        })}>
        <TouchableOpacity activeOpacity={1} onPress={handleActiveWorkoutIconClick}>
          <Foundation
            name="clipboard-notes"
            size={38}
            color={Colors.brandColor}
            style={Platform.select({
              web: tailwind(`aspect-square  `),
              native: tailwind('aspect-square'),
            })}
          />
        </TouchableOpacity>
      </Container>
      {openModal && <ExerciseNotesModal isVisible={openModal} toggleModal={hideModal} />}
    </>
  );
};

export default ActiveWorkoutNotes;
