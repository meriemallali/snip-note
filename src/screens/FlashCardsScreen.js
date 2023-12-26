import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  AntDesign,
  Ionicons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { Divider } from "@rneui/themed";

import { Modal, TextInput } from "react-native-paper";

import { firebase } from "../firebaseConfig/config.js";
import FlipCard from "../screens/flipFlashCard.js";

const FlashCardsScreen = () => {
  const [cards, setCards] = useState([]);
  const [newCardContent, setNewCardContent] = useState("");
  const [newCardHeader, setnewCardHeader] = useState("");
  const user = firebase.auth().currentUser;
  const [isFlashCardModalVisible, setisFlashCardModalVisible] = useState(false);

  // fetch user's flash cards.
  const fetchCards = async () => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("flashcards")
        .where("user_id", "==", user.uid)
        .get();
      const cardData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(cardData);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // add a flash card.
  const addCard = async () => {
    try {
      await firebase.firestore().collection("flashcards").add({
        user_id: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        content: newCardContent,
        header: newCardHeader,
      });

      // Clear input fields
      setNewCardContent("");
      setnewCardHeader("");
      // Refresh card list
      fetchCards();
      setisFlashCardModalVisible(false);
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  // remove a flash card and refresh card list.
  const removeCard = (item) => {
    try {
      firebase
        .firestore()
        .collection("flashcards")
        .doc(item.id)
        .delete()
        .then(() => {
          // Refresh card list
          fetchCards();
        });

      fetchCards();
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cards.reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ScrollView style={styles.ScrollView}>
            <FlipCard card={item} />
            {/* Remove card icon. */}
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                top: -100,
                left: 220,
                backgroundColor: "transparent",
                borderRadius: 20,
                alignContent: "center",
                justifyContent: "center",
              }}
              mode="contained"
              onPress={() => removeCard(item)}
            >
              <Feather name="delete" size={34} color="#5885AF" />
            </TouchableOpacity>
          </ScrollView>
        )}
      />
      {/* View add card modal */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 16, // the distance from bottom of the screen
          right: 8,
          backgroundColor: "#5885AF",
          alignItems: "center",
          justifyContent: "center",
          zIndex: -100,
          marginRight: 10,
          marginVertical: 10,
          marginLeft: "auto",
          zIndex: 20,
          width: 60,
          height: 60,
          borderRadius: 60,
        }}
        onPress={() => setisFlashCardModalVisible(true)}
      >
        <Ionicons
          name="add"
          size={40}
          color={"white"}
          style={{ alignSelf: "center" }}
          mode="elevated"
        />
      </TouchableOpacity>

      {/* Add new card modal */}
      <Modal
        visible={isFlashCardModalVisible}
        onDismiss={() => {
          setisFlashCardModalVisible(false);
        }}
        animationType="slide"
        contentContainerStyle={{
          margin:10,
          backgroundColor: "white",
          borderRadius: 6,
          padding: 20,
          height: 500,
          width: 350,
          marginTop: -100,
        }}
      >
        <View>
          <Text style={styles.modalHeader}>Add new flash card </Text>
          <Divider />
          <TextInput
            label="Front"
            value={newCardHeader}
            mode="outlined"
            outlineColor="#5885AF"
            activeOutlineColor="#5885AF"
            onChangeText={(input) => setnewCardHeader(input)}
            style={styles.inputTitle}
          />
          <TextInput
            mode="outlined"
            outlineColor="#5885AF"
            activeOutlineColor="#5885AF"
            label="Back"
            value={newCardContent}
            onChangeText={(input) => setNewCardContent(input)}
            style={styles.inputCardContent}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <TouchableOpacity style={styles.button} onPress={addCard}>
              <Text style={styles.ButtonText}>
                {" "}
                Add{" "}
                <AntDesign
                  name="addfile"
                  size={18}
                  style={styles.addIconStyle}
                />{" "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setisFlashCardModalVisible(false)}
            >
              <Text style={styles.ButtonText}>
                {" "}
                Cancel{" "}
                <MaterialIcons
                  name="cancel-presentation"
                  size={18}
                  style={styles.addIconStyle}
                />{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FlashCardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  ScrollView: {
    padding: 5,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    color: "black",
    height: 30,
    width: "92%",
    padding: 10,
  },
  inputCardContent: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    color: "black",
    width: "92%",
    height: 100,
    padding: 10,
  },
  button: {
    justifyContent: "space-between",
    marginTop: 40,
    width: 130,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    borderColor: "#5885AF",
  },
  ButtonText: {
    fontSize: 20,
    textAlign: "center",
    color: "#5885AF",
  },
  addIconStyle: {
    color: "#5885AF",
    marginTop: 100,
  },
  modalHeader: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "500",
    color: "#5885AF",
  },
});
