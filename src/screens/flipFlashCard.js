import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const FlipCard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // handle the flip state
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flipCard} style={styles.card}>
        {/* if flipped show the back => content, if not show the front => header*/}
        {isFlipped ? (
          <Text style={styles.cardText}>{card.content}</Text>
        ) : (
          <Text style={styles.cardText}>{card.header}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 10 },
  card: {
    width: 200,
    height: 120,
    maxHeight: "auto",
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1 / 2,
    borderColor: "#5885AF",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FlipCard;
