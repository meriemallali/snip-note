import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../firebaseConfig/config.js";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { TextInput } from "react-native-paper";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
SplashScreen.preventAutoHideAsync();
const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securePasswordInput, setsecurePasswordInput] = useState(true);
 
  const changePasswordVisibility = () => {
    setsecurePasswordInput(!securePasswordInput);
  };

  let [LoadedFonts] = useFonts({
    IBMPlexSans: require("../assets/fonts/IBMPlexSans-MediumItalic.ttf"),
  });
  const onLayoutRootView = new useCallback(async () => {
    if (LoadedFonts) {
      await SplashScreen.hideAsync();
    }
  }, [LoadedFonts]);
  if (!LoadedFonts) return null;
  
  // log user with email & password
  loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('user logged in');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text style={styles.textLogin}>Log in</Text>
      <View style={{ marginTop: 10 }}>
        <TextInput
          label="Email"
          onChangeText={(input) => setEmail(input)}
          autoCorrect={false}
          left={<TextInput.Icon icon="email" />}
          theme={{
            colors: {
              primary: "#5885AF", // outline color
            },
          }}
          style={{
            width: 320,
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: "#D9D9D9",
          }}
        />
        <TextInput
          label="Password"
          onChangeText={(input) => setPassword(input)}
          secureTextEntry={securePasswordInput}
          theme={{
            colors: {
              primary: "#5885AF", //  outline color
            },
          }}
          style={{
            width: 320,
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: "#D9D9D9",
          }}
          left={<TextInput.Icon icon="book-lock" />}
          right={
            <TextInput.Icon
              name={securePasswordInput ? "eye-off" : "eye"}
              onPress={changePasswordVisibility}
            />
          }
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ForgotPassword");
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginLeft: 150,
            marginTop: 4,
            textDecorationLine: "underline",
          }}
        >
          Forgot password?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          loginUser(email, password);
        }}
        style={styles.loginButton}
      >
        <Text style={styles.textButton}>log in </Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 16, marginRight: 10, marginTop: 20 }}>
        Don't have an account?
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
        style={[styles.signUpButton]}
      >
        <Text style={[styles.textButton, { color: "white" }]}>sign up </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 4, //takes 3/4 of the screen
    flexDirection: "col",
    overflow: "visible",
    zIndex: 0,
    backgroundColor: "white",
    alignItems: "center",
    position: "absolute", //to respect the zIndex of its parent
    width: windowWidth,
    height: windowHeight,
    marginTop: 0,
  },
  textLogin: {
    fontFamily: "IBMPlexSans",
    textTransform: "capitalize",
    marginTop: "2%",
    marginRight: "60%",
    fontSize: 26,
  },
  inputContainer: {
    marginTop: 40,
  },
  buttonStyle: {
    flexDirection: "row",
    backgroundColor: "lightgrey",
    borderRadius: 50,
    marginBottom: 10,
    width: 350,
    height: 50,
    paddingTop: 20,
    paddingBottom: 10,
  },
  passwordButton: {
    backgroundColor: "lightgrey",
    borderRadius: 50,
    marginBottom: 10,
    width: 350,
    height: 50,
    paddingTop: 20,
    paddingBottom: 10,
  },
  textInput: {
    paddingVertical: 0,
    fontSize: 20,
    textAlign: "justify",
  },
  loginButton: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: "#5885AF",
    borderRadius: 50,
    marginBottom: 10,
    width: 350,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  signUpButton: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: "#7D92A6",
    borderRadius: 50,
    marginBottom: 10,
    width: 350,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  textButton: {
    fontSize: 22,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});
