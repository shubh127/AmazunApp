import { Box, Text } from "native-base";
import Colors from "../color";
import { StyleSheet, View } from 'react-native';
import Buttone from "../Components/Buttone";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, set, remove, update } from 'firebase/database';
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";

function PlaceOrderScreen({ route }) {
  const { products } = route.params;
  const navigation = useNavigation();
  const [isDone, setIsDone] = useState(0);

  const saveOrderToDB = () => {

    const id = Date.now();
    const db = getDatabase();
    const reference = ref(db, "orders/" + id);
    set(reference, { oId: id, placedBy: getAuth().currentUser?.email, order: products, status: "Placed" })
      .then(() => emptyCart(db))
      .catch(error => { alert(error.message) })
  }

  const emptyCart = (db) => {
    products.forEach(element => {
      remove(ref(db, "cart/" + element.cId))
        .then(() => updateStockCount(db))
        .catch(error => { alert(error.message) })
    });
  }

  const updateStockCount = (db) => {
    products.forEach(element => {
      const amount = element.product.quantity - element.quantity
      update(ref(db, "products/" + element.product.pId), { quantity: amount })
        .then(() => setIsDone(1))
        .catch(error => { alert(error.message) })
    });
  }


  useEffect(() => {
    saveOrderToDB();
  }, []);


  return (
    <View flex={1}>
      {(isDone === 1 ?
        <Box bg={Colors.subGreen} flex={1} safeArea pt={6} justifyContent='center'
          alignItems='center' padding="10">
          <Text style={styles.text}>Order has been placed successfully!!!</Text>
          <Buttone
            onPress={() => navigation.navigate("Profile")}
            bg={Colors.black}
            color={Colors.white}
            mt={10}
          >Go to My orders
          </Buttone>
        </Box > :
        <Box bg={Colors.subGreen} flex={1} safeArea pt={6} justifyContent='center'
          alignItems='center' padding="10">
          <Text style={styles.text}>We are processing your order please be patient and remain on this screen!!!</Text>
        </Box>)}
    </View>
  );
}

export default PlaceOrderScreen;
const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});