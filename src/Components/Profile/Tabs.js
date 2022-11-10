import { StyleSheet, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Orders from "./Orders";
import Profile from "./AddProduct";
import Colors from "../../color";
import { Text } from "native-base";
import MyProducts from "./MyProducts";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from 'firebase/database';
import ManageOrders from "./ManageOrders";
import { getAuth } from "firebase/auth";

const renderScene = SceneMap({
  first: Orders,
  second: Profile,
  third: MyProducts,
  fourth: ManageOrders
});

export default function Tabs() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {
      key: "first",
      title: "Orders",
    },
  ]);

  const getDataFromDB = () => {
    const db = getDatabase();
    const reference = ref(db, "users/");
    onValue(reference, (snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        const userData = childSnapshot.val();
        if (userData.email.toLowerCase() === getAuth().currentUser?.email.toLowerCase()) {
          if (userData.userType === "admin") {
            setRoutes([
              {
                key: "first",
                title: "Orders",
              },
              {
                key: "second",
                title: "Add Product",
              },
              {
                key: "third",
                title: "My Products",
              },
              {
                key: "fourth",
                title: "Manage Orders",
              },
            ]);
          } else {
            setRoutes([
              {
                key: "first",
                title: "Orders",
              }
            ]);
          }
        }
      });
    });
  }

  const renderTabsBar = (props) => (
    <TabBar
      {...props}
      tabStyle={styles.tabStyle}
      indicatorStyle={{ backgroundColor: Colors.black }}
      activeColor={Colors.main}
      inactiveColor={Colors.white}
      renderLabel={({ route, color }) => (
        <Text style={{ color, ...styles.text }}>{route.title}</Text>
      )}
    />
  );

  useEffect(() => {
    getDataFromDB();
  }, []);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabsBar}
    />
  );
}

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: "black",
  },
  text: {
    fontSize: 13,
    fontWeight: "bold",
  },
});
