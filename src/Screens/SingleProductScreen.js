import {
  Box,
  Heading,
  Image,
  ScrollView,
  HStack,
  View,
  Spacer,
  Text,
} from "native-base";
import React, { useState } from "react";
import Colors from "../color";
import NumericInput from "react-native-numeric-input";
import Buttone from "../Components/Buttone";
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

function SingleProductScreen({ route }) {
  const [value, setValue] = useState(0);
  const navigation = useNavigation();
  const product = route.params;

  const onAddToCart = () => {
    const db = getDatabase();
    const amount = product.price * value;
    const reference = ref(db, "cart/" + product.pId + "_" + getAuth().currentUser?.uid);
    set(reference, { cId: product.pId + "_" + getAuth().currentUser?.uid, owner: getAuth().currentUser?.email, product: product, amount: amount, quantity: value })
      .then(() => alert("Product Added to cart"))
      .catch(error => { alert(error.message) })
  }

  return (
    <Box safeArea flex={1} bg={Colors.white}>
      <ScrollView px={5} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.imageURL }}
          alt="https://res.cloudinary.com/zpune/image/upload/v1645429478/random/user_u3itjd.png"
          w="full"
          h={300}
          resizeMode="contain"
        />
        <Heading bold fontSize={15} mb={2} lineHeight={22}>
          {product.name}
        </Heading>
        <HStack space={2} alignItems="center" my={5}>
          {product.quantity > 0 ? (
            <NumericInput
              onChange={text => setValue(text)}
              value={value}
              totalWidth={140}
              totalHeight={30}
              iconSize={25}
              step={1}
              maxValue={parseInt(product.quantity)}
              minValue={0}
              borderColor={Colors.deepGray}
              rounded
              textColor={Colors.black}
              iconStyle={{ color: Colors.white }}
              rightButtonBackgroundColor={Colors.main}
              leftButtonBackgroundColor={Colors.main}
            />
          ) : (
            <Heading bold color={Colors.red} italic fontSize={12}>
              Out of stock
            </Heading>
          )}

          <Spacer />
          <Heading bold color={Colors.black} fontSize={19}>
            ${product.price}
          </Heading>
        </HStack>
        <Text lineHeight={24} fontSize={12}>
          {product.desc}
        </Text>
        <View>{
          (value > 0 ? <Buttone
            onPress={() => onAddToCart()}
            bg={Colors.main}
            color={Colors.white}
            mt={10}
          >
            ADD TO CART
          </Buttone> : <View></View>)}
        </View>
      </ScrollView>
    </Box>
  );
}

export default SingleProductScreen;
