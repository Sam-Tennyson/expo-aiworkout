import React from 'react';
import { Stack } from 'expo-router';

const Navbar = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, headerTransparent: true }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
};

export default Navbar;
