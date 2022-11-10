import {
    Box,
    FlatList,
    Flex,
    Heading,
    Image,
    Pressable,
    Text,
} from "native-base";
import React, { useEffect, useState } from "react";
import Colors from "../../color";
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { Button } from 'react-native';

const MyProducts = () => {
    const [products, setProducts] = useState([]);

    const getProductsFromDB = () => {
        const db = getDatabase();
        const reference = ref(db, "products/");
        onValue(reference, (snapshot) => {
            const temp = [];
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().addedBy === getAuth().currentUser?.email) {
                    temp.push(childSnapshot.val());
                }
            });
            setProducts(temp);
        });
    }

    const removeFromDB = (pId) => {
        const db = getDatabase();
        remove(ref(db, "products/" + pId));
        alert("Item removed");
        getProductsFromDB();
    }

    useEffect(() => {
        getProductsFromDB()
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
                    InStock- {item.quantity}
                </Heading>
                <Text fontSize={10} mt={1} isTruncated w="full">
                    {item.name}
                </Text>

                <Button
                    onPress={() => removeFromDB(item.pId)}
                    title="Remove"
                    color="red"
                />
            </Box>
        </Pressable>
    );

    return (
        <Flex
            flexWrap="wrap"
            direction="row"
            justifyContent="space-between"
            px={6}
        >
            <FlatList
                contentContainerStyle={{ alignSelf: 'flex-start' }}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.pId}
            ></FlatList>
        </Flex>
    );
};

export default MyProducts;

