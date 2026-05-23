import React, { useEffect, useState } from "react";
import { BASE_URL } from '../config';
import { View, StyleSheet, FlatList, BackHandler, ActivityIndicator } from "react-native";
import { Provider as PaperProvider, Card, Appbar, Button, Text, TextInput } from "react-native-paper";
import RazorpayCheckout from 'react-native-razorpay';
import { useFocusEffect } from '@react-navigation/native';

function PayNow({ route, navigation }) {

const accno = route?.params?.accno;
const mobile = route?.params?.mobile;

  // ✅ ADD THIS
  const [customer, setCustomer] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [total, setTotal] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [bonuswt, setBonus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
      loadCustomer();
      loadLedger();
    }, []);
  
    const loadCustomer = async () => {
  try {
    const response = await fetch(`${BASE_URL}/customerLedgerDet?accno=${accno}`);
    const data = await response.json();

    console.log("Customer:", data);

    // ✅ convert object to array
    setCustomer(data ? [data] : []);

  } catch (error) {
    console.log("Customer Load Error:", error);
  }
};

const loadLedger = async () => {
  try {
    const response = await fetch(`${BASE_URL}/customerPayment?accno=${accno}`);
    const data = await response.json();
    setLedger(data ? [data] : []);
    if (data?.AMOUNT && parseFloat(data.AMOUNT) > 0) {
      setAmount(data.AMOUNT.toString());
      setIsLocked(true);   // 🔒 lock input
    } else {
      setIsLocked(false);  // 🔓 allow editing
    }

    // ✅ AUTO SET RATE (Gold or Silver)
    if (data?.WEIGHTLEDGER === "Y") {
    if (data?.METALTYPE === "GOLD") {
      setRate(data.GOLDRATE?.toString() || "0");
    } else if (data?.METALTYPE === "SILVER") {
      setRate(data.SILVERRATE?.toString() || "0");
    }
  }
  } catch (error) {
    console.log("Ledger Load Error:", error);
  }
};

  useEffect(() => {
  const amt = parseFloat(amount);
  const rt = parseFloat(rate);

  if (!isNaN(amt) && !isNaN(rt) && rt > 0) {
    const accumulatedWeight = amt / rt;
    setTotal(accumulatedWeight);

    // ✅ Get scheme name from customer data (preferred) or ledger data (fallback)
    const customerSchemeName = customer[0]?.schemename || "";
    const ledgerSchemeName = ledger[0]?.SCHEMENAME || "";
    const schemeName = (customerSchemeName || ledgerSchemeName)
      ?.toUpperCase()
      .replace(/\s/g, ""); // ✅ remove spaces

    console.log("Scheme Name Check:", { customerSchemeName, ledgerSchemeName, schemeName });

    // ✅ Check for DigiGold and DigiSilver (handles different formatting)
    const isDigiGold = schemeName?.includes("DIGIGOLD") || schemeName?.includes("DIGI") && schemeName?.includes("GOLD");
    const isDigiSilver = schemeName?.includes("DIGISILVER") || schemeName?.includes("DIGI") && schemeName?.includes("SILVER");

    if (isDigiGold || isDigiSilver) {
      const percent = getBonusPercent(customer[0]?.DATE);
      const bonusWeight = accumulatedWeight * percent;
      console.log("Bonus Calculated:", { percent, bonusWeight, accumulatedWeight });
      setBonus(bonusWeight);
    } else {
      console.log("No bonus - scheme doesn't match:", schemeName);
      setBonus(0);
    }
  } else {
    setTotal(0);
    setBonus(0);
  }

}, [amount, rate, customer, ledger]);

const getBonusPercent = (joinDate) => {
  if (!joinDate) return 0;

  let start;

  // ✅ Handle both DD-MM-YYYY and YYYY-MM-DD
  if (joinDate.includes("-")) {
    const parts = joinDate.split("-");
    if (parts[0].length === 2) {
      // DD-MM-YYYY
      start = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    } else {
      // YYYY-MM-DD
      start = new Date(joinDate);
    }
  } else {
    start = new Date(joinDate);
  }

  const today = new Date();
  const days = Math.floor((today - start) / (1000 * 60 * 60 * 24));

  if (days <= 75) return 0.09;
  if (days <= 150) return 0.065;
  if (days <= 225) return 0.04;
  if (days <= 300) return 0.0125;

  return 0;
};

const openRazorpay = () => {
  if (!amount || parseFloat(amount) === 0) {
    alert("Enter valid amount");
    return;
  }

  const options = {
    description: 'Gold Scheme Payment',
    image: './assets/logo.png', // optional
    currency: 'INR',
    key: 'rzp_test_SW9hikuzpUiqcY', // 🔴 Replace with your Razorpay Key
    amount: parseFloat(amount) * 100, // in paise
    name: 'GS Thanga Maligai',
    prefill: {
      email: 'pkmjewellery@gmail.com',
      contact: '9942251355',
      name: customer[0]?.customername || '',
    },
    theme: { color: '#064101' },
  };

  RazorpayCheckout.open(options)
    .then(async (data) => {
      setIsLoading(true);

  try {
    const paymentPayload = {
      payment_id: data.razorpay_payment_id,
      order_id: null,
      amount: amount,
      accno: accno,
      metal: ledger[0]?.METALTYPE,
      rate: rate,
      weight: parseFloat(total.toFixed(3)),
      installment: customer[0]?.UNPAID || 1,
      customername: customer[0]?.customername,
      address: customer[0]?.StreetName,
      area: customer[0]?.area,
      city: customer[0]?.city,
      mobile: customer[0]?.mobile,
      bonus: parseFloat(bonuswt.toFixed(3)),
    };

    console.log("Payment Payload Being Sent:", paymentPayload);

    const response = await fetch(`${BASE_URL}/payment-success`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentPayload),
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
      <Appbar.Header style={{ backgroundColor: '#064101' }}>
        <Appbar.Action icon="arrow-left" color="#ffffff" onPress={() => navigation.goBack()} />
        <Appbar.Content title="GS Thanga Maligai" color="#ffffff" />
      </Appbar.Header>

      <View style={styles.container}>
        
        <FlatList
              ListHeaderComponent={
                <>
                  <Text style={styles.title}>Payment Screen</Text>
                  <Text style={styles.text}>{accno}</Text>

                  {/* CUSTOMER DETAILS */}
                  {customer.length > 0 && (
                    <Card style={styles.card}>
                      <Card.Content>

                        <View style={styles.custRow}>
                          <Text style={styles.label}>Scheme</Text>
                          <Text style={styles.value}>: {customer[0].schemename}</Text>
                        </View>

                        <View style={styles.custRow}>
                          <Text style={styles.label}>Name</Text>
                          <Text style={styles.value}>: {customer[0].customername}</Text>
                        </View>

                        <View style={styles.custRow}>
                          <Text style={styles.label}>Mobile</Text>
                          <Text style={styles.value}>: {customer[0].mobile}</Text>
                        </View>
                        
                      <View style={styles.custRow}>
                        <Text style={styles.label}>Join Date</Text>
                        <Text style={styles.value}>: {customer[0].DATE}</Text>
                      </View>

                      <View style={styles.custRow}>
                        <Text style={styles.label}>Street</Text>
                        <Text style={styles.value}>: {customer[0].StreetName}</Text>
                      </View>

                      <View style={styles.custRow}>
                        <Text style={styles.label}>Area</Text>
                        <Text style={styles.value}>: {customer[0].area}</Text>
                      </View>

                      <View style={styles.custRow}>
                        <Text style={styles.label}>City</Text>
                        <Text style={styles.value}>: {customer[0].city}</Text>
                      </View>

                      <View style={styles.custRow}>
                        <Text style={styles.label}>Installment</Text>
                        <Text style={styles.value}>: {customer[0].UNPAID}</Text>
                      </View>

                      </Card.Content>
                    </Card>
                  )}

                  {/* LEDGER */}
                  {ledger.length > 0 && (
                    <Card style={styles.card}>
                      <Card.Content>

                        <View style={styles.custRow}>
                          <Text style={styles.label}>METAL</Text>
                          <Text style={styles.value}>: {ledger[0].METALTYPE}</Text>
                        </View>

                        <View style={styles.row}>
                          <TextInput
                            label="Amount (₹)"
                            value={amount}
                            textColor="#6e1e1e"
                            onChangeText={setAmount}
                            keyboardType="number-pad"
                            style={[
                                  styles.halfInput,
                                  isLocked && { backgroundColor: "#eee" }
                                ]}
                            editable={!isLocked}
                          />

                          <TextInput
                            label="Rate (₹/g)"
                            value={rate}
                            textColor="#6e1e1e"
                            style={styles.halfInput}
                            editable={false}
                          />
                        </View>

                      </Card.Content>
                    </Card>
                  )}

                  {/* TOTAL */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.totalText}>
                      Accumulated Weight: {total.toFixed(3)}
                    </Text>
                  </View>

                  {bonuswt > 0 && (
                    <View style={styles.inputContainer} textAlign="center" >
                      <Text style={styles.totalText} textAlign="center" >
                        Bonus Weight: {bonuswt.toFixed(3)}
                      </Text>
                    </View>
                  )}

                  {/* BUTTON */}
                  {isLoading && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#660606" />
                      <Text style={styles.loadingText}>Processing Payment...</Text>
                    </View>
                  )}
                  <Button
                    mode="contained"
                    onPress={openRazorpay}
                    disabled={!amount || parseFloat(amount) === 0 || isLoading}
                  >
                    Proceed Payment
                  </Button>
                </>
              }
              data={[]}   // 🔴 important (no list items needed)
              keyExtractor={() => "dummy"}
            />
        
      </View>
    </PaperProvider>
  );
}

export default PayNow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  title: {
    fontSize: 22,
    backgroundColor: "#660606",
    color: "#fff",
    marginBottom: 20,
    padding: 10,
    textAlign: "center"
  },
  text: {
    fontSize: 25,
    fontWeight:'bold',
    textAlign:"center",
    marginBottom: 10,
    color:"#64071f"
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 15,
    color: "#660606",
  },
  input: {
    borderWidth:1,
    backgroundColor:"#9b1e1e",
    color: "#660606",
    marginBottom: 15,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#660606",
    marginTop: 5,
    textAlign: "center"
  },
  card:{
    marginBottom:5,
    borderWidth:1,
    backgroundColor:"#f5f5f5",
  },
  custRow:{
  flexDirection:"row",
  marginBottom:3
},
row: {
  flexDirection: "row",
  marginTop:10,
  justifyContent: "space-between",
  gap: 10, // if not supported, use margin
},

halfInput: {
  flex: 1,
  backgroundColor: "#fff",
  color:"#421300",
  borderWidth:1,
  borderCurve:50,
},
label:{
  width:80,
  fontSize:14,  
  color:"#2e0663"
},

value:{
  flex:1,
  fontSize:14,
  fontWeight:"bold",
  color:"#0f5025"
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