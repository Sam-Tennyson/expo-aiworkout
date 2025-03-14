import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Container from '@/components/atoms/Container';
import { Platform } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { Text } from '@/components/Themed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useAuthStore } from '@/store/authStore';
import WorkoutIndexRoute from './workouts';
import PublicScreenRoute from './workouts/public';
import GradientBackground from '@/components/atoms/GradientBackground';
import { useEffect } from 'react';
import { checkHasDataInStorage } from '@/utils/SyncDataHelper';
import DisplaySyncModal from '@/components/modals/DisplaySyncModal';
import useModal from '@/hooks/useModal';

const Tab = createMaterialTopTabNavigator();

export default function Layout() {
  const insets = useSafeAreaInsets();
  const { isLargeScreen } = useBreakPoints();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { showModal, hideModal, openModal } = useModal();

  const handleShowSyncModal = async () => {
    const hasData = await checkHasDataInStorage();
    if (hasData) {
      showModal();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleShowSyncModal();
    }
  }, [isAuthenticated]);
  return (
    <SafeAreaView style={[tailwind('flex-1')]}>
      <GradientBackground
        styleWeb="!mt-0"
        styleNative={[
          Platform.select({
            web: tailwind(`${isLargeScreen ? '' : ''} flex-1`),
            native: tailwind('flex-1'),
          }),
        ]}>
        <Container style={[tailwind('flex-1'), { marginTop: insets.bottom }]}>
          <Tab.Navigator
            sceneContainerStyle={Platform.select({
              web: tailwind('bg-transparent '),
              native: tailwind('flex-1 bg-transparent'),
            })}
            // initialRouteName="workout"
            screenOptions={({ route }) => {
              // console.log(route, 'route');

              return {
                tabBarStyle: Platform.select({
                  web: tailwind(
                    `rounded-t-4 mx-auto 
                  ${isLargeScreen ? 'mt-4' : 'mt-32'} w-80
                    capitalize 
               
                  `,
                  ),
                  native: {
                    // backgroundColor: '#493B42', // Set the background color based on the selected tab
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    marginHorizontal: 16,
                  },
                }),
                tabBarIndicatorStyle: {
                  backgroundColor: '#9C79C9', // Set the background color for the selected tab's indicator
                },
                tabBarIndicatorContainerStyle: {
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                },
                tabBarLabel: (props: { focused: boolean; color: string; children: string }) => {
                  const { children } = props;
                  return <Text>{children}</Text>;
                },
              };
            }}>
            {/* {isAuthenticated && ( */}
            <Tab.Screen
              name="workouts/index"
              component={WorkoutIndexRoute}
              options={({ route }) => ({
                title: 'My workouts',
              })}
            />
            <Tab.Screen
              name="workouts/public"
              component={PublicScreenRoute}
              options={({ route }) => ({
                title: 'Public workouts',
              })}
            />
          </Tab.Navigator>
        </Container>
      </GradientBackground>
      <DisplaySyncModal isVisible={openModal} toggleModal={hideModal} onComplete={() => {}} />
    </SafeAreaView>
  );
}
