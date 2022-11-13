import { Box, FormControl, Input, ScrollView, View, VStack, } from "native-base";
import React, { useEffect, useState } from "react";
import Colors from "../color";
import Buttone from "../Components/Buttone";
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { StyleSheet, Text } from 'react-native';

const ProductSaleStatus = ({ route }) => {
    const product = route.params;
    const [pName, setPName] = useState("");
    const [week, setWeekCount] = useState("0");
    const [month, setMonthCount] = useState("0");
    const [allTime, setAllTimeCount] = useState("0");

    const getOrdersFromServer = (pId) => {
        const db = getDatabase();
        const reference = ref(db, "orders/");
        onValue(reference, (snapshot) => {
            var allTime = 0;
            var month = 0;
            var week = 0;
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().order[0].product.pId === pId) {
                    allTime++;

                    const orderDate = new Date(childSnapshot.val().oId)

                    const today = new Date();
                    const lastWeek = new Date(today - 7 * 24 * 60 * 60 * 1000);
                    const lastMonth = new Date(today - 30 * 24 * 60 * 60 * 1000);

                    if (orderDate >= lastMonth) {
                        month++;
                    }

                    if (orderDate >= lastWeek) {
                        week++;
                    }
                    
                }
            });
            setAllTimeCount("" + allTime);
            setWeekCount("" + week);
            setMonthCount("" + month);
        });
    }

    useEffect(() => {
        setPName(product.name);
        getOrdersFromServer(product.pId);
    }, []);


    return (
        <Box h="full" bg={Colors.white} px={5} safeAreaTop background={Colors.white}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <VStack space={10} mt={5} pb={10}>
                    <FormControl >
                        <FormControl.Label
                            _text={{
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            Product name
                        </FormControl.Label>
                        <Input
                            isDisabled="true"
                            borderWidth={0.2}
                            bg={Colors.black}
                            borderColor={Colors.black}
                            py={4}
                            type="text"
                            color={Colors.white}
                            fontSize={15}
                            _focus={{
                                bg: Colors.subGreen,
                                borderColor: Colors.main,
                                borderWidth: 1,
                            }}
                            value={pName}
                        />
                    </FormControl>

                    <FormControl >
                        <FormControl.Label
                            _text={{
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            Sold Last Week
                        </FormControl.Label>
                        <Input
                            isDisabled="true"
                            borderWidth={0.2}
                            bg={Colors.black}
                            borderColor={Colors.black}
                            py={4}
                            type="text"
                            color={Colors.white}
                            fontSize={15}
                            _focus={{
                                bg: Colors.subGreen,
                                borderColor: Colors.main,
                                borderWidth: 1,
                            }}
                            value={week}
                        />
                    </FormControl>

                    <FormControl >
                        <FormControl.Label
                            _text={{
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            Sold last month (30 days)
                        </FormControl.Label>
                        <Input
                            isDisabled="true"
                            borderWidth={0.2}
                            bg={Colors.black}
                            borderColor={Colors.black}
                            py={4}
                            type="text"
                            color={Colors.white}
                            fontSize={15}
                            _focus={{
                                bg: Colors.subGreen,
                                borderColor: Colors.main,
                                borderWidth: 1,
                            }}
                            value={month}
                        />
                    </FormControl>

                    <FormControl >
                        <FormControl.Label
                            _text={{
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            Sold all time
                        </FormControl.Label>
                        <Input
                            isDisabled="true"
                            borderWidth={0.2}
                            bg={Colors.black}
                            borderColor={Colors.black}
                            py={4}
                            type="text"
                            color={Colors.white}
                            fontSize={15}
                            _focus={{
                                bg: Colors.subGreen,
                                borderColor: Colors.main,
                                borderWidth: 1,
                            }}
                            value={allTime}
                        />
                    </FormControl>
                </VStack>
            </ScrollView>
        </Box>
    );
};

export default ProductSaleStatus;

