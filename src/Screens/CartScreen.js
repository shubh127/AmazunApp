import { useNavigation } from "@react-navigation/native";
import { Box, Button, Center, HStack, VStack, Text, FlatList, Pressable, Image, View } from "native-base";
import Colors from "../color";
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Buttone from "../Components/Buttone";
import { StyleSheet } from 'react-native';

function CartScreen() {
  const navigation = useNavigation();
  const [cartPoducts, setCartProducts] = useState([]);
  const [total, setTotal] = useState("$0");


  const getCartProducts = () => {
    const temp = [];
    var amount = 0;
    const db = getDatabase();
    const reference = ref(db, "cart/");
    onValue(reference, (snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().owner === getAuth().currentUser?.email) {
          temp.push(childSnapshot.val());
          amount += childSnapshot.val().amount;
        }
      });
      setCartProducts(temp);
      setTotal("$ " + amount);
    });
  }

  const removeFromCart = (cId) => {
    const db = getDatabase();
    remove(ref(db, "cart/" + cId));
    alert("Item removed from cart");
    getCartProducts();
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getCartProducts();
    });
  }, []);

  const renderItem = ({ item }) => (
    <Box ml={6} mb={3}>
      <HStack
        alignItems="center"
        bg={Colors.white}
        shadow={1}
        rounded={10}
        overflow="hidden"
      >
        <Center w="25%" bg={Colors.deepGray}>
          <Image
            source={{ uri: item.product.imageURL }}
            w="full"
            h={24}
            resizeMode="contain"
          />
        </Center>
        <VStack w="60%" px={2} space={2}>
          <Text isTruncated color={Colors.black} bold fontSize={10}>
            {item.product.name}
          </Text>
          <Text bold color={Colors.lightBlack}>
            ${item.product.price}
          </Text>
          <Pressable onPress={() => removeFromCart(item.cId)}>
            <Text color={Colors.red}>Remove from cart</Text>
          </Pressable>
        </VStack>
        <Center>
          <Button
            bg={Colors.main}
            _pressed={{ bg: Colors.main }}
            _text={{
              color: Colors.white,
            }}
          >
            {item.quantity}
          </Button>
        </Center>
      </HStack>
    </Box>
  );


  return (
    <Box flex={1} safeAreaTop bg={Colors.subGreen}>
      <Center w="full" py={5}>
        <Text color={Colors.black} fontSize={20} bold>
          Cart
        </Text>
      </Center>

      <View>{(cartPoducts != null && cartPoducts.length > 0 ?
        < FlatList
          data={cartPoducts}
          renderItem={renderItem}
          keyExtractor={item => item.cId}
        ></FlatList> : <Text style={styles.text}>No Products added to cart yet!!! </Text>)}
      </View>

      <View>{(cartPoducts != null && cartPoducts.length > 0 ? <Center mt={5}>
        <HStack
          rounded={50}
          justifyContent="space-between"
          bg={Colors.white}
          shadow={2}
          w="90%"
          pl={5}
          h={45}
          alignItems="center"
        >
          <Text>Total</Text>
          <Button
            px={10}
            h={45}
            rounded={50}
            bg={Colors.main}
            _text={{
              color: Colors.white,
              fontWeight: "semibold",
            }}
            _pressed={{
              bg: Colors.main,
            }}
          >
            {total}
          </Button>
        </HStack>
      </Center> : <View />)}
      </View>

      <View>{(cartPoducts != null && cartPoducts.length > 0 ? <Center px={5}>
        <Buttone
          onPress={() => navigation.navigate("Shipping", { products: cartPoducts })}
          bg={Colors.black}
          color={Colors.white}
          mt={10}
        >
          CHECKOUT
        </Buttone>
      </Center>
        : <View />)}
      </View>
    </Box >
  );
}

export default CartScreen;

const styles = StyleSheet.create({
  text: {
    margin: 20,
    fontSize: 13,
    fontWeight: "bold",
  },
});