import Container from '@/components/atoms/Container';
import GridContainer from '@/components/atoms/GridContainer';
import ImageContainer from '@/components/atoms/ImageContainer';
import Loading from '@/components/atoms/Loading';
import TextContainer from '@/components/atoms/TextContainer';
import { Text } from '@/components/Themed';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useFetchData } from '@/hooks/useFetchData';
import { fetchPublicWorkoutService } from '@/services/workouts';
import { useAuthStore } from '@/store/authStore';
import { tailwind } from '@/utils/tailwind';
import { useEffect, useState } from 'react';
import { ActionButton } from '../atoms/ActionButton';
import { AntDesign } from '@expo/vector-icons';
import { IMAGES } from '@/utils/images';
import CustomSwitch from '../atoms/CustomSwitch';

export default function MyWorkout() {
  const { isAuthenticated } = useAuthStore();
  const [productData, setProductData] = useState<any[]>([]);
  const { isSmallScreen, isLargeScreen } = useBreakPoints();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const toggleSwitch = () => setIsEnabled(!isEnabled);

  // Function to handle refresh action
  const onRefresh = async () => {
    await refetch();
  };
  const { data, error, isPending, refetch } = useFetchData({
    queryFn: async () => await fetchPublicWorkoutService(),
    queryKey: ['workouts'],
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setProductData(data?.data);
    }
  }, [data]);

  const renderListItem = (item: any, index: number) => {
    if (item?.isPlaceholder) {
      return <Container style={tailwind(`relative h-full w-full flex-1`)}></Container>;
    }
    return (
      <Container
        style={[
          tailwind(
            `relative h-full w-full flex-1 grow self-center ${isEnabled ? 'rounded-lg bg-NAVBAR_BACKGROUND' : ''}`,
          ),
        ]}>
        {!isEnabled && (
          <ImageContainer
            source={IMAGES.logo}
            styleNative={[tailwind(`aspect-square  w-full  self-center rounded-2xl `)]}
            contentFit="fill"
          />
        )}
        <TextContainer
          data={item?.name}
          style={tailwind(` h-full w-full flex-1 grow text-center ${isEnabled ? 'my-4' : 'mt-4'}`)}
        />
      </Container>
    );
  };

  const renderWorkingListing = () => {
    if (isPending) {
      return <Loading />;
    }
    if (error) return <Text>An error has occurred: + {error.message}</Text>;
    // Ensure bracketPrediction is iterable
    const iterableProductData = Array.isArray(productData) ? productData : [];

    // Calculate how many placeholders are needed to make length a multiple of 4
    const placeholdersNeeded =
      iterableProductData.length % 4 === 0 ? 0 : 4 - (iterableProductData.length % 4);

    // Add placeholders to fill the grid evenly
    const adjustedData = [
      ...iterableProductData,
      ...Array(placeholdersNeeded).fill({ isPlaceholder: true }),
    ];
    return (
      <GridContainer
        data={adjustedData}
        renderListHeaderComponent={renderTopHeader}
        refreshingNative={isPending}
        onRefresh={onRefresh}
        listNumColumnsNative={isSmallScreen ? 2 : 4}
        keyExtractorNative={item => item?._id}
        renderListItemInNative={renderListItem}
      />
    );
  };

  const renderTopHeader = () => {
    if (isAuthenticated) {
      return (
        <>
          <Container
            style={[tailwind('flex-row items-center justify-between rounded-2xl ')]}
            className="mb-4 flex w-full flex-1 flex-col gap-2">
            <Container
              style={tailwind('mb-4 flex w-full flex-row justify-between gap-y-4')}
              className="flex items-center justify-between">
              <Text
                style={[
                  tailwind(
                    `text-4 text-center capitalize not-italic leading-10 text-white ${!isLargeScreen ? 'text-8' : ''}`,
                  ),
                ]}>
                List of workouts
              </Text>
              <ActionButton
                label={'Add Workout'}
                onPress={() => {}}
                style={tailwind('rounded-xl')}
                left={<AntDesign name="pluscircleo" size={20} color="white" />}
              />
              {/* {renderVersionTab()} */}
            </Container>
          </Container>
          <Container
            style={[tailwind('mb-4 border-[0.5px] border-white')]}
            className="border border-white"
          />
        </>
      );
    }
    return null;
  };

  const renderVersionTab = () => {
    return (
      <>
        <CustomSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} label="Short Version" />
      </>
    );
  };

  return (
    <Container style={tailwind(`h-full w-full flex-1 px-4 ${!isLargeScreen ? 'my-4 px-28' : ''} `)}>
      {renderVersionTab()}
      {renderWorkingListing()}
    </Container>
  );
}
