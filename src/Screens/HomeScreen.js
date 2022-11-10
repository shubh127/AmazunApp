import {
  Box,
  FlatList,
  Flex,
  HStack,
  Heading,
  Image,
  Pressable,
  Text,
  Input,
  View,
} from "native-base";
import React, { useEffect, useState } from "react";
import Colors from "../color";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue } from 'firebase/database';
import { StyleSheet } from 'react-native';

function HomeScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [query, setQuery] = useState([]);

  const getProductsFromDB = () => {
    const db = getDatabase();
    const reference = ref(db, "products/");
    onValue(reference, (snapshot) => {
      const temp = [];
      snapshot.forEach(function (childSnapshot) {
        temp.push(childSnapshot.val());
      });
      setProducts(temp);
      setAllProducts(temp);
    });
  }

  const onSearchTextChanged = (text) => {
    const temp = [];
    setQuery(text);
    allProducts.forEach(function (childSnapshot) {
      if (childSnapshot.category.includes(text)) {
        temp.push(childSnapshot);
      }
    });
    setProducts(temp);
  }

  useEffect(() => {
    getProductsFromDB();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("Single", item)}
      key={item.pId}
      w="180"
      marginRight={4}
      bg={Colors.white}
      rounded="md"
      shadow={2}
      pt={0.3}
      my={3}
      pb={2}
      overflow="hidden"
    >
      <Image
        source={{ uri: item.imageURL }}
        alt={item.name}
        w="full"
        h={24}
        resizeMode="contain"
      />
      <Box px={4} pt={1}>
        <Heading size="sm" bold>
          ${item.price}
        </Heading>
        <Text fontSize={10} mt={1} isTruncated w="full">
          {item.name}
        </Text>
      </Box>
    </Pressable>
  );

  return (
    <View>
      <HStack
        space={3}
        w="full"
        px={6}
        bg={Colors.main}
        py={4}
        alignItems="center"
        safeAreaTop
      >
        <Input
          value={query}
          onChangeText={text => onSearchTextChanged(text)}
          placeholder="Enter category name to find products"
          w="100%"
          bg={Colors.white}
          type="search"
          variant="filled"
          h={12}
          borderWidth={0}
          _focus={{
            bg: Colors.white,
          }}
        />
      </HStack>
      <Flex
        flexWrap="wrap"
        direction="row"
        justifyContent="space-between"
        px={6}
      >
        <View>
          {( products != null && products.length > 0 ?
              <FlatList
                contentContainerStyle={{ alignSelf: 'flex-start' }}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.pId}
              ></FlatList>
              :
              <Text style={styles.text}>No products exists matching your searched criteria!!! </Text>)}
        </View>
      </Flex>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
      margin: 20,
      fontSize: 13,
      fontWeight: "bold",
  },
});
