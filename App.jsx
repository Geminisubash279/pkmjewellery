import React, { useState, useRef, useEffect  } from 'react';
import { BASE_URL } from './config';
import { View, Button, Image, TouchableOpacity, StyleSheet, Alert, StatusBar, BackHandler, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from './pages/homepage';
import CustomerPage from './pages/customerdetails';
import Ledger from "./pages/Ledger";
import PayNow from "./pages/PayNow";
import NewScheme from "./pages/newscheme";
import SchemeDetails from "./pages/SchemeDetails";

import {
  Provider as PaperProvider,
  Appbar,
  Text,
  TextInput,
} from 'react-native-paper';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState(["", "", "", ""]);
  const pinRefs = useRef([]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  const [pinFocused, setPinFocused] = useState(false);

  const verifyOTP = () => {
    fetch(`${BASE_URL}/loginpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mobile: mobile,
        password: pin.join("")
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigation.navigate("Home", { mobile: mobile });
        } else {
          Alert.alert("Invalid OTP");
        }
      });
  };

const sendOTP = async () => {
    if (mobile.length !== 10) {
      Alert.alert("Enter valid mobile number");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mobile: mobile
        })
      });
      const data = await response.json();
      Alert.alert(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const facebookLogin = () => {
    alert("Facebook Login Clicked");
  };

  const instagramLogin = () => {
    alert("Instagram Clicked");
  };

  const handlePinChange = (text, index) => {
  if (/^[0-9]?$/.test(text)) {
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    // 👉 Move to next box
    if (text && index < pin.length - 1) {
      pinRefs.current[index + 1].focus();
    }

    // 👉 Move back on delete
    if (!text && index > 0) {
      pinRefs.current[index - 1].focus();
    }
  }
};

  return (
    <PaperProvider>
      <StatusBar backgroundColor="#064101" barStyle="light-content" />
      <Appbar.Header style={{ backgroundColor: '#064101' }}>
        <Appbar.Content title="PKM JEWELLERY" color="#ffffff" />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
        <Text style={styles.Heading1}>Welcome To</Text>       
        <Image
          source={require('./android/assets/Logo.jpeg')}
          style={{ width: 200, height: 200, resizeMode: 'contain' }}
        />

        <TextInput
            mode="outlined"   // 👈 important (gives better control)
            label="Mobile Number"
            value={mobile}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '');
              setMobile(numericText);
            }}
            keyboardType="number-pad"
            maxLength={10}

            textColor="#000000"                 // 👈 dark text
            outlineColor="#064101"              // border normal
            activeOutlineColor="#064101"        // border focused
            placeholderTextColor="#999"         // placeholder color

            style={{ width: 300, backgroundColor: "#fff" }}
          />        
       
        <View style={styles.otpContainer}>
            {pin.map((digit, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => pinRefs.current[0].focus()}
                style={[
                  styles.otpBox,
                  digit && styles.otpBoxFilled,
                  pinFocused && styles.otpBoxFocused
                ]}
              >
                <Text style={styles.otpText}>
                  {digit ? "•" : ""}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Hidden Input */}
            <TextInput
              ref={(ref) => (pinRefs.current[0] = ref)}
              value={pin.join("")}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                if (cleaned.length <= 4) {
                  const newPin = cleaned.split("");
                  setPin([...newPin, "", "", "", ""].slice(0, 4));
                }
              }}
              onFocus={() => setPinFocused(true)}
              onBlur={() => setPinFocused(false)}
              keyboardType="number-pad"
              maxLength={4}
              style={styles.hiddenInput}
            />
          </View>
          

         <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate("Customer")}
          >
            <Text style={styles.textotp}>New User? SignUp</Text>
          </TouchableOpacity>
               
        <TouchableOpacity style={styles.button} onPress={verifyOTP}>
          <Text style={styles.text}>Submit</Text>
        </TouchableOpacity>

        <View style={styles.containerSocial}>
            <TouchableOpacity>
              <Icon name="facebook" size={35} color="#1877F2" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Icon name="instagram" size={35} color="#E1306C" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Icon name="youtube-play" size={35} color="#FF0000" />
            </TouchableOpacity>
        </View>
          <Text style={styles.copyright}>
          © 2026 PKM JEWELLERY. All Rights Reserved.
        </Text>
      </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={Homepage} />
          <Stack.Screen name="Customer" component={CustomerPage} />
          <Stack.Screen name="Ledger" component={Ledger} options={{ title: "Ledger Details" }}/>
          <Stack.Screen name="PayNow" component={PayNow} />
          <Stack.Screen name="NewScheme" component={NewScheme} />
          <Stack.Screen name="SchemeDetails" component={SchemeDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',    
    backgroundColor:"#ffffff",
    gap: 10,
    paddingVertical: 20,
  },
  containerSocial: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 20
  },
  input: {
    height: 50,
    width: 300,
    borderWidth: 0,
    backgroundColor : '#ffffff',    
    color: 'blue',
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
  },
  
  text: {
    color: '#fff',
    backgroundColor: '#064101',
    fontSize: 16,
    width: 150,
    height: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  Heading: {
    color: '#fff',
    backgroundColor: '#064101',
    fontSize: 16,
    width: 350,
    height: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
   Heading1: {
    color: '#064101',
    fontSize: 16,
    width: 150,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
 socialText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 15
  },
  textotp: {
    color: '#120b70',
    fontSize: 16,
    width: 150,
    height: 35,
    textAlign: 'center',    
    fontStyle:'italic',
  },  
  copyright: {
  position: "static",
  bottom: 10,
  alignSelf: "center",
  fontSize: 12,
  color: "#777",
},
pinBox: {
  width: 50,
  height: 50,
  borderWidth: 1,
  borderColor: "#064101",
  textAlign: "center",
  fontSize: 20,
  borderRadius: 8,
  backgroundColor: "#fff",
},
 otpContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: 280,
  marginTop: 15,
},

otpBox: {
  width: 60,
  height: 60,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#ddd",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",

  // premium shadow
  elevation: 3,
},

otpBoxFocused: {
  borderColor: "#064101",
  borderWidth: 2,
  backgroundColor: "#fff5f5",
  elevation: 6,
},

otpBoxFilled: {
  borderColor: "#064101",
  backgroundColor: "#f9f1f1",
},

otpText: {
  fontSize: 24,
  color: "#000",
  fontWeight: "bold",
},

hiddenInput: {
  position: "absolute",
  width: 0,
  height: 0,
  opacity: 0,
},
});