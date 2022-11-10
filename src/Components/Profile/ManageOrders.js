
import { Box, FormControl, Input, ScrollView, VStack, } from "native-base";
import React, { useState } from "react";
import Colors from "../../color";
import Buttone from "../Buttone";
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const ManageOrders = () => {
    const navigation = useNavigation();
    const [oId, setOId] = useState("");
    const [status, setStatus] = useState("");

    const updateOrderStatus = (db) => {
        const reference = ref(db, "orders/" + oId);
        update(reference, { status: status })
            .then(() => resetValues())
            .catch(error => { alert(error.message) })
    }

    const isOrderExist = () => {
        if (oId === "" || status === "") {
            alert("Order Id or Status cannot be empty!!! Please fix and try again!!!");
        } else {
            const db = getDatabase();
            const reference = ref(db, "orders/" + oId);
            onValue(reference, (snapshot) => {

                if (snapshot.exists()) {
                    updateOrderStatus(db);
                } else {
                    alert("There is no order associated to the entered order ID!!! Please check and try again!!!");
                }
            });
        }
    }

    const resetValues = () => {
        alert("Order updated successfully!!!");
        setOId("");
        setStatus("");
    }

    return (
        <Box h="full" bg={Colors.white} px={5}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space={10} mt={5} pb={10}>
                    <FormControl >
                        <FormControl.Label
                            _text={{
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            Order ID
                        </FormControl.Label>
                        <Input
                            borderWidth={0.2}
                            bg={Colors.subGreen}
                            borderColor={Colors.main}
                            py={4}
                            type="text"
                            color={Colors.main}
                            fontSize={15}
                            _focus={{
                                bg: Colors.subGreen,
                                borderColor: Colors.main,
                                borderWidth: 1,
                            }}
                            value={oId}
                            onChangeText={text => setOId(text)}
                        />
                    </FormControl>

                    <FormControl >
                        <FormControl.Label
                            _text={{
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            Order Status
                        </FormControl.Label>
                        <Input
                            borderWidth={0.2}
                            bg={Colors.subGreen}
                            borderColor={Colors.main}
                            py={4}
                            type="text"
                            color={Colors.main}
                            fontSize={15}
                            _focus={{
                                bg: Colors.subGreen,
                                borderColor: Colors.main,
                                borderWidth: 1,
                            }}
                            value={status}
                            onChangeText={text => setStatus(text)}
                        />
                    </FormControl>

                    <Buttone bg={Colors.main} color={Colors.white}
                        onPress={() => isOrderExist()}>
                        Update order status
                    </Buttone>

                    <Buttone bg={Colors.black} color={Colors.white}
                        onPress={() => navigation.navigate("BoughtProducts")}>
                        Show all bought products list
                    </Buttone>
                </VStack>
            </ScrollView>
        </Box>
    );
};

export default ManageOrders;

const styles = StyleSheet.create({
    error: {
        marginHorizontal: 20,
        textAlignVertical: "center",
        textAlign: "center",
        marginTop: 200,
        fontSize: 20,
    },
});