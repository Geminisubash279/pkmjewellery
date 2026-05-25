import React, { useEffect, useState } from "react";
import { BASE_URL } from '../config';
import { View, FlatList, StyleSheet, BackHandler } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider as PaperProvider, Appbar, Card } from "react-native-paper";

function Ledger({ route, navigation }) {

  const accno = route?.params?.accno;
  const [ledger, setLedger] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalwt, setTotal1] = useState(0);
  const [totalBonus, setTotalBonus] = useState(0);
  const [customer, setCustomer] = useState(null);

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
    setCustomer(data);
  } catch (error) {
    console.log("Customer Load Error:", error);
  }
};

  const loadLedger = async () => {
    const response = await fetch(`${BASE_URL}/ledger?accno=${accno}`);
    const data = await response.json();

    console.log("Ledger Data Received:", data);  
    setLedger(data);

    let sum = 0;
    data.forEach(item => {
      sum += Number(item.AMOUNT);
    });

    let sumwt = 0;
    data.forEach(item => {
      sumwt += Number(item.WEIGHT);
    });

    let sumbwt = 0;
    data.forEach(item => {
      sumbwt += Number(item.BONUSWEIGHT);
    });
    
    setTotal(sum);
    setTotal1(sumwt);
    setTotalBonus(sumbwt);
  };

  const add365Days = (dateString) => {
  if (!dateString) return "";

  const [day, month, year] = dateString.split("-");

  // Create date in correct format (YYYY, MM-1, DD)
  const date = new Date(year, month - 1, day);

  // Add 365 days
  date.setDate(date.getDate() + 365);

  // Convert back to DD-MM-YYYY
  const newDay = String(date.getDate()).padStart(2, "0");
  const newMonth = String(date.getMonth() + 1).padStart(2, "0");
  const newYear = date.getFullYear();

  return `${newDay}-${newMonth}-${newYear}`;
};

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: '#064101' }}>
        <Appbar.Action
          icon="arrow-left"
          color="#ffffff"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title="PKM Jewellery" color="#ffffff" />
      </Appbar.Header>

      <View style={styles.container}>

        {/* Customer Details Card */}
        {customer && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.custRow}>
                <Text style={styles.label}>Scheme</Text>
                <Text style={styles.value}>: {customer.schemename}</Text>
              </View>

              <View style={styles.custRow}>
                <Text style={styles.label}>Maturity</Text>
                <Text style={styles.value}>: {add365Days(customer.DATE)}</Text>
              </View>

              <View style={styles.custRow}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>: {customer.customername}</Text>
              </View>

              <View style={styles.custRow}>
                <Text style={styles.label}>Street</Text>
                <Text style={styles.value}>: {customer.StreetName}</Text>
              </View>

              <View style={styles.custRow}>
                <Text style={styles.label}>Area</Text>
                <Text style={styles.value}>: {customer.area}</Text>
              </View>

              <View style={styles.custRow}>
                <Text style={styles.label}>City</Text>
                <Text style={styles.value}>: {customer.city}</Text>
              </View>

              <View style={styles.custRow}>
                <Text style={styles.label}>Mobile</Text>
                <Text style={styles.value}>: {customer.mobile}</Text>
              </View>

            </Card.Content>
          </Card>
        )}

        {/* Table Header */}
        {/* Header */}
                <View style={styles.headerRow}>
                  <Text style={styles.headerCell}>Inst</Text>
                  <Text style={styles.headerCell}>Date</Text>
                  <Text style={styles.headerCell}>Amount</Text>                  
                  <Text style={styles.headerCell}>Rate</Text>
                  <Text style={styles.headerCell}>Weight</Text>
                  <Text style={styles.headerCell}>Bonus</Text>
                </View>
        <FlatList
            data={ledger}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableContainer}>     
                <View style={styles.tableRow}>
                  <Text style={styles.cell}>{item.INSTALLMENT}</Text>
                  <Text style={styles.cell}>{item.DATE}</Text>
                  <Text style={styles.cell}>₹ {item.AMOUNT}</Text>                  
                  <Text style={styles.cell}>{item.RATE}</Text>
                  <Text style={styles.cell}>{item.WEIGHT}</Text>
                  <Text style={styles.cell}> {(item.BONUSWEIGHT|| 0).toFixed(3)}</Text>
                </View>
              </View>
            )}
          />

        {/* Total */}
        <View style={{ marginTop: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 8 }}>
          <Text style={{ color: "#09750e", fontWeight: "bold", marginBottom: 8 }}>Bonus Weight {totalBonus.toFixed(3)} gms</Text>
          <Text style={{ color: "#660606", marginBottom: 7 }}>*Conditions Apply</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total Amount: </Text>
          <Text style={styles.totalValue}>₹ {total.toLocaleString()}</Text>
          <Text style={styles.totalValue}>{(totalwt || 0).toFixed(3)} gms</Text>    
        </View>
      </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default Ledger;

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 15,
  paddingBottom: 60, // 👈 ADD THIS
},

  card:{
    backgroundColor:"#ffffff",
    marginBottom:15
  },

  custText:{
    fontSize:16,
    marginBottom:3
  },

  title:{
    fontSize:22,
    fontWeight:"bold",
    marginBottom:10
  },

  headerRow:{
    flexDirection:"row",
    backgroundColor:"#420404"
  },

  
  tableRow:{
    flexDirection:"row",
    color:"#063a52",
  },

  rowEven:{
    backgroundColor:"#f2f2f2"
  },

  rowOdd:{
    backgroundColor:"#ffffff"
  },

  tableContainer: {
  marginVertical: 8,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  overflow: "hidden",
},

headerRow: {
  flexDirection: "row",
  backgroundColor: "#660606",
  paddingVertical: 6,
},

headerCell: {
  flex: 1,
  color: "#fff",
  textAlign: "center",
  fontSize: 12,
},

tableRow: {
  flexDirection: "row",
  backgroundColor: "#fff",
  paddingVertical: 6,
},

cell: {
  flex: 1,
  textAlign: "center",
  color: "#660606",
  fontSize: 10,
},
  
  totalRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:10,
    padding:10,
    color: "#660606",
    backgroundColor:"#ddd"
  },

  totalText:{
    fontSize:18,
    fontWeight:"bold",
    color: "#660606",
  },

  totalValue:{
    fontSize:18,
    fontWeight:"bold",
    color: "#660606",
  },
  custRow:{
  flexDirection:"row",
  marginBottom:4
},

label:{
  width:80,
  fontSize:16,  
  color:"#6c558a"
},

value:{
  flex:1,
  fontSize:16,
  fontWeight:"bold",
  color:"#0f5025"
},

});
