import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Container from '../atoms/Container';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { tailwind } from '@/utils/tailwind';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import SoundIcon from '../atoms/SoundIcon';

interface IExerciseStartAndPause {
  isTimerRunning: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  showStopButton?: boolean;
  disableControls?: boolean;
}

const ExerciseStartAndPause = (props: IExerciseStartAndPause) => {
  const {
    isTimerRunning,
    onPlay,
    onPause,
    onStop,
    disableControls = false,
    showStopButton = false,
  } = props;

  const { isLargeScreen } = useWebBreakPoints();

  const isWorkoutSessionDetailScreenTimerPaused = useWorkoutDetailStore(
    state => state.isWorkoutSessionDetailScreenTimerPaused,
  );

  const workoutDetails = useWorkoutDetailStore(state => state.workoutDetail);
  const { updateIsWorkoutSessionDetailScreenTimerPaused, updateWorkoutTimer } =
    useWorkoutDetailStore();

  const onResume = () => {
    updateIsWorkoutSessionDetailScreenTimerPaused(false);
    updateWorkoutTimer(true);
  };

  const renderIcon = () => {
    if (isTimerRunning) {
      // add stop icons
      return (
        <>
          <View
            style={Platform.select({
              web: tailwind(
                `${' h-15 w-15 p-2'} z-20 items-center justify-center rounded-full bg-WORKOUT_PURPLE ${disableControls ? 'opacity-50' : ''}`,
              ),
              native: tailwind(
                `h-15 w-15 items-center justify-center rounded-full  bg-WORKOUT_PURPLE p-2  ${disableControls ? 'opacity-50' : ''}`,
              ),
            })}>
            <AntDesign name="pause" size={40} color={Colors.white} />
          </View>
        </>
      );
    }
    return (
      <>
        <View
          style={Platform.select({
            web: tailwind(
              `${' h-15 w-15 py-1 py-2 pl-2'} z-20 items-center justify-center rounded-full bg-WORKOUT_PURPLE  ${disableControls ? 'opacity-50' : ''}`,
            ),
            native: tailwind(
              `h-15 w-15 items-center justify-center rounded-full  bg-WORKOUT_PURPLE py-1 py-2 pl-2  ${disableControls ? 'opacity-50' : ''}`,
            ),
          })}>
          <Feather name="play" size={40} color={Colors.white} />
        </View>
      </>
    );
  };

  const renderWorkoutActionButton = () => {
    if (isWorkoutSessionDetailScreenTimerPaused) {
      return (
        <>
          {/* Workout Status */}
          <View style={tailwind(' mb-2 flex-row items-center justify-center')}>
            <View
              style={tailwind('items-center justify-center rounded-full bg-gray-800 px-3 py-1')}>
              <Text style={tailwind('text-center text-sm font-medium text-WORKOUT_PURPLE')}>
                {workoutDetails?.status?.toUpperCase() || 'Unknown'}
              </Text>
            </View>
          </View>

          {/* Resume / Finished Continue Button */}
          {workoutDetails?.status !== 'completed' && (
            <TouchableOpacity
              style={[
                tailwind(
                  'flex-row items-center justify-center rounded-lg bg-WORKOUT_PURPLE p-1 px-2',
                ),
              ]}
              onPress={onResume} // Or add a callback for specific action
            >
              <AntDesign name="playcircleo" size={20} color={Colors.white} />
              <Text style={tailwind('ml-2 text-base font-medium text-white')}>{'Resume'}</Text>
            </TouchableOpacity>
          )}
        </>
      );
    }
    return (
      <>
        <Container
          style={Platform.select({
            web: tailwind('flex flex-row items-center justify-end gap-2  '),
          })}>
          {/* Sound Icon render */}
          <SoundIcon />
          {/* Play / Pause Button */}
          <TouchableOpacity onPress={isTimerRunning ? onPause : onPlay} disabled={disableControls}>
            {renderIcon()}
          </TouchableOpacity>
        </Container>

        {/* Stop Button */}
        {showStopButton && (
          <TouchableOpacity
            style={[styles.button, disableControls && styles.disabledButton]}
            onPress={onStop}
            disabled={disableControls}>
            <FontAwesome name={'stop'} size={24} />
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <Container
      style={Platform.select({
        web: tailwind(
          `${isLargeScreen ? '' : 'min-w-72 flex-col items-center justify-end gap-1 gap-3'} `,
        ),
      })}>
      {renderWorkoutActionButton()}
    </Container>
  );
};

export default ExerciseStartAndPause;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#2ecc71',
  },
  pauseButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: Colors.lightGray,
  },
});
