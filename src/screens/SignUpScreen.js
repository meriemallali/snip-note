import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { firebase } from "../firebaseConfig/config.js";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // create new user doc and save it to collection users.
  // then send email verification.
  SignupUser = async (email, password, username) => {
    try {
      const credential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      await firebase
        .firestore()
        .collection("users")
        .doc(credential.user.uid)
        .set({ username, email });
      await credential.user.sendEmailVerification();
      Alert.alert("Verification email has been sent, check your inbox. ");
      console.log(`user ${username} registered successfully!`);
    } catch (error) {
      alert(error.message);
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/imgs/registration_background.png")}
        style={styles.headerImage}
      />

      <Text style={styles.textLogin}>Create your account </Text>
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
        label="Username"
        onChangeText={(input) => setUsername(input)}
        left={<TextInput.Icon icon="at" />}
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
        secureTextEntry
        theme={{
          colors: {
            primary: "#5885AF", // Change the outline color
          },
        }}
        style={{
          width: 320,
          marginTop: 10,
          marginBottom: 10,
          backgroundColor: "#D9D9D9",
        }}
        left={<TextInput.Icon icon="book-lock" />}
      />
      <TouchableOpacity
        onPress={() => {
          SignupUser(email, password, username);
        }}
        style={[styles.signUpButton]}
      >
        <Text style={styles.textButton}>Sign up </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 20,
  },

  container: {
    flex: 3, //takes 3/4 of the screen
    flexDirection: "col",
    overflow: "visible",
    zIndex: 20,
    elevation: 25,
    backgroundColor: "white",
    alignItems: "center",
    position: "absolute", //to respect the zIndex of its parent
    width: windowWidth,
    height: windowHeight,
  },
  headerImage: {
    marginTop: 0,
    position: "relative",
    width: "100%",
    height: Dimensions.get("window").height * 0.3,
  },
  bgImage: {
    flex: 1,
    zIndex: 0,
    resizeMode: "stretch", // Set the image mode to cover the container
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  textLogin: {
    fontStyle: "italic",
    marginTop: 0,
    marginRight: "30%",
    fontSize: 25,
  },
  inputContainer: {
    marginTop: 20,
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
    marginTop: 50,
    flexDirection: "row",
    backgroundColor: "#AB8C8C",
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
    backgroundColor: "#5885AF",
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
  },
});
export default SignUpScreen;
