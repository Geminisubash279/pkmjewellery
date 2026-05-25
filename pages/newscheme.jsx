import React, {useEffect, useState } from "react";
import { BASE_URL } from '../config';
import { View, ScrollView, StyleSheet, BackHandler, ActivityIndicator } from "react-native";
import { Text, TextInput, Button, Checkbox } from "react-native-paper";
import { Provider as PaperProvider, Appbar, Card } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import RazorpayCheckout from 'react-native-razorpay';

function NewScheme({ navigation, route }) {
  const [checked, setChecked] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [scheme, setScheme] = useState(null);
  const mobile = route?.params?.mobile || "";
  const schemename = route?.params?.schemeid || "";
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [total, setTotal] = useState(0);
  const [bonuswt, setBonus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isEditable = !amount || parseFloat(amount) === 0;

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
      }, []);

      const loadCustomer = async () => {
        try {
          const response = await fetch(`${BASE_URL}/customerprofile?mobile=${mobile}`);
          const data = await response.json();
          if (data.length > 0) setCustomer(data[0]);
        } catch (e) { console.log("loadCustomer error", e); }
      };

      const loadSCheme = async () => {
        try {
          const response = await fetch(`${BASE_URL}/loadscheme?schemename=${schemename}`);
          const data = await response.json();
          if (data.length > 0) {
            const schemeData = data[0];
            setScheme(schemeData);
            if (schemeData.weightledger === "Y") {
              if (schemeData.MetalType === "G") setRate(schemeData.GOLDRATE?.toString() || "0");
              else if (schemeData.MetalType === "S") setRate(schemeData.SILVERRATE?.toString() || "0");
            }
          }
        } catch (e) { console.log("loadScheme error", e); }
      };

    useEffect(() => {
        if (mobile) {
          loadCustomer();
          loadSCheme();
        }
      }, []);

      useEffect(() => {
        const amt = parseFloat(amount);
        const rt = parseFloat(rate);
        if (!isNaN(amt) && !isNaN(rt) && rt > 0) {
          const calculatedTotal = amt / rt;
          setTotal(calculatedTotal);
          if (scheme?.schemeName === "DIGIGOLD" || scheme?.schemeName === "DIGISILVER") {
            setBonus(calculatedTotal * 0.09);
          } else {
            setBonus(0);
          }
        } else {
          setTotal(0);
          setBonus(0);
        }
      }, [amount, rate, scheme]);

  const openRazorpay = () => {
    const amtValue = parseFloat(amount);
    if (!amount || amtValue === 0) {
      alert("Enter valid amount");
      return;
    }
    if ((schemename === "11" || schemename === "12") && amtValue < 100) {
      alert("Minimum amount is ₹100 for DigiGold/DigiSilver");
      return;
    }
  
    const options = {
      description: 'Gold Scheme Payment',
      image: './assets/logo.png', // optional
      currency: 'INR',
      key: 'rzp_test_SspJ0Y06xrh9Mn',
      amount: parseFloat(amount) * 100, // in paise
      name: 'PKM Jewellery',
      prefill: {
        email: 'pkmjewellery@gmail.com',
        contact: '9942251355',
        name: customer?.CustomerName || '',
      },
      theme: { color: '#660606' },
    };
  
    RazorpayCheckout.open(options)
      .then(async (data) => {
        setIsLoading(true);
  
    try {
      const response = await fetch(`${BASE_URL}/newschpay-success`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_id: data.razorpay_payment_id,
          order_id: null,
          amount: amount,
          accno: scheme?.accno,
          metal: scheme?.MetalType,
          rate: rate,
          weight: parseFloat(total.toFixed(3)),
          installment: 1,
          customername: customer?.CustomerName,
          address: customer?.StreetName,
          area: customer?.Area,
          city: customer?.City,
          mobile: customer?.Mobile,
          bonus: (scheme?.schemeName === "DIGIGOLD" || scheme?.schemeName === "DIGISILVER") ? parseFloat((parseFloat(amount) / parseFloat(rate) * 0.09).toFixed(3)) : 0,
      })
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert("✅ Payment Success ");
        setIsLoading(false);
        navigation.navigate("Home", { 
            updated: true,
            mobile: mobile
          });
      } else {
        alert("⚠️ Payment success but DB failed");
        setIsLoading(false);
      }
  
    } catch (error) {
      console.log("API ERROR:", error);
      alert("Payment done but server error");
      setIsLoading(false);
    }  
  })
  };

  return (
    <PaperProvider>

      <Appbar.Header style={{ backgroundColor: '#660606' }}>
        <Appbar.Action
          icon="arrow-left"
          color="#ffffff"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title="PKM Jewellery" color="#ffffff" />
      </Appbar.Header>
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

      <Text style={styles.title}>Scheme Joining Form</Text>

      <Text style={styles.subtitle}>
        Kindly check the following Scheme Name and {"\n"}
        KYC details then Click Submit{"\n"}
      </Text>
      
      {customer && (
      <View style={styles.infoBox}>
        <View style={styles.custRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{customer.CustomerName}</Text>
        </View>
        <View style={styles.custRow}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{customer.StreetName}</Text>
        </View>
        <View style={styles.custRow}>
          <Text style={styles.label}>Area</Text>
          <Text style={styles.value}>{customer.Area}</Text>
        </View>
        <View style={styles.custRow}>
          <Text style={styles.label}>City</Text>
          <Text style={styles.value}>{customer.City}</Text>
        </View>
        <View style={styles.custRow}>
          <Text style={styles.label}>State</Text>
          <Text style={styles.value}>{customer.State}</Text>
        </View>
        <View style={styles.custRow}>
          <Text style={styles.label}>Mobile Number</Text>
          <Text style={styles.value}>{customer.Mobile}</Text>        
        </View>
      </View>
    )}

    {/* Static Info */}
      {scheme && (
        <View style={styles.infoBox}>          
          <View style={styles.custRow}>
            <Text style={styles.label}>Scheme Name</Text>
            <Text style={styles.value}>{scheme.schemeName}</Text>
          </View>

          <View style={styles.custRow}>
            <Text style={styles.label}>Weight Scheme</Text>
            <Text style={styles.value}>{scheme.weightledger === 'Y' ? 'Yes' : 'No'}</Text>
          </View>
          
          <View style={styles.custRow}>
            <Text style={styles.label}>METAL</Text>
            <Text style={styles.value}>{scheme.MetalType === 'G' ? 'Gold' : 'Silver'}</Text>
          </View>
        </View>
    )}
            
      <Card style={styles.cardRate}>
        <View style={styles.cardRow}>
          <View style={styles.iconCircle}>
            <Icon name="star" size={20} color="#fff" />
          </View>      
          <View style={{ flex: 1 }}>
            <Text>{scheme?.MetalType === "G" ? "Gold Rate 22KT" : "Silver Rate"}</Text>
            <Text style={styles.rate}>₹ {rate}/grams</Text>
          </View>      
        </View>
      </Card>

      {(schemename === "1" || schemename === "3") ? (
        <View style={{ marginHorizontal: 15, marginBottom: 10 }}>
          <Text style={{ color: "#660606", fontWeight: "bold", marginBottom: 8 }}>Select Amount (₹)</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[1000, 2000, 3000, 4000, 5000, 10000, 15000, 20000, 25000].map((amt) => (
              <Button
                key={amt}
                mode={amount === String(amt) ? "contained" : "outlined"}
                onPress={() => setAmount(String(amt))}
                style={{ borderColor: "#660606", backgroundColor: amount === String(amt) ? "#660606" : "#fff" }}
                labelStyle={{ fontSize: 12, color: amount === String(amt) ? "#fff" : "#660606" }}
              >
                ₹{amt.toLocaleString()}
              </Button>
            ))}
          </View>
        </View>
      ) : (
        <TextInput
          label="Amount (₹) - Min ₹100"
          value={amount}
          onChangeText={(val) => setAmount(val)}
          textColor="#3f0125"
          keyboardType="number-pad"
          style={styles.input}
        />
      )}
            
      {/* ✅ ADD INPUTS */}
      <View style={styles.inputContainer}>
        <Text textAlign="center" style={{ color: "#660606", fontWeight: "bold", marginBottom: 5, fontSize:16,textAlign: "center", }}>
          Accumulated Weight: {total.toFixed(3)}
        </Text>
      </View>

      {bonuswt > 0 && (
        <View style={styles.inputContainer}>
          <Text style={{ color: "#660606", fontWeight: "bold", marginBottom: 5, fontSize: 16, textAlign: "center", }} >
            Bonus Weight: {bonuswt.toFixed(3)} </Text>
        </View>
      )}

      {/* Checkbox */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => setChecked(!checked)}
        />
        <Text style={styles.checkboxText}>
          I confirm that I am over 18 years of age.
        </Text>
      </View>

      {/* Loading Animation */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#660606" />
          <Text style={styles.loadingText}>Processing Payment...</Text>
        </View>
      )}
      
      {/* Button */}
      <Button
        mode="contained" onPress={openRazorpay} disabled={!amount || parseFloat(amount) === 0 || isLoading}
        style={styles.button}
        contentStyle={{ paddingVertical: 8 }}
      >
        <Text style={styles.text}>Submit</Text>
      </Button>

    </ScrollView>
    </PaperProvider>
  );
}

export default NewScheme;

const styles = StyleSheet.create({
container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
    flexGrow: 1
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color:"#660606",
    textAlign: "center",
    marginBottom: 10
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    lineHeight: 20
  },
  infoBox: {
    marginBottom: 15
  },
  label: {
    width:120,
    color: "#888",
    marginTop: 4
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom:"10",
    color:"#8d0052", 
    fontWeight:"bold", 
  },
  input: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    color:"#120b70",
  },
  checkboxText: {
    flex: 1,
    backgroundColor: "#fff",
    color:"#120b70",
  },
  button: {
    backgroundColor: "#681905",
    borderRadius: 6,
    color: "#ffffff",
  },
text: {
    color: '#fff',
    backgroundColor: '#6e1e1e',
    fontSize: 16,
    width: 150,
    height: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f47c20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  rate: {
    color: "#f47c20",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardRate: {
    margin: 15,
    padding: 10,
    borderRadius: 10,
  },
  custRow:{
  flexDirection:"row",
  marginBottom:3
},
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#660606",
    fontWeight: "bold",
  },

});