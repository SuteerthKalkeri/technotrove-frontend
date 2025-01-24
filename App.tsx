/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AppNavigator from './navigation/AppNavigator';
import Toast from 'react-native-toast-message';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function App(): React.JSX.Element {

  return (
    <>
      <AppNavigator />
      <Toast/>
    </>
     
  );
}


export default App;
