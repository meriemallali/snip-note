import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useCallback,useContext } from "react";
import { firebase } from "../firebaseConfig/config.js";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const HomeScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");

  let [LoadedFonts] = useFonts({
    Courgette: require("../assets/fonts/Courgette-Regular.ttf"),
  });
  const onLayoutRootView = new useCallback(async () => {
    if (LoadedFonts) {
      await SplashScreen.hideAsync();
    }
  }, [LoadedFonts]);
  if (!LoadedFonts) return null;
  const user = firebase.auth().currentUser;
  if (user) {
    // Get the current user's document from the "users" collection using the id.
    const userRef = firebase.firestore().collection("users").doc(user.uid);
    userRef.get().then((doc) => {
      if (doc.exists) {
        // Get the username from the document data
        const userData = doc.data();
        // Add a welcome text to the username => displayed in the header.
        setUsername(`Welcome Back ${userData.username}`);
      }
    });
  }

  return (
    <>
      {/* Welcome header */}
      <View style={[styles.welcomeContainer]} onLayout={onLayoutRootView}>
        <Text style={styles.welcomeText}> {username}</Text>
      </View>
      {/* Buttons list. */}
      <View style={[styles.container,]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Notes");
          }}
        >
          <Text style={styles.text}>Notes </Text>
          <AntDesign name="right" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#92AEC9" }]}
          onPress={() => {
            navigation.navigate("To do list");
          }}
        >
          <Text style={styles.text}>To do list </Text>
          <AntDesign name="right" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#B9CADA" }]}
          onPress={() => {
            navigation.navigate("Flash Cards");
          }}
        >
          <Text style={styles.text}>Flash Cards </Text>
          <AntDesign name="right" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 3, //takes 3/4 of the screen
    overflow: "visible",
    zIndex: 0,
    width: windowWidth,
    height: windowHeight,
    alignItems: "center",
    position: "absolute", //to respect the zIndex of its parent
    marginTop: 100,
    paddingTop: 100,
  },
  welcomeContainer: {
    flex: 1, //takes 1/4 of the screen
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 40,
    top: 40,
    fontFamily: "Courgette",
    color: "#5885AF",
    textAlign: "center",
  },
  button: {
    flexDirection: "row", // Arrange children horizontally
    alignItems: "center", // Center vertically
    justifyContent: "space-between",
    backgroundColor: "#5885AF", // Background color of the button
    alignItems: "center",
    width: 300,
    height: 50,
    padding: 10,
    borderRadius: 9, // You can adjust the border radius as needed
    marginBottom: 10,
  },
  text: {
    marginLeft: 20,
    color: "black", // Text color
    fontSize: 16, // Font size of the text
  },
  icon: {
    right: "20",
    fontSize: 25,
    color: "#707172",
  },
});
