import {
    Box,
    HStack,
    View,
    Input,
    Text,
    FlatList,
    Button,
} from "native-base";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from 'firebase/database';
import Colors from "../color";
import { StyleSheet } from 'react-native';

const BoughtProducts = () => {
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [query, setQuery] = useState([]);

    const getOrdersFromDB = () => {
        const db = getDatabase();
        const reference = ref(db, "orders/");
        onValue(reference, (snapshot) => {
            const temp = [];
            snapshot.forEach(function (childSnapshot) {
                temp.push(childSnapshot.val());
            });
            setOrders(temp);
            setAllOrders(temp);
        });
    }

    const onSearchTextChanged = (text) => {
        const temp = [];
        setQuery(text);
        allOrders.forEach(function (childSnapshot) {
            if (childSnapshot.placedBy.toString().toLowerCase().includes(text.toLowerCase())) {
                temp.push(childSnapshot);
            }
        });
        setOrders(temp);
    }

    useEffect(() => {
        getOrdersFromDB()
    }, []);

    const renderItem = ({ item }) => (
        <View marginX="2"
            mt="4"
            borderColor={Colors.lightBlack}
            borderWidth="1"
            borderRadius="4"
            bg={Colors.deepGray}
            py={5}
            px={2}>
            <Text fontSize={16} color={Colors.black} isTruncated bold="true">
                Order By- {item.placedBy}
            </Text>
            <HStack
                mt="4"
                justifyContent="space-between"
                alignItems="center"
            >
                <Text fontSize={14} color={Colors.blue} isTruncated>
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
        </View>
    );

    return (
        <Box safeArea h="full" bg={Colors.main} >
            <Input
                value={query}
                onChangeText={text => onSearchTextChanged(text)}
                placeholder="Enter email to search orders"
                w="92%"
                bg={Colors.white}
                margin={4}
                type="search"
                variant="filled"
                h={12}
                borderWidth={0}
                _focus={{
                    bg: Colors.white,
                }}
            />
            < View height="100%" backgroundColor={Colors.white} marginTop="2">
                {(
                    orders != null && orders.length > 0 ?

                        <FlatList
                            data={orders}
                            renderItem={renderItem}
                            keyExtractor={item => item.oId}
                        ></FlatList>
                        :
                        <Text style={styles.text}>No orders exists matching your criteria!!! </Text>)
                }
            </View>

        </Box >
    );
};

export default BoughtProducts;

const styles = StyleSheet.create({
    text: {
        margin: 20,
        fontSize: 13,
        fontWeight: "bold",
    },
});