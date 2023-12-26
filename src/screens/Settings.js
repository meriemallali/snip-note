import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { firebase } from "../firebaseConfig/config.js";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Text,
  TextInput,
} from "react-native-paper";

const SettingsScreen = () => {
  const user = firebase.auth().currentUser;
  const [newName, setNewName] = useState("");
  const [newUsername, setnewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [updateprofile, setupdateprofile] = useState(false);
  const [userData, setUserData] = useState([]);
  const [email, setEmail] = useState("");

  // get the user document data from firebase collection 'users'.
  const userRef = firebase.firestore().collection("users").doc(user.uid);
  userRef.get().then((doc) => {
    if (doc.exists) {
      // Get the user data from the user's document
      setUserData(doc.data());
    }
  });
  const updateUserData = async () => {
    try {
      // Ensure the user is signed in
      if (user) {
        // Reference to Firestore user collection
        const userCollection = firebase.firestore().collection("users");

        // });
        // Update the user's name
        await user.updateProfile({
          displayName: newName,
          username: newUsername,
          email: newEmail,
        });

        // Update the user's name in Firestore
        await userCollection.doc(user.uid).update({
          name: newName,
          username: newUsername,
          email: newEmail,
        });

        setupdateprofile(true);
        Alert.alert("Your profile is updated successfully ");
      } else {
        console.error("User not authenticated.");
      }
    } catch (error) {
      console.error("Error updating user name:", error.message);
    }
  };
  const handleResetPassword = async () => {
    try {
      // send email
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert("Check your inbox, The password reset email has been sent");
    } catch (error) {
      Alert.alert("Error sending password reset email. Please try again.");
    }
  };
  return (
    <View style={styles.container}>
      <Card style={styles.cardStyle}>
        <Card.Title
          title="Settings"
          subtitle="Update the settings"
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon="table-settings"
              size={44}
              color="white"
              style={{ backgroundColor: "#5885AF" }}
            />
          )}
          leftStyle={{ color: "#f00" }}
          style={{ margin: 10, marginBottom: 40 }}
        />
      </Card>
      <ScrollView
        alwaysBounceVertical={true}
        automaticallyAdjustContentInsets={true}
      >
        {/* profile settings card */}
        <Card style={{ margin: 10 }}>
          <Card.Title
            title="Profile Settings"
            subtitle="Update your profile"
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="account-edit"
                size={44}
                color="white"
                style={{ backgroundColor: "#5885AF" }}
              />
            )}
            leftStyle={{ color: "#f00" }}
            style={{ margin: 10, marginBottom: 40 }}
          />
          <Divider style={{ marginTop: -35, marginBottom: 40 }} />
          <Card.Content style={{ marginBottom: 30 }}>
            <TextInput
              label="name"
              placeholder={user.displayName}
              value={newName}
              theme={{
                colors: {
                  primary: "#5885AF", // outline color
                },
              }}
              style={{
                height: 60,
                marginBottom: 10,
                backgroundColor: "#D9D9D9",
              }}
              onChangeText={(text) => setNewName(text)}
            />
            <TextInput
              label="username"
              placeholder={userData.username}
              value={newUsername}
              theme={{
                colors: {
                  primary: "#5885AF", // outline color
                },
              }}
              style={{
                height: 60,
                marginBottom: 10,
                backgroundColor: "#D9D9D9",
              }}
              onChangeText={(text) => setnewUsername(text)}
            />
            <TextInput
              label="email"
              placeholder={user.email}
              value={newEmail}
              onChangeText={(text) => setNewEmail(text)}
              theme={{
                colors: {
                  primary: "#5885AF", // outline color
                },
              }}
              style={{
                height: 60,
                marginBottom: 20,
                backgroundColor: "#D9D9D9",
              }}
            />
          </Card.Content>
          <Card.Actions style={{ marginRight: 10 }}>
            <Button
              onPress={updateUserData}
              style={{ borderColor: "#5885AF", height: 40, marginBottom: 10 }}
            >
              <Text style={{ color: "#5885AF", fontWeight: "bold" }}>
                Update
              </Text>
            </Button>
          </Card.Actions>
          {updateprofile}
        </Card>

        {/* Reset password card. */}
        <Card style={{ margin: 10 }}>
          <Card.Title
            title="Reset your password"
            subtitle="Enter your email "
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="trackpad-lock"
                size={44}
                color="white"
                style={{ backgroundColor: "#5885AF" }}
              />
            )}
            leftStyle={{ color: "#f00" }}
            style={{ margin: 10, marginBottom: 40 }}
          />
          <Divider style={{ marginTop: -35 }} />
          <TextInput
            label="Enter your email"
            visible={false}
            onChangeText={(input) => setEmail(input)}
            autoCorrect={false}
            left={<TextInput.Icon icon="email" />}
            theme={{
              colors: {
                primary: "#5885AF", // outline color
              },
            }}
            style={styles.input}
          />

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              onPress={handleResetPassword}
              style={{ marginBottom: 20 }}
            >
              <Button
                icon="lock-reset"
                mode="outlined"
                style={{ borderColor: "#5885AF" }}
              >
                <Text style={styles.textButton}>Reset Password </Text>
              </Button>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    margin: 10,
  },
  cardStyle: {
    margin: 10,
    height: 100,
    marginBottom: 20,
  },
  input:{
    margin: 20,
    height: 50,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: "#D9D9D9",
  }
});
