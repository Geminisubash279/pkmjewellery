import React, {useRef, useEffect, useState } from "react";
import { BASE_URL } from '../config';
import { View, ImageBackground, ScrollView, StyleSheet, Image, FlatList, Animated, Easing, BackHandler } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider as PaperProvider,  Appbar,  Text,  Card, TextInput, Button } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dimensions } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const screenWidth = Dimensions.get("window").width;
const bannerImages = [require("../android/assets/P1.png"), require("../android/assets/P2.png"), require("../android/assets/P1.png"), require("../android/assets/P2.png"), require("../android/assets/P1.png")];  
function HomeScreen({ navigation, route }) {  
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [goldrate, setUsers] = useState([]);
  const [silverrate, setSilverrate] = useState([]);
  const [openCard, setOpenCard] = useState(null); 
  const [lang, setLang] = useState(null); 
  const mobile = route?.params?.mobile || "";
  const [customer, setCustomer] = useState(null);
  const goldAnim = useRef(new Animated.Value(0)).current;
  const silverAnim = useRef(new Animated.Value(0)).current;
  const bottomBannerIndex = useRef(0);
  const bottomBannerScroll = useRef(null);

useEffect(() => {
  Animated.loop(
    Animated.timing(goldAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    })
  ).start();

  Animated.loop(
    Animated.timing(silverAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    })
  ).start();
  }, []);  

  useEffect(() => {
  console.log("MOBILE:", mobile);
}, []);


  useEffect(() => {
    if (mobile) {
      loadCustomer();
    }
  }, []);

  const loadCustomer = async () => {
    const response = await fetch(
      `${BASE_URL}/customerprofile?mobile=${mobile}`
    );
    const data = await response.json();
    if (data.length > 0) {
      setCustomer(data[0]);
    }
  };

  useEffect(() => {
    fetch(`${BASE_URL}/goldrate`)
      .then((response) => response.json())
      .then((data) => { setUsers(data); })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/silverrate`)
      .then((response) => response.json())
      .then((data) => { setSilverrate(data); })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      bottomBannerIndex.current = (bottomBannerIndex.current + 1) % bannerImages.length;
      bottomBannerScroll.current?.scrollTo({ x: bottomBannerIndex.current * (screenWidth - 40), animated: true });}, 2500); return () => clearInterval(interval); }, []); const goldRotate = goldAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "360deg"],
});

const silverRotate = silverAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "360deg"],
});

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>      
      <View style={styles.container}>      
        <View><Text style={{marginBottom:5, color:"#d10000", fontWeight:"bold", fontSize:16, textAlign:"center", width:"100%"}}>Hello {customer?.CustomerName} </Text></View>
          
          <View style={styles.priceRow}>
          
          <Card style={styles.priceCard}>
            <Card.Content style={styles.center}>
              <Image
                source={{ uri: "https://pngimg.com/uploads/gold/gold_PNG101019.png" }}
                style={styles.metalImg}
                resizeMode="contain" 
              />
              <Text style={styles.priceTitle}>Today Gold Price</Text>
              <Text style={styles.priceValue}>₹{goldrate[0]?.RATE.toFixed(2) || "--"}</Text>
              <Text style={styles.perGram}>Per gram</Text>
            </Card.Content>
          </Card>

          <Card style={styles.priceCard}>
            <Card.Content style={styles.center}>
              <Image
                source={{ uri: "https://img.freepik.com/premium-photo/silver-bars-3d-rendering_808337-12772.jpg?semt=ais_hybrid&w=740&q=80" }}
                style={styles.metalImg}
                resizeMode="contain" 
              />
              <Text style={styles.priceTitle}>Today Silver Price</Text>
              <Text style={styles.priceValue}>₹{silverrate[0]?.SRATE.toFixed(2) || "--"}</Text>
              <Text style={styles.perGram}>Per gram</Text>
            </Card.Content>
          </Card>

        </View>
          

          <Text style={{fontSize:16, fontWeight:"bold", color:"#6e0501", marginBottom:8, textAlign:"center"}}>Our Schemes</Text>
            {/* Digi Gold Scheme */}            
            <Card style={styles.schemeCardHorizontal}>
              <Image source={require("../android/assets/P1.png")} style={styles.schemeImage} />

              <Card.Content>
                <View style={styles.actionRow}> 
                <Text style={styles.schemeTitle}>PKM GOLD SCHEME</Text>
                      <Button mode="contained" style={styles.proceedBtn} labelStyle={styles.proceedBtnText} textColor="#ffffff" onPress={() => 
                        navigation.navigate("SchemeDetails", {scheme: "gold", schemeId: "62", mobile: mobile || route?.params?.mobile })}> Know More </Button>
                  </View>
              </Card.Content>
            </Card>

          {/* Digi Silver Scheme */}
            <Card style={styles.schemeCardHorizontal}>
              <Image source={require("../android/assets/P2.png")} style={styles.schemeImage} />
              <Card.Content>
                <View style={styles.actionRow}>   
                <Text style={styles.schemeTitle}>PKM AMOUNT SCHEME</Text>                                     
                      <Button mode="contained" style={styles.proceedBtn} labelStyle={styles.proceedBtnText} textColor="#ffffff" onPress={() => 
                        navigation.navigate("SchemeDetails", {scheme: "bonus", schemeId: "63", mobile: mobile || route?.params?.mobile })}> Know More </Button>                 
                    </View>
              </Card.Content>
            </Card>          
          
      </View>
  </ScrollView>           
  )
}

function ProfileScreen({ route }) {
  const mobile = route?.params?.mobile || "";
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (mobile) {
      loadCustomer();
    }
  }, []);

  const loadCustomer = async () => {
    const response = await fetch(`${BASE_URL}/customerprofile?mobile=${mobile}`);
    const data = await response.json();

    if (data.length > 0) {
      setCustomer(data[0]);
    }
  };

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>

        {/* Header */}

        {customer && (
          <ScrollView contentContainerStyle={{ padding: 15 }}>

            {/* Profile Card */}
            <Card style={{ borderRadius: 15, elevation: 4, backgroundColor: "#fff", marginBottom: 15 }}>
              <Card.Content style={{ alignItems: "center", paddingVertical: 20 }}>

                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                  style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
                />

                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#6e0000"  }}>
                  {customer.CustomerName}
                </Text>

                <Text style={{ fontSize: 14, color: "#777" , color: "#6e0000"  }}>
                  {customer.Mobile}
                </Text>

              </Card.Content>
            </Card>

            {/* Details Card */}
            <Card style={{ borderRadius: 15,  backgroundColor: "#fff", elevation: 3 }}>
              <Card.Content>

                {/* Row */}
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  borderBottomWidth: 0.5,
                  borderColor: "#ddd"
                }}>
                  <Text style={{ color: "#6e0000" }}>Street</Text>
                  <Text style={{ fontWeight: "bold" , color: "#6e0000" }}>{customer.StreetName}</Text>
                </View>

                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  borderBottomWidth: 0.5,
                  borderColor: "#ddd"
                }}>
                  <Text style={{ color: "#6e0000"  }}>Area</Text>
                  <Text style={{ fontWeight: "bold" , color: "#6e0000" }}>{customer.Area}</Text>
                </View>

                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10
                }}>
                  <Text style={{ color: "#6e0000" }}>City</Text>
                  <Text style={{ fontWeight: "bold" , color: "#6e0000" }}>{customer.City}</Text>
                </View>

              </Card.Content>
            </Card>

          </ScrollView>
        )}

      </View>
    </PaperProvider>
  );
}

function AboutScreen({ route }) {  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
      <View style={{ alignItems: "center" }}>
        <Image source={require("../android/assets/Logo.jpeg")} style={{ width: "100%", height: 200, resizeMode: "cover" }} />
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#6e0501", textAlign: "center", marginBottom: 4 }}>PKM JEWELLERY</Text>
        <Text style={{ fontSize: 13, color: "#888", textAlign: "center", marginBottom: 20 }}>Your Trusted Jewellery Partner</Text>

        <View style={{ backgroundColor: "#fff8f8", borderRadius: 12, padding: 16, elevation: 3, marginBottom: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "bold", color: "#6e0501", marginBottom: 8 }}>📍 Address</Text>
          <Text style={{ fontSize: 13, color: "#444", lineHeight: 22 }}>867/341, Ranipettai Street,{" "}Opp. New Bus Stand,{" "}Attur - 636102</Text>
        </View>

        <View style={{ backgroundColor: "#fff8f8", borderRadius: 12, padding: 16, elevation: 3, marginBottom: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "bold", color: "#6e0501", marginBottom: 8 }}>📞 Contact</Text>
          <Text style={{ fontSize: 14, color: "#0645ad" }} onPress={() => Linking.openURL('tel:9942251355')}>99422 51355</Text>
        </View>

        <View style={{ backgroundColor: "#fff8f8", borderRadius: 12, padding: 16, elevation: 3, marginBottom: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "bold", color: "#6e0501", marginBottom: 8 }}>Email</Text>
          <Text style={{ fontSize: 14, color: "#444" }}>gsthangamaligai@gmail.com</Text>
        </View>

        <View style={{ backgroundColor: "#fff8f8", borderRadius: 12, padding: 16, elevation: 3 }}>
          <Text style={{ fontSize: 13, fontWeight: "bold", color: "#6e0501", marginBottom: 8 }}>🌐 Website</Text>
          <Text style={{ fontSize: 14, color: "#0645ad" }} onPress={() => Linking.openURL('https://gsthangamaligai.co.in/')}>gsthangamaligai.co.in</Text>
        </View>
        
      </View>
    </ScrollView>
  );
}

// function offers({ route }) {  
//   return (
//     <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
//       <View style={styles.AboutContainer}>
//         <Text style={styles.Aboutlabel1}>Our Schemes</Text>
//         <View style={styles.offerGrid}>
//           <Image source={require("../android/assets/S1.jpeg")} style={styles.offerImage} resizeMode="cover" />
//           <Image source={require("../android/assets/S2.jpeg")} style={styles.offerImage} resizeMode="cover" />
//           <Image source={require("../android/assets/S3.jpeg")} style={styles.offerImage} resizeMode="cover" />
//           <Image source={require("../android/assets/S4.jpeg")} style={styles.offerImage} resizeMode="cover" />
//         </View>
//         <Text style={styles.Aboutlabel1}>GS THANGAMALIGAI</Text>
//       </View>
//     </ScrollView>
//   );
// }

function MonthInstall({ route, navigation }) {

  const mobile = route?.params?.mobile || "";
  const [customeracc, setCustomer] = useState([]);

  useEffect(() => {
    if (mobile) {
      loadCustomer();
    }
  }, [mobile]);

  const loadCustomer = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/getCustomerAccount?mobile=${mobile}`
      );

      const data = await response.json();
      setCustomer(data);   // store full array
    } catch (error) {
      console.log(error);
    }
  };

  const blinkAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(blinkAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(blinkAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);

  return (
    <View style={styles.MonthContainer }>
      <FlatList
        data={customeracc}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (          
          
          <View style={[styles.recordBox, item.STATUS !== "ACTIVE" && styles.inactiveCard] }>
            {item.STATUS === "CLOSED" && (<Text style={styles.closedBadge}>CLOSED</Text>)}
            
            <View style={styles.row}>
                <Text style={styles.valueMonthSch}>{item.SCHEMENAME}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.halfRow}>
                <Text style={styles.labelMonth}>Account No</Text>
                <Text style={styles.valueMonth}>: {item.ACCNO}</Text>
              </View>

              <View style={styles.halfRow}>
                <Text style={styles.labelMonth}>Join Date</Text>
                <Text style={styles.valueMonth}>: {item.JOINDATE}</Text>
              </View>
            </View>
            <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.labelMonth}>Status</Text>
              <Text style={styles.valueMonth}>: {item.STATUS}</Text>
            </View>

            <View style={styles.halfRow}>
              <Text style={styles.labelMonthIns}>Installment Paid</Text>
              <Text style={styles.valueMonthIns}>{item.TOTALINS}</Text>
            </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.labelMonthIns}>Last date</Text>
                <Animated.Text style={[styles.valueLastTDate,{ opacity: blinkAnim }]}>{item.LASTRECDATE || "N/A"}</Animated.Text>
              </View>

            <View style={styles.row}>
              <View style={styles.halfRow}>
                <Text style={styles.labelMonth}>Amount Received</Text>                
              </View>
            
              <View style={styles.halfRow}>
                <Text style={styles.labelMonth}>Acc. Weight</Text>                
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfRow}>
                <Text style={styles.valueMonthWt}>₹ {item.AMOUNT}</Text>
              </View>
            
              <View style={styles.halfRow}>
                <Text style={styles.valueMonthWt}>{item.WEIGHT} gms</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button mode="outlined" style={styles.ledgerBtn} textColor="#6e1e1e" onPress={() =>
                  navigation.navigate("Ledger", { accno: item.ACCNO })}>Ledger</Button>
          
              <Button mode="contained" style={styles.payBtn} textColor="#ffffff" disabled={(item.SCHEMENAME !== "DIGIGOLD" && item.SCHEMENAME !== "DIGISILVER") && (item.STATUS !== "ACTIVE" || item.PAIDTHISMONTH > 0)}
                  onPress={() => navigation.navigate("PayNow", { accno: item.ACCNO, mobile: mobile }) } > Pay Now
              </Button>
            </View>            
            
          </View>
        )}
      />
    </View>
  );
}

export default Homepage;


function Homepage({ navigation, route }) {
  const mobile = route?.params?.mobile || "";

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  const _goBack = () => {
    navigation.navigate("Login");
  };

  return (
    <PaperProvider>
      <Appbar.Header style={{ backgroundColor: '#064101' }}>
        <Appbar.Action icon="home" color="#ffffff" />
        <Appbar.Content title="PKM Jewellery" color="#ffffff" />
        <Appbar.Action icon="logout" color="#ffffff" onPress={_goBack} />
      </Appbar.Header>
      

      <Tab.Navigator screenOptions={{ headerShown: false }}>
        
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ mobile: mobile }}
          options={{
            tabBarIcon: () => <Ionicons name="create-sharp" size={25} />,
          }}
        />

        <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            initialParams={{ mobile: mobile }}
            options={{
              tabBarIcon: () => <Ionicons name="person" size={25} />,
            }}
          />       

        <Tab.Screen
          name="E-Passbook"
          component={MonthInstall}
          initialParams={{ mobile: mobile }}
          options={{
            tabBarIcon: () => <Ionicons name="book" size={25} />,
          }}
        />

        {/* <Tab.Screen
          name="Offers"
          component={offers}
          options={{
            tabBarIcon: () => <Ionicons name="pricetag" size={25} />,
          }}
        /> */}
        
        <Tab.Screen
          name="About"
          component={AboutScreen}          
          options={{
            tabBarIcon: () => <Ionicons name="information-circle" size={25}/>,
          }}
        />
        
      </Tab.Navigator>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop : 20,    
  },
  ProfileContainer: {
    flex: 1,
    marginLeft:40,
    marginTop : 20,    
  },
  inactiveCard: {
  backgroundColor: "#bea9a9",   // light grey
},
  AboutContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
  },
  MonthContainer: {
    flex: 1,
    marginLeft:10,
    marginTop : 10,
  },
  textdet:{
     marginBottom: 6,
  },
  closedBadge: {
  position: "absolute",
  top: 5,
  right: 10,
  color: "red",
  fontWeight: "bold"
},
  text: {
    color: '#064101',
    textAlign: 'right',
    alignSelf: 'stretch',
    width: 400,
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
  },
  imagesizing : {
      height : 250,
      width : 350,
      paddingHorizontal: 100,
      marginBottom: 6,
     },
     
  row:{
  flexDirection:"row",
  justifyContent:"space-between"
},

row1: {
  flexDirection: "row",
  justifyContent: "space-around", // ✅ better than space-between
  marginTop: 10,
},

input:{
  fontSize:16,
  width:200,
  textAlign:"center",
  color : "#ffffff",
  backgroundColor:"#064101",
  borderCurve:25,
},
input1:{
  fontSize:20,
   width:120,
  textAlign:"center",
  fontWeight: "bold",
  color : "#064101",
},
  Custdet: {
    marginBottom: 6,
    fontSize : 20,    
    color : "#064101",
  },
  row: {
    flexDirection: "row",
  },
  label: {
    fontSize:20,
    color : "#064101",
    width: 100,    
  },
  Aboutlabel1: {
    fontSize:20,   
    fontWeight: "bold",
    color:"#b90769",
    textAlign:'center'
  },  
   Aboutlabel: {
    fontSize:15,   
    color:"#084c6b",
    textAlign:'center'
  },  
  icon:{
    width:30,
    height:30,
    marginRight:8
  },
  sicon:{
    width:30,
    height:30,
    marginRight:8
  },
    itemRow:{
      flexDirection:"row",
      alignItems:"center",
      color:"#e00f32",
      padding:8,
      marginBottom:5
  },
  value: {
    flex: 1,
    fontSize:20,
    fontWeight: "bold",
    color:"#E1306C"
  },
  labelMonth: {
    fontSize:13,
    color : "#064101",
    width: 70,    
    justifyContent:'center'
  },
  labelMonthIns: {
    fontSize:13,
    width: 100,    
    color : "#064101",
    justifyContent:'center',
    marginTop:5,
  },
  valueMonth: {
    flex: 1,
    fontSize:13,
    fontWeight: "bold",
    color:"#3411ce",
    marginBottom: 5,
  },
  valueMonthSch:{
    flex:1,
    fontSize:18,
    fontWeight:"bold",
    color:"#b90769",
    marginBottom:5,
  },
  valueMonthWt: {
    flex: 1,
    fontSize:20,
    fontWeight: "bold",
    color:"#056b1b",
    marginBottom: 5,
  },
  valueLastTDate: {
    flex: 1,
    fontSize:15,
    fontWeight: "bold",
    color:"#064101",
    marginBottom: 5,
  },
  valueMonthIns: {
    flex: 1,
    fontSize:20,
    fontWeight: "bold",
    color:"#9c0916",
    marginBottom: 5,
  },
  recordBox:{
  marginBottom:15,
  padding:10,
  backgroundColor:"#ffffff",
  borderWidth:1,
  borderRadius:10,
  elevation:5
},
halfRow:{
  flex:1,
  flexDirection:"row",
},
buttonRow:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginTop:10
},

payBtn:{
  flex:1,
  marginRight:5,
  backgroundColor:"#6e0501",
},

ledgerBtn:{
  flex:1,
  marginLeft:5,
  color:"#6e0501",
  borderColor:"#6e0501",
},
aboutImage: {
  justifyContent:"center",
  width: 200,
  height: 200,
  marginBottom: 20
},
offerGrid: {
  flexDirection: "column",
  padding: 10,
  width: "100%",
},
offerImage: {
  width: "100%",
  height: 200,
  marginBottom: 12,
  borderRadius: 12,
},
schemeCard: {
  margin: 10,
  borderRadius: 12,
  elevation: 4,
},

schemeImage: {
  width: "100%",
  height: 160,
  resizeMode: "cover",  
  margin: 0,
  padding: 0,
},

schemeTitle: {
  fontSize: 14,
  fontWeight: "bold",
  marginTop:10,
  color:"#6e0501",
  marginBottom: 5,
},

schemeDesc: {
  fontSize: 14,
  color:"#000000",
  marginBottom: 8,
},

schemeSub: {
  fontWeight: "bold",
  marginTop: 5,
},

schemeLongText: {
  marginTop: 10,
  fontSize: 13,
  color: "#444",
},

schemeLongTextHead: {
  marginTop: 10,
  fontSize: 13,
  fontWeight: "bold",
  color: "#444",
},

readMore: {
  color: "#6e0501",
  marginTop: 10,
  fontWeight: "bold",
},
actionRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 10,
  gap: 10,
  fontsize:10,
},

proceedBtn: {
  backgroundColor: "#6e0501",
  minWidth: 0,
  paddingHorizontal: 2,
  height: 32,
  justifyContent: "center",
},
proceedBtnText: {
  fontSize: 11,
  marginVertical: 0,
},
schemeCardHorizontal: {
  width: screenWidth - 40,   
  marginRight: 20,
  borderRadius: 12,
  backgroundColor:"#ffffff",  
  elevation: 4,
},
table: {
    borderWidth: 1,
    borderColor: "#000"
  },
  row: {
    flexDirection: "row"
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    color: "#000",
    padding: 10,
    fontSize: 10
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#eee"
  },
  rotate45: {
  transform: [{ rotate: "45deg" }],
},
actionContainer: {
  alignItems: "center",
},

langRow: {
  flexDirection: "row",
  marginTop: 5,
},

langText: {
  marginHorizontal: 10,
  color: "#6e0501",
  fontWeight: "bold",
},
card: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4, // Android shadow
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  priceRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  margin: 10,
  backgroundColor: "#f5f5f5", // ✅ ADD THIS
},

priceCard: {
  width: "48%",
  borderRadius: 10,
  backgroundColor: "#fafafa",
  elevation: 2,
},

center: {
  alignItems: "center",
  backgroundColor: "#ffffff",
  paddingVertical: 6,
},

  metalImg: {
  width: 45,
  height: 45,
  marginBottom: 4,
},

  priceTitle: {
    fontSize: 11,
    color: "#555",
  },

  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d32f2f",
  },

  perGram: {
    fontSize: 10,
    color: "#777",
  },

});