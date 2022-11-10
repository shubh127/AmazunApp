import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import Colors from "../color";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from 'firebase/database';

function LoginScreen({ navigation }) {
  const firebaseConfig = {
    apiKey: "AIzaSyA5sV9Z_N9MI0vGikjyANNIq7HrqOjPTjU",
    authDomain: "finalproject-c14bd.firebaseapp.com",
    projectId: "finalproject-c14bd",
    storageBucket: "finalproject-c14bd.appspot.com",
    messagingSenderId: "714833584649",
    appId: "1:714833584649:web:3470ffb80e9e89f82d0ed8"
  };

  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");

  useEffect(() => {
    initializeApp(firebaseConfig);
    const unsubscribe = getAuth().onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("Bottom");
      }
    })
    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    if (email === "" || password === "") {
      alert("Email or password cannot be empty!!!");
    } else {
      createUserWithEmailAndPassword(getAuth(), email, password)
        .then(
          saveToDB()
        ).catch(error => alert(error.message));
    }
  }

  const saveToDB = () => {
    const id = Date.now();
    const db = getDatabase();
    const reference = ref(db, "users/" + id);
    set(reference, { userId: id, email: email, userType: "user" });
  }

  const handleLogin = () => {
    if (email === "" || password === "") {
      alert("Email or password cannot be empty!!!");
    } else
      signInWithEmailAndPassword(getAuth(), email, password)
        .then().catch(error => alert(error.message));
  }

  return (
    <Box flex={1} bg={Colors.black}>
      <Image
        flex={1}
        alt="Logo"
        resizeMode="cover"
        size="lg"
        w="full"
        source={require("../../assets/cover.png")}
      />
      <Box
        w="full"
        h="full"
        position="absolute"
        top="0"
        px="6"
        justifyContent="center"
      >
        <Heading>LOGIN</Heading>
        <VStack space={5} pt="6">
          <Input
            InputLeftElement={
              <MaterialIcons name="email" size={20} color={Colors.main} />
            }
            variant="underlined"
            placeholder="user@gmail.com"
            w="70%"
            pl={2}
            type="text"
            color={Colors.main}
            borderBottomColor={Colors.underline}
            value={email}
            onChangeText={text => setEmail(text)}
          />
          {/* PASSWORD */}
          <Input
            InputLeftElement={
              <Ionicons name="eye" size={20} color={Colors.main} />
            }
            variant="underlined"
            placeholder="*********"
            w="70%"
            type="password"
            pl={2}
            color={Colors.main}
            borderBottomColor={Colors.underline}
            value={password}
            onChangeText={text => setPassWord(text)}
          />
        </VStack>
        <Button
          _pressed={{
            bg: Colors.main,
          }}
          my={30}
          w="40%"
          rounded={50}
          bg={Colors.main}
          onPress={() => handleLogin()}
        >
          LOGIN
        </Button>
        <Pressable mt={4} onPress={() => handleSignUp()}>
          <Text color={Colors.deepestGray}>SIGN UP</Text>
        </Pressable>
      </Box>
    </Box>
  );
}

export default LoginScreen;
