// Reusable header contains the drawer navigation.
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons,MaterialCommunityIcons  } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CustomHeader = (props) => {
  const navigation = useNavigation();
  const openDrawerHandler = () => {
    navigation.openDrawer(); // Open the drawer
  };

  return (
    <View style={styles.headerContainer}>
      
      <TouchableOpacity onPress={openDrawerHandler}>
        <MaterialCommunityIcons name="menu" size={40} style={styles.iconStyle} />
      </TouchableOpacity>
      <Text style={styles.headerText}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: windowWidth,
    height: windowHeight * 0.1, //header will take 10% of the screen height
    backgroundColor: "#5885AF",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center"

  },
  headerText: {
    marginLeft: 10,
    marginTop: 20,
    color: "white",
    fontSize: 22,
    fontStyle: "italic",
    fontWeight: 'bold'
  },
  iconStyle: {
    color: "white",
    paddingTop:"30%" ,
    marginLeft: "8%", // right margin for spacing 
  },
});

export default CustomHeader;
