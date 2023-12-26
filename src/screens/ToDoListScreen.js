import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Avatar,
  Card,
  Divider,
  Text,
  TextInput,
  Checkbox,
} from "react-native-paper";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { firebase } from "../firebaseConfig/config.js";

const ToDoListScreen = () => {
  const user = firebase.auth().currentUser;
  const [tasks, setTasks] = useState([]);
  const [selectedTodoList, setselectedTodoList] = useState();
  const [isToDoListModalVisible, setisToDoListModalVisible] = useState(false);
  const [isCreateListModalVisible, setIsCreateListModalVisible] =
    useState(false);
  const [isCreateTodoModalVisible, setIsCreateTodoModalVisible] =
    useState(false);
  const [todos, setTodos] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newToDoListDescription, setnewToDoListDescription] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const [listTodos, setlistTodos] = useState([]);
  const taskRef = firebase.firestore().collection("tasks");

  // in each doc inside the collection tasks contains:name,description and a doc todos
  // each doc in todos contains: todo content, completed.
  useEffect(() => {
    // get the tasks, filter by the user uid.
    taskRef.where("user_id", "==", user.uid).onSnapshot((snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // open the list modal => show details.
  const openToDoListModal = (task) => {
    taskRef
      .doc(task.id)
      .collection("todos")
      .onSnapshot((data) => {
        setlistTodos(
          data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
    setselectedTodoList(task);
    setisToDoListModalVisible(true);
  };

  // close the list modal => hide details.
  const closeToDoListModal = () => {
    setselectedTodoList(null);
    setisToDoListModalVisible(false);
  };

  // open the modal to create a new to do list.
  const openCreateListModal = () => {
    setIsCreateListModalVisible(true);
  };
  // close the todolist modal if list is created or cancel is pressed.
  const closeCreateListModal = () => {
    setIsCreateListModalVisible(false);
  };

  // add todolist into firebase.
  const addNewList = () => {
    // Add the new list to Firestore and update the local state of lists.
    taskRef
      .add({
        user_id: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        name: newTaskName,
        description: newToDoListDescription,
      })
      .then(() => {
        setNewTaskName("");
        setnewToDoListDescription("");
        setIsCreateListModalVisible(false); // Close the modal after adding a task
      })
      .catch((error) => {
        console.error("Error adding task: ", error);
      });
  };

  // delete to do list
  const deleteList = () => {
    // Delete the task document from Firestore
    console.log(selectedTodoList.id);
    taskRef
      .doc(selectedTodoList.id)
      .delete()
      .then(() => {
        setselectedTodoList(null);
        setisToDoListModalVisible(false);
      })
      .catch((error) => {
        console.error("Error deleting task: ", error);
      });
  };
  // add todo in selected todo list.
  const addNewTodo = () => {
    if (newTodo.trim() !== "") {
      // Add the new todo to the todos doc in Firestore
      taskRef
        .doc(selectedTodoList.id)
        .collection("todos")
        .add({
          content: newTodo,
          completed: false, //false as default.
        })
        .then(() => {
          // Todo added
          // update local state of todos and clearing the input field
          setTodos([...listTodos, { text: newTodo, completed: false }]);
          setNewTodo(" ");
        })
        .catch((error) => {
          console.error("Error adding todo: ", error);
        });
    }
  };

  // delete the todo from 'todos' collection referencing with the selected todolist in 'tasks' collection.
  const deleteTodo = (selectedTodoList, todoIndex) => {
    taskRef
      .doc(selectedTodoList.id)
      .collection("todos")
      .doc(todoIndex.id)
      .delete()
      .then(() => {
        // update the todos list.
        const updatedTodos = [...listTodos].filter(
          (todo) => todo.id !== todoIndex.id
        );
        setlistTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Error deleting todo: ", error);
      });
  };

  // change the status of todo.
  const toggleTodo = (selectedTodoList, item) => {
    changedcompleted = item.completed;
    // update 'completed' field status in todos collection.
    taskRef
      .doc(selectedTodoList.id)
      .collection("todos")
      .doc(item.id)
      .update({
        completed: !changedcompleted,
      })
      .then(() => {
        const updatedTodos = [...listTodos];
        updatedTodos.map((todo) => {
          // if selected todo id matches with one in the list => update completed.
          if (item.id == todo.id) {
            todo.completed = !changedcompleted;
          }
        });
        setlistTodos(updatedTodos);
      });
  };

  // display the user's todo lists.
  const toDoLists = () => (
    <View style={styles.tasklistContainer}>
      {/* reverse the todo list so the last one added will appear first. */}
      {tasks.reverse().map((task) => (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => openToDoListModal(task)}
          key = {task.id}
        >
          <Card
            containerStyle={{
              margin: 10,
              height: 100,
              justifyContent: "center",
            }}
            style={{ margin: 10, height: 100 }}
          >
            <Card.Content>
              <Text style={styles.taskTitle}>{task.name}</Text>
              <Divider style={{ backgroundColor: "#5885AF", height: 1 }} />
              <Text style={styles.taskDescription}>{task.description} </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <>
      <View style={{ flex: 1, marginTop: 10, margin: 10 }}>
        <Card style={{ margin: 10, height: 100 }}>
          <Card.Title
            title="Create new task list"
            right={(props) => (
              <TouchableOpacity onPress={openCreateListModal}>
                <Avatar.Icon
                  {...props}
                  icon="note-plus"
                  size={44}
                  color="white"
                  style={{ backgroundColor: "#5885AF" }}
                />
              </TouchableOpacity>
            )}
            rightStyle={{ color: "#f00", marginRight: 10 }}
            style={{ margin: 20, marginBottom: 40 }}
          />
        </Card>
        {/* to do lists */}
        <ScrollView>
          <View style={styles.tasklistContainer}>{toDoLists()}</View>
        </ScrollView>
      </View>
      {/* View to do list details modal */}
      <Modal
        visible={isToDoListModalVisible}
        animationType="slide"
        onDismiss={() => {
          setisToDoListModalVisible(false);
        }}
        contentContainerStyle={{
          backgroundColor: "white",
          position: "absolute",
          borderRadius: 6,
          padding: 20,
          marginLeft: 20,
          height: "auto",
          width: 350,
          marginTop: -100,
        }}
      >
        {/* Task Details */}
        <View style={{ marginTop: 80 }}>
          {selectedTodoList && (
            <View>
              <View>
                <TouchableOpacity
                  onPress={()=>deleteList}
                  style={[
                    {
                      position: "relative",
                      margin: 10,
                      left: 250,
                      top: -100,
                      backgroundColor: "#DDDBDB",
                      width: 60,
                      height: 60,
                      borderRadius: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <AntDesign
                    name="delete"
                    size={30}
                    color="#5885AF"
                    style={{ alignItems: "center" }}
                  />
                </TouchableOpacity>
                <View>
                  <Text style={[styles.modalHeader, { top: -150 }]}>
                    To do list:
                  </Text>
                </View>
              </View>
              <Divider
                style={{ marginBottom: 20, top: -140, position: "relative" }}
              />
              <Text
                style={[styles.taskName, { top: -150, position: "relative" }]}
              >
                Name: {selectedTodoList.name}
              </Text>
              <View
                style={{
                  top: -140,
                  borderRadius: 8,
                  position: "relative",
                  borderWidth: 1,
                  borderColor: "#5885AF",
                }}
              >
                <Text style={styles.taskDescription}>
                  Description: {selectedTodoList.description}
                </Text>
              </View>
              <View
                style={{
                  top: -100,
                  borderWidth: 1,
                  borderColor: "#5885AF",
                  borderRadius: 4,
                  height: "auto",
                  width: "100%",
                }}
              >
                <FlatList
                  style={{
                    margin: 15,
                  }}
                  data={listTodos}
                  // keyExtractor={(item, index) => item.id.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.todoItem}>
                      <Checkbox
                        value={item?.completed}
                        status={item?.completed ? "checked" : "unchecked"}
                        onPress={() => {
                          toggleTodo(selectedTodoList, item);
                        }}
                      />
                      <Text
                        style={[
                          styles.todoText,
                          {
                            textDecorationLine: item?.completed
                              ? "line-through"
                              : "none",
                          },
                        ]}
                      >
                        {item?.content}
                      </Text>
                      <TouchableOpacity
                        onPress={() => deleteTodo(selectedTodoList, item)}
                      >
                        <AntDesign name="minus" size={30} color="#AE1E1E" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>

              {/* Add a button to open a modal for adding new todos */}
              <View
                style={{
                  marginBottom: 20,
                  width: 150,
                  bottom: 0,
                  position: "absolute",
                }}
              >
                <Button
                  mode="contained"
                  buttonColor="#5885AF"
                  onPress={() => setIsCreateTodoModalVisible(true)}
                >
                  Add Todo
                </Button>
              </View>
            </View>
          )}
          <View
            style={{
              marginBottom: 20,
              marginTop: -60,
              width: 150,
              left: 160,
              bottom: 0,
              position: "absolute",
            }}
          >
            <Button
              mode="contained"
              buttonColor="#A7ABAF"
              onPress={closeToDoListModal}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      {/* add new todo to todolist  */}
      <Modal
        visible={isCreateTodoModalVisible}
        onDismiss={() => setIsCreateTodoModalVisible(false)}
        animationType="slide"
        contentContainerStyle={{
          backgroundColor: "white",
          borderRadius: 6,
          padding: 20,
          marginLeft: 20,
          height: "auto",
          width: 350,
          marginTop: -100,
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Todo</Text>
          <TextInput
            mode="outlined"
            label="To do"
            style={styles.input}
            theme={{
              colors: {
                primary: "#5885AF",
                text: "#5885AF",
              },
            }}
            onChangeText={(text) => setNewTodo(text)}
          />

          <Button
            style={{ bottom: 0, right: 150, position: "absolute" }}
            textColor="#5885AF"
            icon="format-list-checks"
            mode="outlined"
            onPress={addNewTodo}
          >
            {" "}
            Add to list{" "}
          </Button>
          <Button
            style={{ bottom: 0, left: 80, position: "relative" }}
            textColor="#5885AF"
            icon={() => (
              <Ionicons name="arrow-undo-sharp" size={20} color="#5885AF" />
            )}
            mode="outlined"
            onPress={() => setIsCreateTodoModalVisible(false)}
          >
            {" "}
            Back{" "}
          </Button>
        </View>
      </Modal>

      {/* add a new todolist */}
      <Modal
        visible={isCreateListModalVisible}
        animationType="slide"
        onDismiss={closeCreateListModal}
        contentContainerStyle={{
          backgroundColor: "white",
          borderRadius: 6,
          marginLeft: 20,
          height: 400,
          width: 350,
          marginTop: -100,
        }}
      >
        <View style={[styles.modalContainer]}>
          <Text style={[styles.modalHeader, { marginTop: 0 }]}>
            Create a New List
          </Text>
          <Divider
            style={{ backgroundColor: "red", height: 1, marginTop: 0 }}
          />

          <TextInput
            mode="outlined"
            label="List Name"
            style={styles.input}
            value={newTaskName}
            theme={{
              colors: {
                primary: "#5885AF",
                text: "#5885AF",
              },
            }}
            onChangeText={(text) => setNewTaskName(text)}
          />
          <TextInput
            mode="outlined"
            label="List Description"
            style={styles.input}
            theme={{
              colors: {
                primary: "#5885AF",
                text: "#5885AF",
              },
            }}
            value={newToDoListDescription}
            onChangeText={(text) => setnewToDoListDescription(text)}
          />

          <Button
            style={{ bottom: 0, left: 40, position: "absolute" }}
            textColor="#5885AF"
            icon={() => (
              <Ionicons name="create-outline" size={20} color="#5885AF" />
            )}
            mode="outlined"
            onPress={addNewList}
          >
            {" "}
            Create{" "}
          </Button>
          <Button
            style={{ bottom: 0, left: 70, position: "relative" }}
            textColor="#5885AF"
            icon={() => (
              <Ionicons name="arrow-undo-sharp" size={20} color="#5885AF" />
            )}
            mode="outlined"
            onPress={closeCreateListModal}
          >
            {" "}
            Cancel{" "}
          </Button>
        </View>
      </Modal>
      {/* </View> */}
    </>
  );
};

export default ToDoListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  taskName: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  taskTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#5885AF",
    fontStyle: "italic",
  },
  taskDescription: {
    margin: 10,
    fontSize: 14,
    fontWeight: "400",
  },
  modalTitle: {
    fontSize: 24,
    color: "#5885AF",
    marginBottom: 20,
  },
  input: {
    marginBottom: 30,
    padding: 8,
    marginVertical: 10,
    width: 300,
    height: 40,
  },
  tasklistContainer: {
    flex: 1,
  },
  modalHeader: {
    fontSize: 25,
    marginBottom: 20,
    fontWeight: "500",
    color: "#5885AF",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  todoText: {
    flex: 1,
    fontSize: 18,
  },
});
