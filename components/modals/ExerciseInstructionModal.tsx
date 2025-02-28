import { Platform, StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';
import { tailwind } from '@/utils/tailwind';
import RenderHTML from 'react-native-render-html';
import ModalWrapper from './ModalWrapper';

interface IExerciseInstructionModal {
  isVisible: boolean;
  toggleModal: () => void;
  onComplete?: () => void;
}

interface PromptExercise {
  exercise_name: string;
  reps: number;
  duration: number;
  weight: number;
  rest: number;
}

const htmlString = `
  <h2>Knee Rolls Exercise</h2>
  <div>
    <div><strong>Lie on your back</strong> with knees bent, feet flat...</div>
    <div><strong>Slowly lower</strong> both knees to one side...</div>
    <div><strong>Hold briefly</strong>, then return to center.</div>
    <div><strong>Repeat</strong> on the other side for 8-12 reps per side.</div>
  </div>
  <p>Move gently and keep the core engaged.</p>
`;

export interface ICommonPromts {
  id: number;
  name: string;
  workout: PromptExercise[];
}

const ExerciseInstructionModal = (props: IExerciseInstructionModal) => {
  const { isVisible, toggleModal } = props;

  return (
    <ModalWrapper
      isModalVisible={isVisible}
      isCrossIconVisible={true}
      headerTitle={'Instructions'}
      closeModal={toggleModal}>
      <View
        style={Platform.select({
          web: tailwind(``),
          native: tailwind(''),
        })}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.commonPromptContainer}>
          <RenderHTML
            contentWidth={500}
            source={{ html: htmlString }}
            tagsStyles={{
              h2: { color: '#fff', fontSize: 18, marginBottom: 10 },
              ol: { listStyleType: 'none' },
              div: {
                marginBottom: 8,
                fontSize: 14,
                lineHeight: 24,
                color: '#fff',
                flexDirection: 'column',
              },
              strong: { fontWeight: 'bold' },
              p: { fontSize: 14, marginTop: 10, color: '#fff' },
            }}
          />
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default ExerciseInstructionModal;

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContainer: {
    maxHeight: 300,
    minHeight: 200,
  },
  workoutItem: {
    marginBottom: 6,
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
  },
  workoutText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  detailInput: {
    flex: 1,
    backgroundColor: '#2c2c3e',
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputGroup: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c3e',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  commonPromptContainer: {
    marginBottom: 10,
  },
  commonPromptButton: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#493B42',
  },
  commonPromptText: {
    color: 'white',
    fontSize: 12,
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
    color: '#fff',
    textAlign: 'center',
  },
  detailContainerRow: {
    // backgroundColor: 'red',
  },
});
