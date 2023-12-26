import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Keyboard,
} from "react-native";
import { firebase } from "../firebaseConfig/config.js";
import { Card, Divider } from "@rneui/themed";
import {
  AntDesign,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Modal, TextInput } from "react-native-paper";

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditNoteModalVisible, setisEditNoteModalVisible] = useState(false);
  const [editNote, setEditedNote] = useState({ title: "", noteContent: "" });
  const [title, setTitle] = useState("");
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [noteContent, setnoteContent] = useState("");
  const user = firebase.auth().currentUser;

  // save new notes to firestore => collection : notes.
  // each note is referenced by the user uid.
  const addnewNote = async () => {
    firebase
      .firestore()
      .collection("notes")
      .add({
        user_id: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        title,
        noteContent,
      })
      .then(() => {
        setTitle("");
        setnoteContent("");
        Keyboard.dismiss();
      })
      .catch((error) => {
        alert(error);
      });
    setIsNoteModalVisible(false);
  };

  // helper function to open the edit modal
  const openEditNoteModal = (note) => {
    setSelectedNote(note);
    setEditedNote({ title: note.title, noteContent: note.noteContent });
    setisEditNoteModalVisible(true);
  };
  // save edited notes from firestore.
  const saveEditedNote = async () => {
    try {
      // get the notes collection from firestore.
      const notesCollection = firebase.firestore().collection("notes");

      // Update the edited note doc by using the note.id in firestore.
      await notesCollection.doc(selectedNote.id).update({
        title: editNote.title,
        noteContent: editNote.noteContent,
      });

      // Update the local state with the edited note
      setNotes((previousNote) =>
        previousNote.map((note) =>
          note.id === selectedNote.id ? { ...note, ...editNote } : note
        )
      );

      // Close the edit modal
      setisEditNoteModalVisible(false);
    } catch (error) {
      console.error("Error updating note:", error.message);
    }
  };

  // delete selected note from firestore.
  const deleteNote = async (noteId) => {
    try {
      // get the notes collection from firestore.
      const notesCollection = firebase.firestore().collection("notes");

      // delete selected note by noteid from firestore.
      await notesCollection.doc(noteId).delete();

      // update the state by removing the deleted note
      setNotes((previousNote) =>
        previousNote.filter((note) => note.id !== noteId)
      );
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  };
  // fetch all notes from firestore.
  // filter by the logged in user's uid.
  useEffect(() => {
    firebase
      .firestore()
      .collection("notes")
      .where("user_id", "==", user.uid)
      .orderBy("createdAt")
      .onSnapshot((query) => {
        const newNotes = [];
        query.forEach((doc) => {
          const { title, noteContent } = doc.data();
          newNotes.push({ noteContent, title, id: doc.id });
        });
        setNotes(newNotes);
      });
  }, []);
  // to list all the notes as cards.
  const noteslist = () => (
    <View style={styles.noteContainer}>
      {/* reverse the notes list so the last note added will appear first. */}
      {notes.reverse().map((note) => (
        <Card key={note.id} containerStyle={styles.notesList}>
          <View>
            {/* Edit note button */}
            <TouchableOpacity
              style={{ marginRight: 210 }}
              onPress={() => openEditNoteModal(note)}
            >
              <Feather name="edit" size={19} color="#5885AF" />
            </TouchableOpacity>
            {/* Delete note button */}
            <TouchableOpacity
              style={{ marginLeft: 210, marginTop: -18 }}
              onPress={() => deleteNote(note.id)}
            >
              <Feather name="delete" size={19} color="#5885AF" />
            </TouchableOpacity>
            <Card.Title>
              <Text> {note.title}</Text>
            </Card.Title>
            <Card.Divider color="#5885AF" width={1} />
            <Text>{note.noteContent}</Text>
          </View>
        </Card>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.noteContainer}>{noteslist()}</View>
      </ScrollView>
      {/* Edit selected note */}
      <Modal
        visible={isEditNoteModalVisible}
        onDismiss={() => {
          setisEditNoteModalVisible(false);
        }}
        animationType="slide"
        contentContainerStyle={{
          backgroundColor: "white",
          borderRadius: 6,
          padding: 20,
          marginLeft: 20,
          height: 500,
          width: 350,
          marginTop: -100,
        }}
      >
        <View>
          <Text style={styles.modalHeader}>
            Edit <MaterialIcons name="edit" size={18} color="black" />{" "}
          </Text>
          <Divider />
          <TextInput
            label="Title"
            mode="outlined"
            outlineColor="#5885AF"
            activeOutlineColor="#5885AF"
            value={editNote.title}
            onChangeText={(text) => setEditedNote({ ...editNote, title: text })}
            style={styles.inputTitle}
          />
            <TextInput
              mode="outlined"
              outlineColor="#5885AF"
              activeOutlineColor="#5885AF"
              label="Content"
              value={editNote.noteContent}
              onChangeText={(text) =>
                setEditedNote({ ...editNote, noteContent: text })
              }
              style={styles.inputnoteContent}
            />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <TouchableOpacity style={styles.button} onPress={saveEditedNote}>
              <Text style={styles.ButtonText}>
                {" "}
                Save{" "}
                <MaterialCommunityIcons
                  name="content-save-check"
                  size={18}
                  style={styles.addIconStyle}
                />{" "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setisEditNoteModalVisible(false)}
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

      {/* Add new note button */}
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
          zIndex: 20,
        }}
        onPress={() => setIsNoteModalVisible(true)}
      >
        <Ionicons
          name="add"
          size={40}
          color={"white"}
          style={{ alignSelf: "center" }}
          mode="elevated"
        />
      </TouchableOpacity>
      {/* Add new note modal */}
      <Modal
        visible={isNoteModalVisible}
        onDismiss={() => {
          setIsNoteModalVisible(false);
        }}
        animationType="slide"
        contentContainerStyle={{
          backgroundColor: "white",
          borderRadius: 6,
          padding: 20,
          marginLeft: 20,
          height: 500,
          width: 350,
          marginTop: -100,
        }}
      >
        <View>
          <Text style={styles.modalHeader}>Add new note </Text>
          <Divider />
          <TextInput
            mode="outlined"
            outlineColor="#5885AF"
            activeOutlineColor="#5885AF"
            label="Title"
            value={title}
            onChangeText={(input) => setTitle(input)}
            style={styles.inputTitle}
          />
          <TextInput
            mode="outlined"
            outlineColor="#5885AF"
            activeOutlineColor="#5885AF"
            label="Content"
            value={noteContent}
            onChangeText={(input) => setnoteContent(input)}
            style={styles.inputnoteContent}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <TouchableOpacity style={styles.button} onPress={addnewNote}>
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
              onPress={() => setIsNoteModalVisible(false)}
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

export default NotesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  noteContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
  },
  notesList: {
    borderRadius: 15,
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
  inputnoteContent: {
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
