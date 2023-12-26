import React, { useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";


import { Ionicons } from "@expo/vector-icons";
import { firebase } from "../firebaseConfig/config.js";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const Drawer = createDrawerNavigator();
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

SplashScreen.preventAutoHideAsync();
const DrawerContent = (props) => {
  let [LoadedFonts] = useFonts({
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  });
  const onLayoutRootView = new useCallback(async () => {
    if (LoadedFonts) {
      await SplashScreen.hideAsync();
    }
  }, [LoadedFonts]);
  if (!LoadedFonts) return null;

  const logOut = async () => {
    try {
      await firebase
        .auth()
        .signOut()
        .then(() => {
          Alert.alert("You are signed out");
          console.log("User signed out");
        });
    } catch (error) {
      console.error("Error occured: ", error);
    }
  };

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <DrawerContentScrollView {...props}>
        {/* Custom  header */}
        <ImageBackground
          source={require("../assets/imgs/drawer-background2.png")}
          style={styles.drawerHeader}
        ></ImageBackground>
        <Text
          style={{
            paddingTop: 20,
            paddingLeft: 20,
            fontFamily: "Pacifico",
            fontSize: 25,
            textTransform: "capitalize",
          }}
        >
          Hello There
        </Text>
        {/* Standard drawer items */}
        <View style={styles.drawerList}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{ padding: 20, borderTopWidth: 1, borderBlockColor: "grey" }}
      >
        <TouchableOpacity
          onPress={() => logOut()}
          style={{ paddingVertical: 2 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="ios-exit-outline" size={20} color="black" />
            <Text
              style={{
                fontSize: 15,
                textTransform: "capitalize",
              }}
            >
              log out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  drawerHeader: {
    marginTop: 20,
    width: "100%",
    height: windowHeight * 0.2, //drawer header will take 25% of the screen (1/4).
  },
  drawerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  drawerList: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
});
export default DrawerContent;
