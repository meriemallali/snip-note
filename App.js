// import 'react-native-gesture-handler';
import {
  StyleSheet,
  Text,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect, Provider } from "react";
import {  NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import {
  Ionicons,
  MaterialIcons,
  Octicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { firebase } from "./src/firebaseConfig/config.js";
// Import components.
import DrawerContent from "./src/components/Drawer.js";
import CustomHeader from "./src/components/Header.js";
// Import screens.
import LoginScreen from "./src/screens/LoginScreen.js";
import SignUpScreen from "./src/screens/SignUpScreen.js";
import HomeScreen from "./src/screens/HomeScreen.js";
import NotesScreen from "./src/screens/NotesScreen.js";
import ForgotPasswordScreen from "./src/screens/forgotPassword.js";
import ToDoListScreen from "./src/screens/ToDoListScreen.js";
import FlashCardsScreen from "./src/screens/FlashCardsScreen.js";
import SettingsScreen from "./src/screens/Settings.js";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  const [Initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // handle user state.
  const authStateChange = (registereduser) => {
    if (registereduser) {
      setUser(registereduser);
    } else {
      setUser(null);
    }
    if (Initializing) setInitializing(false);
  };
  useEffect(() => {
    const member = firebase.auth().onAuthStateChanged(authStateChange);
    return () => member;
  }, []);

  if (Initializing) return null;
  // render the side drawer
  const SideDrawer = () => {
    return (
      <Drawer.Navigator
        drawerContent={DrawerContent}
        screenOptions={{
          drawerPosition: "left",
          drawerActiveBackgroundColor: "#5885AF",
          drawerActiveTintColor: "white",
          drawerLabelStyle: {
            marginLeft: -25,
            fontSize: 15,
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            header: () => <CustomHeader name="" />,
            drawerIcon: () => (
              <Ionicons name="home-outline" size={20} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="Notes"
          component={NotesScreen}
          options={{
            header: () => <CustomHeader name="Notes list" />,
            drawerIcon: () => (
              <MaterialIcons name="notes" size={20} color="black" />
            ),
          }}
        ></Drawer.Screen>
        <Drawer.Screen
          name="To do list"
          component={ToDoListScreen}
          options={{
            header: () => <CustomHeader name="Tasks list" />,
            drawerIcon: () => (
              <Octicons name="checklist" size={20} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="Flash Cards"
          component={FlashCardsScreen}
          options={{
            header: () => <CustomHeader name="" />,
            drawerIcon: () => (
              <MaterialCommunityIcons
                name="cards-outline"
                size={20}
                color="black"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            header: () => <CustomHeader name="" />,
            drawerIcon: () => (
              <Ionicons name="settings-outline" size={20} color="black" />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  };

  return (
    <NavigationContainer>
      {/* i changed the state for dev */}
      {user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Null"
            component={SideDrawer}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerBackground: () => (
                <ImageBackground
                  source={require("./src/assets/imgs/login_background.png")}
                  style={styles.headerImage}
                >
                  <Text style={styles.bottomBackground}></Text>
                </ImageBackground>
              ),
              headerStyle: {
                height: Dimensions.get("window").height * 0.4,
                elevation: 25,
              },
              headerTitle: "", // Empty header title, to hide the screen name
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              headerStyle: {
                height: Dimensions.get("window").height * 0.1, //header takes 10% of the device's screen
              },
              headerTitle: () => null, // Empty header title, to hide the screen name
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
              headerTintColor: "#ffffff",
              headerTitle: "Forgot Password",
              headerStyle: {
                backgroundColor: "#5885AF",
                elevation: 25,
              },
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerImage: {
    position: "absolute",
    zIndex: -25,
    width: "100%",
    height: Dimensions.get("window").height * 0.4,
  },
  bottomBackground: {
    backgroundColor: "red",
    top: "-20%",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
});

export default () => {
  return <App />;
};
