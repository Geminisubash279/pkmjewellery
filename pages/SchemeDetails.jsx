import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, BackHandler } from "react-native";
import { Text, Button, Appbar } from "react-native-paper";

export default function SchemeDetails({ route, navigation }) {
  const { scheme, schemeId, mobile } = route?.params || {};
  const [lang, setLang] = useState("ta");

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const titles = {
    gold: "DigiGold Scheme",
    silver: "DigiSilver Scheme",
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <Appbar.Header style={{ backgroundColor: "#064101" }}>
        <Appbar.Action icon="arrow-left" color="#ffffff" onPress={() => navigation.goBack()} />
        <Appbar.Content title={titles[scheme] || "Scheme Details"} color="#ffffff" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Language Toggle */}
        <View style={styles.langRow}>
          <Text
            style={[styles.langBtn, lang === "ta" && styles.langBtnActive]}
            onPress={() => setLang("ta")}>
            தமிழ்
          </Text>
          <Text
            style={[styles.langBtn, lang === "en" && styles.langBtnActive]}
            onPress={() => setLang("en")}>
            English
          </Text>
        </View>

        {/* ===== Bonus Scheme TAMIL ===== */}
        {scheme === "bonus" && lang === "ta" && (
          <View>
            <Text style={styles.title}>போனஸ் திட்டம் </Text>
            <Text style={styles.body}>போனஸ் திட்டம் என்பது 11 மாத கால முறையான சேமிப்பு திட்டமாகும். இது குறிப்பிடத்தக்க போனஸ் மற்றும் சலுகைகளுடன் தங்கம் சேமிக்க உங்களுக்கு உதவும் வகையில் வடிவமைக்கப்பட்டுள்ளது.</Text>
            <Text style={styles.head}>சேரும் முறை மற்றும் மீட்பு முறை</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}><Text style={[styles.cell, styles.header]}>வழிமுறை</Text><Text style={[styles.cell, styles.header]}>நிலை 1</Text><Text style={[styles.cell, styles.header]}>நிலை 2</Text><Text style={[styles.cell, styles.header]}>நிலை 3</Text></View>
              <View style={styles.tableRow}><Text style={styles.cell}>சே!ருவதற்கு</Text><Text style={styles.cell}>"Join Now" கிளிக்</Text><Text style={styles.cell}>மாதத் தவணையைத் தேர்வு செய்யவும்</Text><Text style={styles.cell}>100% சேரும் போனஸை சரிபார்க்கவும்</Text></View>
              <View style={styles.tableRow}><Text style={styles.cell}>மீட்பதற்கு</Text><Text style={styles.cell}>ஷோரூம் வரவும்</Text><Text style={styles.cell}>நகையைத் தேர்வு செய்யவும்</Text><Text style={styles.cell}>OTP சமர்ப்பித்து பெற்றுக்கொள்ளவும்</Text></View>
            </View>
            <Text style={styles.head}>முக்கிய அம்சங்கள் மற்றும் காலவரிசை</Text>
            <Text style={styles.body}>•	தகுதி: 18 வயது அல்லது அதற்கு மேற்பட்டவர்கள் சேரலாம்.</Text>
            <Text style={styles.body}>•	200% போனஸ்: தவணை காலம் முடிந்த பிறகு உங்கள் ஒரு மாத தவணைத் தொகையில் 200% போனஸைப் பெறுங்கள்.</Text>
            <Text style={styles.body}>      1000*11+11000+(1000*2=2000)=13000</Text>
            <Text style={styles.body}>      2000*11=22000+(2000*2=4000)=26000</Text>
            <Text style={styles.body}>•	முதிர்வு: இத்திட்டம் தொடங்கிய 330-வது நாளில் முதிர்வடையும்.</Text>
            <Text style={styles.body}>•	மீட்பு காலம்: முதிர்வுக்குப் பிறகு 30 நாட்கள் லாக்-இன் (Lock-in) காலம் உண்டு. லாக்-இன் காலம் முடிந்த பிறகு 35 நாட்களுக்குள் சேமிப்பை நகையாக மாற்ற வேண்டும்.</Text>            <Text style={styles.body}>•	தங்க விலை: தவணைகள் பண மதிப்பாகச் சேமிக்கப்படும்; நகையை மீட்கும் நாளில் நிலவும் சந்தை விலையில் தங்கம் கணக்கிடப்படும்.</Text>
            <Text style={styles.head}>பலன்கள் மற்றும் சேமிப்பு</Text>
            <Text style={styles.body}>•	0% செய்கூலி: செய்கூலியில் (Making Charges) 100% தள்ளுபடி உண்டு (சேதாரம்/Wastage பொருந்தும்).</Text>
            <Text style={styles.body}>•	பாதுகாப்பு: ஆன்லைன் மூலம் சேருபவர்கள் OTP முறை மூலம் பாதுகாப்பாகப் பயன்படுத்தலாம் (புத்தகம் தேவையில்லை). நேரடி உறுப்பினர்களுக்கு சேமிப்பு புத்தகம் வழங்கப்படும்</Text>
            <Text style={styles.head}>முக்கிய நிபந்தனைகள்</Text>
            <Text style={styles.body}>•	ரொக்கத் திரும்பப் பெற முடியாது: சேமிப்பை தங்க நகையாக மட்டுமே மீட்க முடியும்; எக்காரணம் கொண்டும் பணம் திரும்ப வழங்கப்படமாட்டாது.</Text>
            <Text style={styles.body}>•	கூடுதல் கட்டணங்கள்: சேதாரம் (Wastage), ஜிஎஸ்டி (GST) மற்றும் ஹால்மார்க் கட்டணங்களை வாடிக்கையாளர் செலுத்த வேண்டும்.</Text>
            <Text style={styles.body}>•	முன்கூட்டியே முடித்தல்: 330 நாட்களுக்கு முன்பே திட்டத்தை முடித்தால், வழங்கப்பட்ட போனஸ் சலுகைகள் அனைத்தும் ரத்து செய்யப்படும்.</Text>
            <Text style={styles.body}>•	தீர்வுகள்: திட்டம் தொடர்பான புகார்கள் அல்லது சந்தேகங்கள் கடையில் நேரில் மட்டுமே தீர்க்கப்படும்.</Text>
          </View>
        )}

        {/* ===== DIGISILVER ENGLISH ===== */}
        {scheme === "bonus" && lang === "en" && (
          <View>
            <Text style={styles.title}>Bonus Scheme Details</Text>
            <Text style={styles.body}>The Bonus scheme is a systematic 11-month savings plan designed to help you accumulate gold with significant bonuses and rewards.</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}><Text style={[styles.cell, styles.header]}>PROCESS</Text><Text style={[styles.cell, styles.header]}>STEP 1</Text><Text style={[styles.cell, styles.header]}>STEP 2</Text><Text style={[styles.cell, styles.header]}>STEP 3</Text></View>
              <View style={styles.tableRow}><Text style={styles.cell}>TO JOIN</Text><Text style={styles.cell}>Click "Join Now"</Text><Text style={styles.cell}>Select monthly installment</Text><Text style={styles.cell}>Verify 100% Joining Bonus</Text></View>
              <View style={styles.tableRow}><Text style={styles.cell}>TO REDEEM</Text><Text style={styles.cell}>Visit showroom</Text><Text style={styles.cell}>Choose your jewellery</Text><Text style={styles.cell}>Submit OTP to collect</Text></View>
            </View>
            <Text style={styles.head}>Key Features & Timeline</Text>
            <Text style={styles.body}>•	Eligibility: Must be 18 years or older.</Text>
            <Text style={styles.body}>•	200% bonus: Enjoy a 200% bonus on your instalment amount after chit completion, ie </Text>
            <Text style={styles.body}>      1000*11+11000+(1000*2=2000)=13000</Text>
            <Text style={styles.body}>      2000*11=22000+(2000*2=4000)=26000</Text>
            <Text style={styles.body}>•	Maturity: The scheme matures on the 330th day.</Text>
            <Text style={styles.body}>•	Lock-in & Redemption: There is a 30-day lock-in period post-maturity. You must redeem your savings for jewellery within 35 days after the lock-in period ends.</Text>
            <Text style={styles.body}>•	Gold Rate: Installments are saved as cash value; gold is purchased at the prevailing market rate on the day of redemption.</Text>
            <Text style={styles.head}>Benefits & Savings</Text>
            <Text style={styles.body}>•	0% Making Charges: Enjoy a 100% discount on Making Charges (Wastage charges still apply).</Text>
            <Text style={styles.body}>•	Security: Digital members use an OTP system (no passbook needed), while in-store members use a physical passbook.</Text>
            <Text style={styles.head}>Important Terms</Text>
            <Text style={styles.body}>•	No Cash Refunds: Savings can only be redeemed as gold jewellery; cash refunds are not permitted.</Text>
            <Text style={styles.body}>•	Additional Costs: Customers are responsible for Wastage, GST, and Hallmark charges.</Text>
            <Text style={styles.body}>•	Early Closure: Withdrawing before 330 days will result in the forfeiture of all bonuses.</Text>
            <Text style={styles.body}>•	Disputes: All disputes regarding regulations or benefits will be handled in-person at the store only.</Text>
          </View>
        )}

        {/* ===== Gold Scheme TAMIL ===== */}
        {scheme === "gold" && lang === "ta" && (
          <View>
            <Text style={styles.title}>தங்க விருட்சம் திட்டம்</Text>
            <Text style={styles.body}>G.S. தங்க மாளிகையின் 'தங்க விருட்சம்' திட்டம் என்பது 15 மாத (450 நாட்கள்) கால முறையான தங்கம் சேமிப்பு திட்டமாகும். இது தங்க விலை உயர்விலிருந்து உங்கள் முதலீட்டைப் பாதுகாப்பதோடு, நகை வாங்கும்போது செய்கூலி மற்றும் சேதாரம் இல்லாமல் அதிகப்படியான லாபத்தை வழங்குகிறது.</Text>
            <Text style={styles.head}>சேரும் முறை மற்றும் மீட்பு முறை</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}><Text style={[styles.cell, styles.header]}>வழிமுறை</Text><Text style={[styles.cell, styles.header]}>நிலை 1</Text><Text style={[styles.cell, styles.header]}>நிலை 2</Text><Text style={[styles.cell, styles.header]}>நிலை 3</Text></View>
              <View style={styles.tableRow}><Text style={styles.cell}>சேருவதற்கு</Text><Text style={styles.cell}>"Join Now" கிளிக்</Text><Text style={styles.cell}>மாதத் தவணையைத் தேர்வு செய்யவும்</Text><Text style={styles.cell}>e-passbook-இல் தங்க எடையைச் சரிபார்க்கவும்</Text></View>
              <View style={styles.tableRow}><Text style={styles.cell}>மீட்பதற்கு</Text><Text style={styles.cell}>ஷோரூம் வரவும்</Text><Text style={styles.cell}>நகையைத் தேர்வு செய்யவும்</Text><Text style={styles.cell}>OTP சமர்ப்பித்து பெற்றுக்கொள்ளவும்</Text></View>
            </View>
            <Text style={styles.head}>முக்கிய அம்சங்கள்</Text>
             <Text style={styles.body}>•	தகுதி: 18 வயது அல்லது அதற்கு மேற்பட்டவர்கள் சேரலாம்.</Text>
             <Text style={styles.body}>•	தவணைகள்: 15 மாத நிலையான தவணைகள் (குறைந்தபட்சம்: ₹1,000 | அதிகபட்சம்: ₹10,000 | ₹500-ன் மடங்குகளில்). ஆரம்ப தவணை தொகையை மாற்ற முடியாது.</Text>
             <Text style={styles.body}>•	தங்கம் சேமிப்பு: நீங்கள் செலுத்தும் ஒவ்வொரு தவணையும், அன்றைய சந்தை விலையின் அடிப்படையில் உடனடியாக 22-காரட் தங்க எடையாக மாற்றப்பட்டு உங்கள் கணக்கில் சேர்க்கப்படும்.</Text>
             <Text style={styles.body}>•	காலவரிசை: இத்திட்டம் தொடங்கிய 450-வது நாளில் முதிர்வடையும். அதனைத் தொடர்ந்து 30 நாட்கள் லாக்-இன் (Lock-in) காலம் உண்டு. லாக்-இன் காலம் முடிந்த பிறகு 35 நாட்களுக்குள் நகையை மீட்க வேண்டும்.</Text>
             <Text style={styles.body}>•	விலை பாதுகாப்பு: பணம் செலுத்தும் போதே தங்கம் ஒதுக்கப்படுவதால், எதிர்கால விலை ஏற்றத்திலிருந்து உங்கள் சேமிப்பு பாதுகாக்கப்படுகிறது.</Text>
             <Text style={styles.head}>பலன்கள் மற்றும் நிபந்தனைகள்</Text>
             <Text style={styles.body}>•	100% தள்ளுபடி: உங்கள் தங்க நகைகளுக்கு 0% செய்கூலி (Making Charges) மற்றும் 0% சேதாரம் (Wastage/VA) சலுகை உண்டு.</Text>
             <Text style={styles.body}>•	பாதுகாப்பு: ஆன்லைன் உறுப்பினர்கள் OTP மூலம் நகையை மீட்கலாம்; புத்தகம் வைத்திருப்பவர்கள் மீட்பின் போது அதைச் சமர்ப்பிக்க வேண்டும்.</Text>
             <Text style={styles.body}>•	ரொக்கத் திரும்பப் பெற முடியாது: அனைத்து தவணைகளும் நகையாக மட்டுமே மீட்கப்படும்; பணம் திரும்ப வழங்கப்படமாட்டாது.</Text>
             <Text style={styles.body}>•	முன்கூட்டியே முடித்தல்: 450 நாட்களுக்கு முன்பே திட்டத்தை முடித்தால், சலுகைகள் அனைத்தும் ரத்து செய்யப்படும் மற்றும் ரத்து கட்டணம் (Cancellation fee) வசூலிக்கப்படலாம்.</Text>
             <Text style={styles.body}>•	கூடுதல் கட்டணங்கள்: ஜிஎஸ்டி (GST), ஹால்மார்க் மற்றும் கற்களுக்கான கட்டணங்களை வாடிக்கையாளர் செலுத்த வேண்டும்.</Text>
             <Text style={styles.body}>•	சலுகைகள் பொருந்தும்: 15 மாத காலத்தையும் முழுமையாக முடிப்பவர்களுக்கு மட்டுமே இத்திட்டத்தின் பலன்கள் கிடைக்கும்.</Text>
             <Text style={styles.body}>•	தீர்வுகள்: திட்டம் தொடர்பான புகார்கள் அல்லது சந்தேகங்கள் கடையில் நேரில் மட்டுமே தீர்க்கப்படும்.</Text>            
          </View>
        )}

        {/* ===== DIGISILVER ENGLISH ===== */}
        {scheme === "gold" && lang === "en" && (
          <View>
            <Text style={styles.title}>Thanga Viruksham Scheme Details</Text>
            <Text style={styles.body}>The 'Thanga Viruksham' scheme by PKM Jewellery is a 15-month (450-day) systematic gold savings plan designed to protect your investment from price hikes while offering maximum savings and 0% wastages and making charges on jewellery purchases.</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}><Text style={[styles.cell, styles.header]}>PROCESS</Text><Text style={[styles.cell, styles.header]}>STEP 1</Text><Text style={[styles.cell, styles.header]}>STEP 2</Text><Text style={[styles.cell, styles.header]}>STEP 3</Text></View>
              <View style={styles.tableRow}><Text style={styles.cell}>TO JOIN</Text><Text style={styles.cell}>Click "Join Now"</Text><Text style={styles.cell}>Select monthly installment</Text><Text style={styles.cell}>Verify gold weight in e-passbook</Text></View>
              <View style={styles.tableRow}><Text style={styles.cell}>TO REDEEM</Text><Text style={styles.cell}>Visit showroom</Text><Text style={styles.cell}>Choose your jewellery</Text><Text style={styles.cell}>Submit OTP to collect</Text></View>
            </View>
              <Text style={styles.head}>Key Features</Text>
              <Text style={styles.body}>•	Eligibility: Open to individuals aged 18+.</Text>
              <Text style={styles.body}>•	Installments: 15 fixed monthly payments (Min: ₹1,000 | Max: ₹10,000 | Multiples of ₹500). The initial amount cannot be altered.</Text>
              <Text style={styles.body}>•	Gold Accumulation: Each payment is instantly converted into 22-karat gold weight based on that day’s market rate.</Text>
              <Text style={styles.body}>•	Timeline: Matures on the 450th day, followed by a 30-day lock-in. Redemption must be completed within 35 days after the lock-in ends.</Text>
              <Text style={styles.body}>•	Price Protection: Since gold is credited at the time of payment, your savings are shielded from future price increases.</Text>
              <Text style={styles.head}>Benefits & Rules</Text>
              <Text style={styles.body}>•	100% Discount: Enjoy Zero Making Charges and Zero Wastage (VA) on your jewellery.</Text>
              <Text style={styles.body}>•	Security: Digital members redeem via OTP; physical passbook holders must surrender the book at redemption.</Text>
              <Text style={styles.body}>•	No Cash Refunds: All installments must be redeemed as jewellery; no cash refunds are permitted.</Text>
              <Text style={styles.body}>•	Early Termination: Closing the scheme before 450 days voids all benefits and may incur a cancellation fee.</Text>
              <Text style={styles.body}>•	Additional Costs: Customers are responsible for GST, Hallmark, and stone charges.</Text>
              <Text style={styles.body}>•	Benefits apply: Customers are required to finish the tenure of 15 months for the benefits to apply. Withdrawing early means forfeiture of said benefits.</Text>
              <Text style={styles.body}>•	Disputes: All regulatory or benefit disputes are handled in-store and in-person only.</Text>
          </View>
        )}

        {parseInt(schemeId) > 0 && (
          <Button
            mode="contained"
            style={styles.btn}
            textColor="#fff"
            onPress={() => navigation.navigate("NewScheme", { mobile, schemeid: schemeId })}>
            Proceed
          </Button>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 30,
  },
  langRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    gap: 15,
  },
  langBtn: {
    fontSize: 15,
    color: "#064101",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#064101",
    borderRadius: 20,
  },
  langBtnActive: {
    backgroundColor: "#064101",
    color: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#064101",
    marginBottom: 10,
  },
  head: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#064101",
    marginTop: 12,
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    color: "#064101",
    marginBottom: 5,
    lineHeight: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#ccc",
    padding: 6,
    fontSize: 10,
    color: "#333",
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#f0e0e0",
    color: "#064101",
  },
  btn: {
    backgroundColor: "#064101",
    marginTop: 25,
    borderRadius: 8,
  },
});
