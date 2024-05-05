import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/LoginScreen'
import ExamsScreen from './pages/examsScreen'

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Exams"
          component={ExamsScreen}
          options={({ route }) => ({ title: ['Bem vindo: ', route.params.name].join(''), headerBackVisible: false })}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;