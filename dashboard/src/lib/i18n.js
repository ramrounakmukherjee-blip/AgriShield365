// AgriShield 365 — language system.
// Four languages: English, Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी).

export const LANGUAGES = [
  { id: "en", label: "English", native: "English", tagline: "India's global language" },
  { id: "hi", label: "Hindi", native: "हिन्दी", tagline: "हिन्दी — भारत की राष्ट्रभाषा" },
  { id: "bn", label: "Bengali", native: "বাংলা", tagline: "বাংলা — ভারতের পূর্বাঞ্চলের ভাষা" },
  { id: "mr", label: "Marathi", native: "मराठी", tagline: "मराठी — महाराष्ट्राची भाषा" },
];

const t = {
  // ---------------- Language picker ----------------
  picker: {
    title: {
      en: "Choose your language",
      hi: "अपनी भाषा चुनें",
      bn: "আপনার ভাষা বেছে নিন",
      mr: "तुमची भाषा निवडा",
    },
    subtitle: {
      en: "You can change it anytime from the 🌐 button.",
      hi: "इसे कभी भी 🌐 बटन से बदल सकते हैं।",
      bn: "যেকোনো সময় 🌐 বোতাম থেকে এটি বদলাতে পারবেন।",
      mr: "ती कधीही 🌐 बटणावरून बदलता येते.",
    },
    continue: {
      en: "Continue in English",
      hi: "हिन्दी में आगे बढ़ें",
      bn: "বাংলায় এগিয়ে যান",
      mr: "मराठीत पुढे जा",
    },
  },

  // ---------------- Story scenes ----------------
  // story.kickers[i], story.titles[i], story.bodies[i]
  story: {
    brand: {
      en: "AgriShield 365",
      hi: "एग्रीशील्ड 365",
      bn: "অ্যাগ্রিশিল্ড 365",
      mr: "अ‍ॅग्रिशील्ड 365",
    },
    kickers: [
      {
        en: "The Season Begins",
        hi: "नई ऋतु की शुरुआत",
        bn: "নতুন ঋতুর সূচনা",
        mr: "नवीन हंगामाची सुरुवात",
      },
      {
        en: "The Fields Turn Green",
        hi: "खेत हरे-भरे",
        bn: "সবুজ হয়ে ওঠে মাঠ",
        mr: "शेत हिरवीगार होते",
      },
      {
        en: "The First Warning",
        hi: "पहली चेतावनी",
        bn: "প্রথম সতর্কতা",
        mr: "पहिला इशारा",
      },
      {
        en: "When the Sky Betrays",
        hi: "जब आसमान बेवफ़ाई करता है",
        bn: "যখন আকাশ বিশ্বাসঘাতকতা করে",
        mr: "जेव्हा आभाळ फसवते",
      },
      {
        en: "A Light in the Storm",
        hi: "तूफ़ान में एक रोशनी",
        bn: "ঝড়ের মধ্যে এক আলো",
        mr: "वादळात एक आशेचा किरण",
      },
      {
        en: "AgriShield 365",
        hi: "एग्रीशील्ड 365",
        bn: "অ্যাগ্রিশিল্ড 365",
        mr: "अ‍ॅग्रिशील्ड 365",
      },
      {
        en: "The New Harvest",
        hi: "नई फसल, नई उम्मीद",
        bn: "নতুন ফসল, নতুন আশা",
        mr: "नवीन पीक, नवी आशा",
      },
    ],
    titles: [
      {
        en: "Before the first rains,\nthere is hope.",
        hi: "पहली बारिश से पहले,\nएक उम्मीद होती है।",
        bn: "প্রথম বৃষ্টির আগে,\nথাকে একটাই আশা।",
        mr: "पहिल्या पावसाआधी,\nएक आशा असते.",
      },
      {
        en: "Tiny shoots break\nthe soil.",
        hi: "नन्हें पौधे मिट्टी से\nबाहर निकलते हैं।",
        bn: "ছোট চারারা মাটি ফুঁড়ে\nবেরিয়ে আসে।",
        mr: "लहान रोपे मातीतून\nबाहेर पडतात.",
      },
      {
        en: "Something is wrong\nwith the leaves.",
        hi: "पत्तों पर कुछ गड़बड़\nदिख रही है।",
        bn: "পাতায় যেন কিছু\nসমস্যা হয়েছে।",
        mr: "पानांवर काहीतरी\nबिघडलेले दिसते.",
      },
      {
        en: "The rain came\nlike a thief at night.",
        hi: "बारिश आई,\nजैसे रात में चोर।",
        bn: "বৃষ্টি এল যেন\nরাতের চোরের মতো।",
        mr: "पाऊस आला,\nजणू रात्रीचा चोर.",
      },
      {
        en: "“Baba, look —\nmy phone shows it coming.”",
        hi: "“बाबा, देखो —\nमेरे फ़ोन ने पहले ही बताया।”",
        bn: "“বাবা, দেখো —\nআমার ফোন আগেই জানিয়েছে।”",
        mr: "“बाबा, बघा —\nमाझ्या फोनने आधीच सांगितले.”",
      },
      {
        en: "One shield,\n365 days a year.",
        hi: "एक ढाल,\nसाल के 365 दिन।",
        bn: "একটিই ঢাল,\nবছরের ৩৬৫ দিন।",
        mr: "एक ढाल,\nवर्षाचे 365 दिवस.",
      },
      {
        en: "From hope,\nto certainty.",
        hi: "उम्मीद से\nभरोसे तक।",
        bn: "আশা থেকে\nনিশ্চয়তায়।",
        mr: "आशेपासून\nखात्रीकडे.",
      },
    ],
    bodies: [
      {
        en: "Every year, Ramesh walks his fields at dawn and imagines the harvest that will feed his family — and pay for his daughter's school.",
        hi: "हर साल, रमेश भोर में अपने खेतों में चलते हैं और उस फसल का सपना देखते हैं जो उनके परिवार को खिलाएगी — और बेटी की पढ़ाई का खर्च उठाएगी।",
        bn: "প্রতি বছর ভোরবেলা রমেশ তাঁর মাঠে হাঁটেন আর সেই ফসলের স্বপ্ন দেখেন যা পরিবারকে খাওয়াবে — আর মেয়ের স্কুলের খরচ জোগাবে।",
        mr: "दरवर्षी, रमेश पहाटे शेतात फिरतो आणि त्या पिकाचे स्वप्न पाहतो जे कुटुंबाला पोसेल — आणि मुलीच्या शिक्षणाचा खर्च देईल.",
      },
      {
        en: "Weeks pass. The seedlings stand tall and green. For a moment, the whole season feels blessed.",
        hi: "हफ़्ते गुज़रते हैं। पौधे हरे-भरे और मज़बूत खड़े होते हैं। एक पल को ऐसा लगता है जैसे यह ऋतु आशीर्वाद हो।",
        bn: "সপ্তাহ পেরিয়ে যায়। চারাগুলো সোজা ও সবুজ হয়ে দাঁড়ায়। এক মুহূর্তের জন্য মনে হয় যেন গোটা ঋতুটাই আশীর্বাদ।",
        mr: "आठवडे सरकतात. रोपे उंच आणि हिरवीगार उभी राहतात. क्षणभर असे वाटते जणू हा हंगाम वरदानच आहे.",
      },
      {
        en: "But one morning the leaves carry spots he has never seen. He guesses. He prays. He sprays what the shopkeeper gives him — hoping it is enough.",
        hi: "पर एक सुबह पत्तों पर ऐसे धब्बे दिखाई देते हैं जो उन्होंने पहले कभी नहीं देखे। वे अंदाज़ा लगाते हैं, मन्नत माँगते हैं, और दुकानदार की दी दवाई डालते हैं — बस उम्मीद करते हैं कि वह काफ़ी हो।",
        bn: "কিন্তু এক সকালে পাতায় এমন দাগ দেখা যায় যা তিনি আগে কখনো দেখেননি। তিনি আন্দাজ করেন, প্রার্থনা করেন, আর দোকানদারের দেওয়া ওষুধ ছেটান — শুধু আশা করেন এটুকুই যথেষ্ট।",
        mr: "पण एका सकाळी पानांवर असे डाग दिसतात जे त्यांनी यापूर्वी कधी पाहिले नव्हते. तो अंदाज बांधतो, प्रार्थना करतो आणि दुकानदाराने दिलेले औषध फवारतो — ते पुरे पडेल अशी आशा करत.",
      },
      {
        en: "Then the sky turns black. Floods swallow the fields, the road, and a year of hope in a single night. No warning. No time.",
        hi: "फिर आसमान काला हो जाता है। बाढ़ एक ही रात में खेत, सड़क और पूरे साल की उम्मीदें निगल लेती है। कोई चेतावनी नहीं, कोई वक़्त नहीं।",
        bn: "তারপর আকাশ কালো হয়ে যায়। বন্যা এক রাতেই গ্রাস করে মাঠ, রাস্তা আর সারা বছরের স্বপ্ন। কোনো সতর্কতা নেই, কোনো সময় নেই।",
        mr: "मग आभाळ काळे होते. एका रात्रीत पूर शेतं, रस्ता आणि वर्षभराच्या आशा गिळंकृत करतो. कोणताही इशारा नाही, वेळही नाही.",
      },
      {
        en: "His daughter shows him something he has never seen before: an alert on a phone that knew the storm was coming — before anyone could.",
        hi: "उनकी बेटी उन्हें कुछ ऐसा दिखाती है जो उन्होंने पहले कभी नहीं देखा था: एक फ़ोन पर अलर्ट, जिसे तूफ़ान के आने की खबर सबसे पहले मिली थी।",
        bn: "মেয়ে তাঁকে এমন কিছু দেখায় যা তিনি আগে কখনো দেখেননি: একটি ফোনে সতর্কবার্তা, যা ঝড় আসার আগেই জানিয়ে দিয়েছিল।",
        mr: "मुलगी त्याला असे काही दाखवते जे त्याने आधी कधी पाहिले नव्हते: फोनवर एक इशारा, ज्याला वादळ येण्याची बातमी सगळ्यांआधी कळली होती.",
      },
      {
        en: "Early disaster warnings. Crop disease detection. Weather and market advice — in his language, on his phone, before disaster strikes.",
        hi: "पहले से आपदा चेतावनी। फसल रोग पहचान। मौसम और मंडी की सलाह — उनकी भाषा में, उनके फ़ोन पर, तब जब ज़रूरत हो।",
        bn: "আগাম দুর্যোগ সতর্কতা। ফসলের রোগ শনাক্তকরণ। আবহাওয়া ও বাজারের পরামর্শ — তাঁর নিজের ভাষায়, তাঁর ফোনে, বিপদ আসার আগেই।",
        mr: "आधीच आपत्ती इशारे. पीकरोग ओळख. हवामान आणि बाजारभाव सल्ला — त्याच्याच भाषेत, त्याच्या फोनवर, संकट येण्याआधी.",
      },
      {
        en: "This is the story of every farmer. Now it is your turn — step in, and let AgriShield 365 watch over your fields, every single day.",
        hi: "यह हर किसान की कहानी है। अब आपकी बारी है — आइए, और एग्रीशील्ड 365 को आपके खेतों की रखवाली करने दीजिए, हर दिन।",
        bn: "এটাই প্রতিটি কৃষকের গল্প। এখন আপনার পালা — এগিয়ে আসুন, অ্যাগ্রিশিল্ড 365-কে আপনার মাঠ পাহারা দিতে দিন, প্রতিদিন।",
        mr: "ही प्रत्येक शेतकऱ्याची गोष्ट आहे. आता तुमची पाळी — पुढे या आणि अ‍ॅग्रिशील्ड 365 ला तुमच्या शेताची पहारा करू द्या, दररोज.",
      },
    ],
  },

  storyCta: {
    enter: {
      en: "Enter AgriShield 365",
      hi: "एग्रीशील्ड 365 शुरू करें",
      bn: "অ্যাগ্রিশিল্ড 365 শুরু করুন",
      mr: "अ‍ॅग्रिशील्ड 365 सुरू करा",
    },
    already: {
      en: "Already registered? Go to login",
      hi: "पहले से पंजीकृत? लॉगिन करें",
      bn: "আগেই নথিভুক্ত? লগইন করুন",
      mr: "आधीच नोंदणी केली? लॉगिन करा",
    },
    scroll: { en: "Scroll", hi: "स्क्रॉल करें", bn: "স্ক্রল করুন", mr: "स्क्रोल करा" },
    skip: { en: "Skip", hi: "स्किप करें", bn: "এড়িয়ে যান", mr: "वगळा" },
    login: { en: "Login", hi: "लॉगिन", bn: "লগইন", mr: "लॉगिन" },
    replay: { en: "Replay", hi: "फिर से देखें", bn: "আবার দেখুন", mr: "पुन्हा पहा" },
  },

  // ---------------- Login ----------------
  login: {
    tagline: {
      en: "Your field's guardian, every day",
      hi: "आपके खेत का रखवाला, हर दिन",
      bn: "আপনার মাঠের পাহারাদার, প্রতিদিন",
      mr: "तुमच्या शेताचा रखवालदार, दररोज",
    },
    subtitle: {
      en: "Log in with your mobile number — no passwords to remember.",
      hi: "अपने मोबाइल नंबर से लॉगिन करें — कोई पासवर्ड याद नहीं रखना।",
      bn: "মোবাইল নম্বর দিয়ে লগইন করুন — কোনো পাসওয়ার্ড মনে রাখতে হবে না।",
      mr: "मोबाइल नंबरने लॉगिन करा — पासवर्ड लक्षात ठेवायची गरज नाही.",
    },
    welcomeBack: {
      en: "Welcome back. Log in to see today's advisories.",
      hi: "वापसी पर स्वागत है। आज की सलाह देखने के लिए लॉगिन करें।",
      bn: "ফিরে আসায় স্বাগত। আজকের পরামর্শ দেখতে লগइन করুন।",
      mr: "परत आल्याचे स्वागत. आजचा सल्ला पाहण्यासाठी लॉगिन करा.",
    },
    phoneLabel: {
      en: "Mobile number",
      hi: "मोबाइल नंबर",
      bn: "মোবাইল নম্বর",
      mr: "मोबाइल नंबर",
    },
    phonePlaceholder: {
      en: "98765 43210",
      hi: "98765 43210",
      bn: "98765 43210",
      mr: "98765 43210",
    },
    phoneError: {
      en: "Enter a valid 10-digit mobile number.",
      hi: "सही 10 अंकों का मोबाइल नंबर डालें।",
      bn: "সঠিক ১০ সংখ্যার মোবাইল নম্বর লিখুন।",
      mr: "योग्य 10 अंकी मोबाइल नंबर टाका.",
    },
    sendOtp: {
      en: "Send OTP",
      hi: "OTP भेजें",
      bn: "OTP পাঠান",
      mr: "OTP पाठवा",
    },
    sending: {
      en: "Sending OTP…",
      hi: "OTP भेजा जा रहा है…",
      bn: "OTP পাঠানো হচ্ছে…",
      mr: "OTP पाठवला जात आहे…",
    },
    codeLabel: {
      en: "Enter the 4-digit code",
      hi: "4 अंकों का कोड डालें",
      bn: "৪ সংখ্যার কোড লিখুন",
      mr: "4 अंकी कोड टाका",
    },
    verify: {
      en: "Verify & Continue",
      hi: "सत्यापित करें और आगे बढ़ें",
      bn: "যাচাই করে এগিয়ে যান",
      mr: "पडताळा आणि पुढे जा",
    },
    otpError: {
      en: "Incorrect code. Hint for this demo: 1357",
      hi: "गलत कोड। डेमो कोड: 1357",
      bn: "ভুল কোড। ডেমো কোড: 1357",
      mr: "चुकीचा कोड. डेमो कोड: 1357",
    },
    demoNote: {
      en: "Demo build — use code 1357",
      hi: "डेमो संस्करण — कोड 1357 इस्तेमाल करें",
      bn: "ডেমো সংস্করণ — কোড 1357 ব্যবহার করুন",
      mr: "डेमो आवृत्ती — कोड 1357 वापरा",
    },
    privacy: {
      en: "Your data stays on this device in the demo version.",
      hi: "डेमो संस्करण में आपका डेटा इसी डिवाइस पर रहता है।",
      bn: "ডেমো সংস্করণে আপনার তথ্য এই ডিভাইসেই থাকে।",
      mr: "डेमो आवृत्तीत तुमचा डेटा याच डिव्हाइसवर राहतो.",
    },
  },

  // ---------------- Onboarding ----------------
  onb: {
    title: {
      en: "Set up your farm",
      hi: "अपने खेत की जानकारी दें",
      bn: "আপনার মাঠের তথ্য দিন",
      mr: "तुमच्या शेताची माहिती द्या",
    },
    stepOf: {
      en: "Step {n} of {total}",
      hi: "चरण {n} / {total}",
      bn: "ধাপ {n} এর {total}",
      mr: "पायरी {n} पैकी {total}",
    },
    steps: [
      { en: "About you", hi: "आपके बारे में", bn: "আপনার সম্পর্কে", mr: "तुमच्याबद्दल" },
      { en: "Your farm", hi: "आपका खेत", bn: "আপনার মাঠ", mr: "तुमचे शेत" },
      { en: "Your crop", hi: "आपकी फसल", bn: "আপনার ফসল", mr: "तुमचे पीक" },
      { en: "Farm details", hi: "खेत का विवरण", bn: "মাঠের বিবরণ", mr: "शेताचा तपशील" },
    ],
    welcome: {
      en: "Namaste! 🙏 Let's personalise AgriShield 365 for your fields.",
      hi: "नमस्ते! 🙏 आइए, आपके खेत के हिसाब से एग्रीशील्ड 365 तैयार करें।",
      bn: "নমস্কার! 🙏 চলুন আপনার মাঠের জন্য অ্যাগ্রিশিল্ড 365 সাজিয়ে নিই।",
      mr: "नमस्कार! 🙏 चला, तुमच्या शेतासाठी अ‍ॅग्रिशील्ड 365 तयार करूया.",
    },
    nameLabel: {
      en: "Your name",
      hi: "आपका नाम",
      bn: "আপনার নাম",
      mr: "तुमचे नाव",
    },
    namePlaceholder: {
      en: "e.g. Ramesh Kumar",
      hi: "जैसे: रमेश कुमार",
      bn: "যেমন: রমেশ কুমার",
      mr: "उदा. रमेश कुमार",
    },
    villageLabel: {
      en: "Village / district (optional)",
      hi: "गाँव / ज़िला (वैकल्पिक)",
      bn: "গ্রাম / জেলা (ঐচ্ছিক)",
      mr: "गाव / जिल्हा (ऐच्छिक)",
    },
    villagePlaceholder: {
      en: "e.g. near Nagpur",
      hi: "जैसे: नागपुर के पास",
      bn: "যেমন: নাগপুরের কাছে",
      mr: "उदा. नागपूरजवळ",
    },
    mapHint: {
      en: "Tap the map or drag the pin to your field.",
      hi: "मानचित्र पर टैप करें या निशान को अपने खेत तक खींचें।",
      bn: "মানচিত্রে ট্যাপ করুন বা চিহ্নটি আপনার মাঠে টেনে আনুন।",
      mr: "नकाशावर टॅप करा किंवा खूण तुमच्या शेतापर्यंत ओढा.",
    },
    gps: {
      en: "Use my GPS",
      hi: "मेरी लोकेशन लें",
      bn: "আমার জিপিএস ব্যবহার করুন",
      mr: "माझे GPS वापरा",
    },
    lat: { en: "Latitude", hi: "अक्षांश", bn: "অক্ষাংশ", mr: "अक्षांश" },
    lng: { en: "Longitude", hi: "रेखांश", bn: "দ্রাঘিমাংশ", mr: "रेखांश" },
    cropQuestion: {
      en: "Which crop is standing in your field?",
      hi: "आपके खेत में कौन-सी फसल है?",
      bn: "আপনার মাঠে কোন ফসল আছে?",
      mr: "तुमच्या शेतात कोणते पीक आहे?",
    },
    sowingLabel: {
      en: "Approximate sowing date (optional)",
      hi: "बुवाई की अनुमानित तारीख (वैकल्पिक)",
      bn: "আনুমানিক বপনের তারিখ (ঐচ্ছিক)",
      mr: "पेरणीची अंदाजे तारीख (ऐच्छिक)",
    },
    areaLabel: {
      en: "Field area",
      hi: "खेत का रकबा",
      bn: "মাঠের পরিমাণ",
      mr: "शेताचे क्षेत्रफळ",
    },
    areaUnit: {
      en: "Unit",
      hi: "इकाई",
      bn: "একক",
      mr: "एकक",
    },
    units: {
      acres: { en: "acres", hi: "एकड़", bn: "একর", mr: "एकर" },
      bigha: { en: "bigha", hi: "बीघा", bn: "বিঘা", mr: "बिघा" },
      hectare: { en: "hectare", hi: "हेक्टेयर", bn: "হেক্টর", mr: "हेक्टर" },
    },
    soilLabel: {
      en: "Soil type",
      hi: "मिट्टी का प्रकार",
      bn: "মাটির ধরন",
      mr: "मातीचा प्रकार",
    },
    irrigationLabel: {
      en: "Irrigation method",
      hi: "सिंचाई का तरीका",
      bn: "সেচের পদ্ধতি",
      mr: "सिंचन पद्धती",
    },
    changeLater: {
      en: "You can change all of this later from your dashboard.",
      hi: "यह जानकारी बाद में भी डैशबोर्ड से बदल सकते हैं।",
      bn: "এই তথ্য পরে ড্যাশবোর্ড থেকে বদলাতে পারবেন।",
      mr: "ही माहिती नंतर डॅशबोर्डवरून बदलता येते.",
    },
    back: { en: "Back", hi: "वापस", bn: "পেছনে", mr: "मागे" },
    continue: { en: "Continue", hi: "आगे बढ़ें", bn: "চালিয়ে যান", mr: "पुढे जा" },
    finish: {
      en: "Show my dashboard",
      hi: "मेरा डैशबोर्ड दिखाएँ",
      bn: "আমার ড্যাশবোর্ড দেখান",
      mr: "माझा डॅशबोर्ड दाखवा",
    },
  },

  // ---------------- Analyzing ----------------
  analyzing: {
    title: {
      en: "Preparing your shield",
      hi: "आपके खेत की सुरक्षा तैयार हो रही है…",
      bn: "আপনার মাঠের সুরক্ষা প্রস্তুত হচ্ছে…",
      mr: "तुमच्या शेताचे संरक्षण तयार होत आहे…",
    },
    steps: [
      {
        en: "Locating your field via satellite",
        hi: "सैटेलाइट से खेत ढूँढा जा रहा है",
        bn: "স্যাটেলাইট দিয়ে মাঠ খোঁজা হচ্ছে",
        mr: "उपग्रहाद्वारे शेत शोधले जात आहे",
      },
      {
        en: "Fetching local weather forecast",
        hi: "मौसम की जानकारी ली जा रही है",
        bn: "স্থানীয় আবহাওয়ার পূর্বাভাস আনা হচ্ছে",
        mr: "स्थानिक हवामान अंदाज आणला जात आहे",
      },
      {
        en: "Scanning crop disease risk",
        hi: "फसल रोग जोखिम की जाँच हो रही है",
        bn: "ফসলের রোগের ঝুঁকি যাচাই হচ্ছে",
        mr: "पीकरोग धोका तपासला जात आहे",
      },
      {
        en: "Preparing today's advisories",
        hi: "आज की सलाह तैयार हो रही है",
        bn: "আজকের পরামর্শ তৈরি হচ্ছে",
        mr: "आजचा सल्ला तयार होत आहे",
      },
    ],
  },

  // ---------------- Dashboard ----------------
  dash: {
    namaste: {
      en: "Namaste",
      hi: "नमस्ते",
      bn: "নমস্কার",
      mr: "नमस्कार",
    },
    today: {
      en: "Today's advisory",
      hi: "आज की सलाह",
      bn: "আজকের পরামর্শ",
      mr: "आजचा सल्ला",
    },
    signOut: { en: "Sign out", hi: "लॉग आउट", bn: "লগ আউট", mr: "लॉग आउट" },
    alertsTitle: {
      en: "Active alerts",
      hi: "चेतावनियाँ",
      bn: "সক্রিয় সতর্কতা",
      mr: "सक्रिय इशारे",
    },
    conditionsTitle: {
      en: "Today's field conditions",
      hi: "आज के खेत के हालात",
      bn: "আজকের মাঠের অবস্থা",
      mr: "आजच्या शेताची स्थिती",
    },
    temp: { en: "Temperature", hi: "तापमान", bn: "তাপমাত্রা", mr: "तापमान" },
    moisture: { en: "Soil moisture", hi: "मिट्टी की नमी", bn: "মাটির আর্দ্রতা", mr: "मातीतील आर्द्रता" },
    humidity: { en: "Humidity", hi: "आर्द्रता", bn: "আর্দ্রতা", mr: "आर्द्रता" },
    wind: { en: "Wind", hi: "हवा", bn: "বাতাস", mr: "वारा" },
    cropCard: {
      en: "crop",
      hi: "फसल",
      bn: "ফসল",
      mr: "पीक",
    },
    day: { en: "Day", hi: "दिन", bn: "দিন", mr: "दिवस" },
    sown: { en: "Sown", hi: "बुवाई", bn: "বপন", mr: "पेरणी" },
    toHarvest: {
      en: "{p}% to harvest",
      hi: "कटाई तक {p}%",
      bn: "ফসল কাটা পর্যন্ত {p}%",
      mr: "काढणीपर्यंत {p}%",
    },
    harvest: { en: "Harvest", hi: "कटाई", bn: "ফসল কাটা", mr: "काढणी" },
    shieldStatus: {
      en: "Shield status",
      hi: "सुरक्षा स्थिति",
      bn: "সুরক্ষার অবস্থা",
      mr: "संरक्षण स्थिती",
    },
    riskLow: {
      en: "Low risk — your field looks safe",
      hi: "कम जोखिम — खेत सुरक्षित है",
      bn: "কম ঝুঁকি — আপনার মাঠ নিরাপদ",
      mr: "कम धोका — शेत सुरक्षित आहे",
    },
    riskMid: {
      en: "Moderate risk — stay alert",
      hi: "मध्यम जोखिम — सतर्क रहें",
      bn: "মাঝারি ঝুঁকি — সতর্ক থাকুন",
      mr: "मध्यम धोका — सतर्क राहा",
    },
    riskHigh: {
      en: "High risk — act now",
      hi: "उच्च जोखिम — अभी कार्य करें",
      bn: "উচ্চ ঝুঁকি — এখনই পদক্ষেপ নিন",
      mr: "उच्च धोका — आत्ताच कृती करा",
    },
    riskIndex: {
      en: "Risk index",
      hi: "जोखिम सूचक",
      bn: "ঝুঁকি সূচক",
      mr: "धोका निर्देशांक",
    },
    fieldMapTitle: {
      en: "Your field",
      hi: "आपका खेत",
      bn: "আপনার মাঠ",
      mr: "तुमचे शेत",
    },
    fieldPopup: {
      en: "'s field",
      hi: "का खेत",
      bn: "-এর মাঠ",
      mr: "यांचे शेत",
    },
    adviceTitle: {
      en: "What to do today",
      hi: "आज क्या करें",
      bn: "আজ কী করবেন",
      mr: "आज काय करावे",
    },
    marketPrice: {
      en: "market price",
      hi: "मंडी भाव",
      bn: "বাজারদর",
      mr: "बाजारभाव",
    },
    perQuintal: {
      en: "/quintal",
      hi: "/क्विंटल",
      bn: "/কুইন্টাল",
      mr: "/क्विंटल",
    },
    refreshNote: {
      en: "Advisories refresh daily · AgriShield 365",
      hi: "सलाह रोज़ अपडेट होती है · एग्रीशील्ड 365",
      bn: "পরামর্শ প্রতিদিন আপডেট হয় · অ্যাগ্রিশিল্ড 365",
      mr: "सल्ला दररोज अद्ययावत होतो · अ‍ॅग्रिशील्ड 365",
    },
  },
};

export default t;
