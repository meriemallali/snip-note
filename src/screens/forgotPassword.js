import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { firebase } from "../firebaseConfig/config.js";

function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    try {
      // send reset email password.
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert("Check your inbox, The password reset email has been sent");
    } catch (error) {
      Alert.alert("Error sending password reset email. Please try again.");
    }
  };

  return (
    <View>
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
          marginTop: 100,
          margin: 20,
          marginBottom: 10,
          backgroundColor: "#D9D9D9",
        }}
      />

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={handleResetPassword}
          style={styles.buttonReset}
        >
          <Button
            icon="lock-reset"
            mode="outlined"
            color="red"
            style={{ borderColor: "#5885AF" }}
          >
            <Text style={styles.textButton}>Reset Password </Text>
          </Button>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 40,
  },
  buttonStyle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 6,
    marginLeft: 20,
    marginBottom: 10,
    width: 350,
    height: 55,
    paddingTop: 20,
    paddingBottom: 10,
  },
  textInput: {
    marginLeft: 30,
    paddingVertical: 0,
    fontSize: 18,
    textAlign: "justify",
  },
  buttonReset: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});

export default ForgotPasswordScreen;
