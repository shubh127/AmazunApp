import { Center, Heading, Image, Text } from "native-base";
import React from "react";
import Colors from "../color";
import Tabs from "../Components/Profile/Tabs";
import { getAuth } from "firebase/auth";
import { Button } from "react-native";

function ProfileScreen({ navigation }) {

  const logout = () => {
    getAuth().signOut().then(() => {
      navigation.replace("Login");
    }).catch(error => { alert(error.message) });
  }

  return (
    <>
      <Center bg={Colors.main} pt={10} pb={6}>
        <Image
          mt={10}
          source={{
            uri: "https://res.cloudinary.com/zpune/image/upload/v1645429478/random/user_u3itjd.png",
          }}
          alt="profile"
          w={24}
          h={24}
          resizeMode="cover"
        />
        <Heading bold fontSize={15} isTruncated my={2} color={Colors.white}>
          {getAuth().currentUser?.email}
        </Heading>
        <Button
          onPress={() => logout()}
          title="Logout"
          color={Colors.red}
        />
      </Center>
      <Tabs />
    </>
  );
}

export default ProfileScreen;
