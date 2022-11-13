import {
  FlatList,
  HStack,
  Text,
  View,
  Button
} from "native-base";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from "firebase/auth";
import Colors from "../../color";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const getOrdersFromDB = () => {
    const db = getDatabase();
    const reference = ref(db, "orders/");
    onValue(reference, (snapshot) => {
      const temp = [];
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().placedBy === getAuth().currentUser?.email) {
          temp.push(childSnapshot.val());
        }
      });
      setOrders(temp);
    });
  }

  useEffect(() => {
    getOrdersFromDB()
  }, []);

  const renderItem = ({ item }) => (
    <HStack
      marginX="2"
      mt="4"
      justifyContent="space-between"
      alignItems="center"
      borderColor={Colors.lightBlack}
      borderWidth="1"
      borderRadius="4"
      bg={Colors.deepGray}
      py={5}
      px={2}
    >
      <Text fontSize={10} color={Colors.blue} isTruncated>
        {item.oId}
      </Text>
      <Text fontSize={12} bold color={Colors.black} isTruncated>
        {item.status}
      </Text>
      <Text fontSize={11} italic color={Colors.black} isTruncated>
        {new Date(item.oId).toLocaleDateString()}
      </Text>
      <Button
        px={7}
        py={1.5}
        rounded={50}
        bg={Colors.main}
        _text={{
          color: Colors.white,
        }}
        _pressed={{
          bg: Colors.main,
        }}
      >{"$ " + item.order[0].amount}
      </Button>
    </HStack>
  );

  return (
    <View height="100%" backgroundColor={Colors.white}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.oId}
      ></FlatList>
    </View>
  );
};

export default Orders;
