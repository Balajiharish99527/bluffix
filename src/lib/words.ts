export interface WordData {
  id?: string;
  category: string;
  word: string;
  wordTa: string;
  wordHi: string;
  difficulty: "easy" | "medium" | "hard";
  liarNormal?: string;
  liarNormalTa?: string;
  liarNormalHi?: string;
  liarLiar?: string;
  liarLiarTa?: string;
  liarLiarHi?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  nameTa: string;
  nameHi: string;
  description: string;
  icon: string;
}

export const CATEGORIES_DATA: CategoryData[] = [
  { id: "food", name: "Food & Drinks", nameTa: "உணவு & பானங்கள்", nameHi: "खाना और पेय", description: "Delicious dishes, snacks, and beverages", icon: "Utensils" },
  { id: "animals", name: "Animals & Wildlife", nameTa: "விலங்குகள்", nameHi: "जानवर", description: "Wild & domestic creatures around the world", icon: "Dog" },
  { id: "places", name: "Places & Landmarks", nameTa: "இடங்கள்", nameHi: "स्थान और स्थल", description: "Famous cities, monuments, and locations", icon: "MapPin" },
  { id: "movies", name: "Movies & Cinema", nameTa: "திரைப்படம்", nameHi: "सिनेमा", description: "Film genres, elements, and cinema culture", icon: "Film" },
  { id: "tamil_movies", name: "Tamil Movies", nameTa: "தமிழ் திரைப்படங்கள்", nameHi: "तमिल फिल्में", description: "Kollywood blockbusters and classics", icon: "Clapperboard" },
  { id: "sports", name: "Sports & Fitness", nameTa: "விளையாட்டு", nameHi: "खेलकूद", description: "Games, athletic events, and equipment", icon: "Trophy" },
  { id: "technology", name: "Technology & AI", nameTa: "தொழில்நுட்பம்", nameHi: "तकनीक और एआई", description: "Gadgets, digital innovations, and software", icon: "Cpu" },
  { id: "travel", name: "Travel & Transport", nameTa: "பயணம் & வாகனம்", nameHi: "यात्रा और वाहन", description: "Modes of travel, vacation spots, and gear", icon: "Plane" },
  { id: "school", name: "School & Education", nameTa: "பள்ளி & கல்வி", nameHi: "स्कूल और शिक्षा", description: "Classrooms, subjects, and study tools", icon: "GraduationCap" },
  { id: "professions", name: "Professions & Careers", nameTa: "தொழில்கள்", nameHi: "पेशा और करियर", description: "Occupations, jobs, and specialist roles", icon: "Briefcase" },
  { id: "objects", name: "Everyday Objects", nameTa: "அன்றாட பொருட்கள்", nameHi: "தैनिक वस्तुएं", description: "Items you find at home and in pockets", icon: "Package" },
  { id: "nature", name: "Nature & Cosmos", nameTa: "இயற்கை & விண்வெளி", nameHi: "प्रकृति और ब्रह्मांड", description: "Natural phenomena, weather, and space", icon: "Leaf" },
  { id: "festivals", name: "Festivals & Celebrations", nameTa: "திருவிழாக்கள்", nameHi: "त्योहार और उत्सव", description: "Cultural events, holidays, and parties", icon: "PartyPopper" },
  { id: "games", name: "Games & Hobbies", nameTa: "விளையாட்டுகள்", nameHi: "गेम्स और शौक", description: "Board games, digital gaming, and pastimes", icon: "Gamepad2" },
  { id: "daily_life", name: "Daily Life & Routines", nameTa: "தினசரி வாழ்க்கை", nameHi: "दैनिक जीवन", description: "Common habits, routines, and experiences", icon: "Clock" },
  { id: "indian_culture", name: "Indian Culture", nameTa: "இந்திய கலாச்சாரம்", nameHi: "भारतीय संस्कृति", description: "Traditions, attire, arts, and heritage of India", icon: "Palmtree" },
  { id: "tamil_nadu", name: "Tamil Nadu Culture", nameTa: "தமிழ்நாடு கலாச்சாரம்", nameHi: "तमிலनाडु संस्कृति", description: "Landmarks, delicacies, and heritage of Tamil Nadu", icon: "Landmark" },
  { id: "funny_random", name: "Funny & Quirky", nameTa: "வேடிக்கையானவை", nameHi: "மज़ேதாரும் மற்றும் வினோதமானதும்", icon: "Ghost", description: "Silky, wild, and unpredictable words" },
  { id: "ai_strategy", name: "AI Strategy", nameTa: "AI உத்தி", nameHi: "एआई रणनीति", description: "AI-generated keywords and patterns", icon: "Brain" },
  { id: "random", name: "Random", nameTa: "சீரற்ற", nameHi: "यादृच्छिक", description: "Shuffle all categories", icon: "Shuffle" },
];

export const INITIAL_WORDS: WordData[] = [
  // Tamil Movies
  { category: "tamil_movies", word: "Baashha", wordTa: "பாட்ஷா", wordHi: "बाशा", difficulty: "medium", liarNormal: "What iconic Rajinikanth movie features an auto-driver with a secret past?", liarNormalTa: "ரகசிய கடந்த காலத்தை கொண்ட ஆட்டோ டிரைவர் நடிக்கும் ரஜினிகாந்தின் படம் எது?", liarNormalHi: "रजनीकांत की कौन सी प्रतिष्ठित फिल्म में एक गुप्त अतीत वाला ऑटो-ड्राइवर दिखाया गया है?", liarLiar: "What sports movie features a village team winning a tournament?", liarLiarTa: "கிராமத்து அணி தொடரை வெல்லும் விளையாட்டு படம் எது?", liarLiarHi: "कौन सी खेल फिल्म में एक गांव की टीम को टूर्नामेंट जीतते हुए दिखाया गया है?" },
  { category: "tamil_movies", word: "Ghilli", wordTa: "கில்லி", wordHi: "घिल्ली", difficulty: "easy", liarNormal: "What Vijay movie features Kabaddi and a rescue mission in Madurai?", liarNormalTa: "மதுரையில் கபடி மற்றும் மீட்புப் பணியை மையமாகக் கொண்ட விஜய் படம் எது?", liarNormalHi: "विजय की किस फिल्म में मदुरै में कबड्डी और एक बचाव मिशन दिखाया गया है?", liarLiar: "What historical movie features a kingdom and an epic war?", liarLiarTa: "ஒரு ராஜ்ஜியம் மற்றும் போரை மையமாகக் கொண்ட வரலாற்றுப் படம் எது?", liarLiarHi: "कौन सी ऐतिहासिक फिल्म में एक साम्राज्य और एक महाकाव्य युद्ध दिखाया गया है?" },
  { category: "tamil_movies", word: "Vikram", wordTa: "விக்ரம்", wordHi: "विक्रम", difficulty: "hard", liarNormal: "What Kamal Haasan movie features a masked vigilante and a drug cartel mission?", liarNormalTa: "முகமூடி அணிந்த ஒரு நபர் மற்றும் போதைப்பொருள் கும்பலை மையமாகக் கொண்ட கமல்ஹாசன் படம் எது?", liarNormalHi: "कमल हासन की कौन सी फिल्म में एक नकाबपोश सतर्कता और ड्रग कार्टेल मिशन दिखाया गया है?", liarLiar: "What romantic movie features a couple meeting on a train?", liarLiarTa: "ரயிலில் சந்திக்கும் ஜோடியை மையமாகக் கொண்ட காதல் படம் எது?", liarLiarHi: "कौन सी रोमांटिक फिल्म में एक ट्रेन में मिलने वाले जोड़े को दिखाया गया है?" },
  { category: "tamil_movies", word: "Ponniyin Selvan", wordTa: "பொன்னியின் செல்வன்", wordHi: "போன்னியின் செல்வன்", difficulty: "hard", liarNormal: "What Mani Ratnam epic features the Chola dynasty and internal conspiracies?", liarNormalTa: "சோழ வம்சம் மற்றும் சதித்திட்டங்களை மையமாகக் கொண்ட மணிரத்னம் படம் எது?", liarNormalHi: "मणि रत्नम की किस महाकाव्य फिल्म में चोल राजवंश और आंतरिक साजिशें दिखाई गई हैं?", liarLiar: "What horror movie features a haunted mansion and a ghost?", liarLiarTa: "பேய் மாளிகை மற்றும் பேயை மையமாகக் கொண்ட திகில் படம் எது?", liarLiarHi: "कौन सी डरावनी फिल्म में एक प्रेतवाधित हवेली और एक भूत दिखाया गया है?" },
  { category: "tamil_movies", word: "Jai Bhim", wordTa: "ஜெய் பீம்", wordHi: "जय भीम", difficulty: "medium", liarNormal: "What Suriya movie features a lawyer fighting for tribal rights in court?", liarNormalTa: "பழங்குடியின மக்களின் உரிமைக்காகப் போராடும் வழக்கறிஞராக சூர்யா நடித்த படம் எது?", liarNormalHi: "सूरिया की किस फिल्म में एक वकील को अदालत में आदिवासी अधिकारों के लिए लड़ते हुए दिखाया गया है?", liarLiar: "What action movie features a high-speed car chase in the city?", liarLiarTa: "நகரத்தில் அதிவேக கார் துரத்தலை மையமாகக் கொண்ட ஆக்ஷன் படம் எது?", liarLiarHi: "कौन सी एक्शन फिल्म में शहर में हाई-स्पीड कार का पीछा दिखाया गया है?" },
  { category: "tamil_movies", word: "Anniyan", wordTa: "அந்நியன்", wordHi: "अन्नियन", difficulty: "hard", liarNormal: "What Shankar movie features a man with multiple personality disorder punishing criminals?", liarNormalTa: "பல ஆளுமை குறைபாடு கொண்ட ஒரு நபர் குற்றவாளிகளைத் தண்டிக்கும் ஷங்கரின் படம் எது?", liarNormalHi: "शंकर की कौन सी फिल्म में मल्टीपल पर्सनालिटी डिसऑर्डर वाला एक व्यक्ति अपराधियों को सजा देता है?", liarLiar: "What comedy movie features a man trying to win a lottery?", liarLiarTa: "லாட்டரி சீட்டு வெல்ல முயற்சிக்கும் ஒரு நபரை மையமாகக் கொண்ட நகைச்சுவைப் படம் எது?", liarLiarHi: "कौन सी कॉमेडी फिल्म में एक आदमी लॉटरी जीतने की कोशिश करता है?" },
  { category: "tamil_movies", word: "Mankatha", wordTa: "மங்காத்தா", wordHi: "मनकाथा", difficulty: "medium", liarNormal: "What Ajith movie revolves around a high-stakes heist during a cricket season?", liarNormalTa: "கிரிக்கெட் சீசனில் நடக்கும் ஒரு பெரிய கொள்ளையை மையமாகக் கொண்ட அஜித்தின் படம் எது?", liarNormalHi: "अजीत की कौन सी फिल्म एक क्रिकेट सीजन के दौरान हाई-स्टेक डकैती के इर्द-गिर्द घूमती है?", liarLiar: "What medical drama features a doctor saving lives in a village?", liarLiarTa: "ஒரு மருத்துவர் கிராமத்தில் உயிர்களைக் காப்பாற்றும் மருத்துவ நாடகப் படம் எது?", liarLiarHi: "कौन सा मेडिकल ड्रामा एक डॉक्टर द्वारा गांव में जान बचाने के बारे में है?" },
  { category: "tamil_movies", word: "Asuran", wordTa: "அசுரன்", wordHi: "असुरन", difficulty: "hard", liarNormal: "What Dhanush movie deals with caste conflict and a father protecting his son?", liarNormalTa: "சாதி மோதல் மற்றும் தன் மகனைப் பாதுகாக்கும் தந்தையைப் பற்றிய தனுஷின் படம் எது?", liarNormalHi: "धनुष की कौन सी फिल्म जाति संघर्ष और अपने बेटे की रक्षा करने वाले पिता से संबंधित है?", liarLiar: "What space adventure features astronauts visiting a new planet?", liarLiarTa: "விண்வெளி வீரர்கள் புதிய கிரகத்திற்குச் செல்லும் விண்வெளி சாகசப் படம் எது?", liarLiarHi: "कौन सा स्पेस एडवेंचर अंतरिक्ष यात्रियों के एक नए ग्रह पर जाने के बारे में है?" },
  { category: "tamil_movies", word: "Petta", wordTa: "பேட்ட", wordHi: "पेट्टा", difficulty: "easy", liarNormal: "What Rajinikanth movie features a hostel warden with a mass action background?", liarNormalTa: "விடுதி காப்பாளர் ஒருவரின் மாஸ் ஆக்ஷன் பின்னணியைக் கொண்ட ரஜினிகாந்தின் படம் எது?", liarNormalHi: "रजनीकांत की किस फिल्म में मास एक्शन बैकग्राउंड वाला हॉस्टल वार्डन दिखाया गया है?", liarLiar: "What sports movie features a girl training for a boxing match?", liarLiarTa: "ஒரு பெண் குத்துச்சண்டை போட்டிக்காகப் பயிற்சி பெறும் விளையாட்டுப் படம் எது?", liarLiarHi: "कौन सी खेल फिल्म में एक लड़की को मुक्केबाजी मैच के लिए प्रशिक्षण लेते दिखाया गया है?" },
  { category: "tamil_movies", word: "Master", wordTa: "மாஸ்டர்", wordHi: "मास्टर", difficulty: "easy", liarNormal: "What Vijay movie features an alcoholic professor sent to a juvenile home?", liarNormalTa: "குடிப்பழக்கம் கொண்ட பேராசிரியர் ஒருவர் சிறுவர் சீர்திருத்தப் பள்ளிக்கு அனுப்பப்படும் விஜய் படம் எது?", liarNormalHi: "विजय की किस फिल्म में एक शराबी प्रोफेसर को जुवेनाइल होम भेजा जाता है?", liarLiar: "What thriller movie features a detective solving a serial killer case?", liarLiarTa: "தொடர் கொலைகாரன் வழக்கை துப்பறியும் நபர் தீர்க்கும் திரில்லர் படம் எது?", liarLiarHi: "कौन सी थ्रिलर फिल्म में एक जासूस सीरियल किलर केस को सुलझाता है?" },

  // Food
  { category: "food", word: "Biryani", wordTa: "பிரியாணி", wordHi: "बिरयानी", difficulty: "easy", liarNormal: "What is your favorite dish for a festive celebration?", liarNormalTa: "ஒரு பண்டிகை கொண்டாட்டத்திற்கு உங்களுக்கு பிடித்த உணவு எது?", liarNormalHi: "उत्सव के जश्न के लिए आपका पसंदीदा व्यंजन क्या है?", liarLiar: "What is your favorite quick street food snack?", liarLiarTa: "உங்களுக்கு பிடித்த விரைவான தெருவோர உணவு எது?", liarLiarHi: "आपका पसंदीदा त्वरित स्ट्रीट फूड स्नैक क्या है?" },
  { category: "food", word: "Pizza", wordTa: "பிட்சா", wordHi: "पिज्जा", difficulty: "easy", liarNormal: "What food do people usually order for movie nights?", liarNormalTa: "திரைப்பட இரவுகளுக்கு மக்கள் வழக்கமாக என்ன உணவை ஆர்டர் செய்வார்கள்?", liarNormalHi: "मूवी नाइट्स के लिए लोग आमतौर पर क्या खाना ऑर्डर करते हैं?", liarLiar: "What food do people usually eat at a wedding hall?", liarLiarTa: "திருமண மண்டபத்தில் மக்கள் வழக்கமாக என்ன உணவை சாப்பிடுவார்கள்?", liarLiarHi: "शादी के हॉल में लोग आमतौर पर क्या खाना खाते हैं?" },
  { category: "food", word: "Samosa", wordTa: "சமோசா", wordHi: "समोसा", difficulty: "easy", liarNormal: "What warm snack is best with evening tea?", liarLiar: "What sweet dish is best served chilled in summer?" },
  { category: "food", word: "Chocolate Cake", wordTa: "சாக்லேட் கேக்", wordHi: "चॉकलेट केक", difficulty: "easy", liarNormal: "What do people cut at a birthday party?", liarLiar: "What do people pour on breakfast cereal?" },
  { category: "food", word: "Ice Cream", wordTa: "ஐஸ் கிரீம்", wordHi: "அயஸ்க்ரீம்", difficulty: "easy", liarNormal: "What frozen treat is perfect for hot summer days?", liarLiar: "What hot soup is best when you have a cold?" },
  { category: "food", word: "Masala Dosa", wordTa: "மசாலா தோசை", wordHi: "மசாலா டோசா", difficulty: "medium", liarNormal: "What crisp South Indian dish is served with chutney and sambar?", liarLiar: "What Italian pasta is baked with melted cheese?" },
  { category: "food", word: "Filter Coffee", wordTa: "பில்டர் காபி", wordHi: "फ़िल्टर कॉफ़ी", difficulty: "medium", liarNormal: "What hot fragrant drink is served in a brass tumbler?", liarLiar: "What cold carbonated drink is served in a fast food combo?" },
  { category: "food", word: "Sushi", wordTa: "சுஷி", wordHi: "சுஷி", difficulty: "hard", liarNormal: "What traditional Japanese rice roll features fresh raw fish?", liarLiar: "What Mexican rolled tortilla features spicy beans?" },

  // Animals
  { category: "animals", word: "Royal Bengal Tiger", wordTa: "வங்கப் புலி", wordHi: "रॉयल बंगाल टाइगर", difficulty: "easy", liarNormal: "What striped big cat is India's national animal?", liarLiar: "What spotted big cat is the fastest runner on land?" },
  { category: "animals", word: "Asian Elephant", wordTa: "யானை", wordHi: "हाथी", difficulty: "easy", liarNormal: "What giant gentle animal has long tusks and a trunk?", liarLiar: "What tall animal has a very long neck to reach high trees?" },
  { category: "animals", word: "Peacock", wordTa: "மயில்", wordHi: "मोर", difficulty: "easy", liarNormal: "What colorful bird dances when rain clouds arrive?", liarLiar: "What pink water bird stands gracefully on one leg?" },
  { category: "animals", word: "Dolphin", wordTa: "டால்பின்", wordHi: "डॉल्फ़िन", difficulty: "medium", liarNormal: "What intelligent ocean mammal does acrobatics and clicks?", liarLiar: "What massive ocean mammal filters krill through baleen plates?" },
  { category: "animals", word: "King Cobra", wordTa: "ராஜநாகம்", wordHi: "किंग कोबरा", difficulty: "medium", liarNormal: "What venomous reptile hoods up when threatened?", liarLiar: "What slow reptile carries its hard shell home on its back?" },
  { category: "animals", word: "Cheetah", wordTa: "சிறுத்தை", wordHi: "चीता", difficulty: "hard", liarNormal: "What spotted feline sprints at lightning speed?", liarLiar: "What striped feline leaps across snowy mountains?" },

  // Places
  { category: "places", word: "Taj Mahal", wordTa: "தாஜ் மஹால்", wordHi: "ताजमहल", difficulty: "easy", liarNormal: "What white marble monument of love stands in Agra?", liarLiar: "What giant ancient stone pyramids stand in Egypt?" },
  { category: "places", word: "Eiffel Tower", wordTa: "ஈபிள் கோபுரம்", wordHi: "एफिल टॉवर", difficulty: "easy", liarNormal: "What famous iron tower defines the skyline of Paris?", liarLiar: "What giant clock tower stands beside the UK Parliament?" },
  { category: "places", word: "Marina Beach", wordTa: "மெரினா கடற்கரை", wordHi: "மரிநா பீச்", difficulty: "medium", liarNormal: "What famous long urban beach stretches across Chennai?", liarLiar: "What snowy mountain resort attracts skiers in the Alps?" },
  { category: "places", word: "Space Station", wordTa: "விண்வெளி நிலையம்", wordHi: "अंतरिक्ष स्टेशन", difficulty: "hard", liarNormal: "What orbiting lab allows astronauts to live zero-G?", liarLiar: "What underwater research submarine explores deep trenches?" },

  // Movies
  { category: "movies", word: "Superhero Movie", wordTa: "சூப்பர்ஹீரோ படம்", wordHi: "सुपरहीरो मूवी", difficulty: "easy", liarNormal: "What film genre features capes, super powers, and villains?", liarLiar: "What film genre features jump scares, ghosts, and dark haunted houses?" },
  { category: "movies", word: "Popcorn", wordTa: "பாப்கார்ன்", wordHi: "पॉपकॉर्न", difficulty: "easy", liarNormal: "What buttered snack do moviegoers crunch in dark theaters?", liarLiar: "What cold scoop dessert do kids eat at ice cream parlors?" },
  { category: "movies", word: "Oscar Trophy", wordTa: "ஆஸ்கார் விருது", wordHi: "ऑस्कर ट्रॉफी", difficulty: "medium", liarNormal: "What golden statuette honors excellence in global cinema?", liarLiar: "What silver cup trophy is awarded to cricket world cup champions?" },

  // Sports
  { category: "sports", word: "Cricket", wordTa: "கிரிக்கெட்", wordHi: "क्रिकेट", difficulty: "easy", liarNormal: "What game played with bat and ball stops the nation during World Cups?", liarLiar: "What game played with feet and a round ball is loved worldwide?" },
  { category: "sports", word: "Kabaddi", wordTa: "கபடி", wordHi: "कबड्डी", difficulty: "medium", liarNormal: "What high-energy raiding sport requires chanting breath control?", liarLiar: "What heavy lifting sport measures maximum weight on a barbell?" },
  { category: "sports", word: "Chess", wordTa: "சதுரங்கம்", wordHi: "शतरंज", difficulty: "medium", liarNormal: "What strategic board game features Kings, Queens, and Pawns?", liarLiar: "What quick dice game features colorful tokens racing around a board?" },

  // Technology
  { category: "technology", word: "Smartphone", wordTa: "ஸ்மார்ட்போன்", wordHi: "स्मार्टफोन", difficulty: "easy", liarNormal: "What pocket gadget runs touch apps, camera, and messaging?", liarLiar: "What wrist device tracks heart rate and counts step steps?" },
  { category: "technology", word: "Artificial Intelligence", wordTa: "செயற்கை நுண்ணறிவு", wordHi: "आर्टिफिशियल इंटेलिजेंस", difficulty: "medium", liarNormal: "What technology allows computers to reason, generate, and chat?", liarLiar: "What physical motor device sweeps and mops room floors automatically?" },
  { category: "technology", word: "VR Headset", wordTa: "விஆர் ஹெட்செட்", wordHi: "वीआर हेडसेट", difficulty: "hard", liarNormal: "What goggle display immerses your eyes into 3D virtual worlds?", liarLiar: "What noise cancelling headphone covers ears for music listening?" },

  // Travel
  { category: "travel", word: "Vande Bharat Train", wordTa: "வந்தே பாரத் ரயில்", wordHi: "वंदे भारत ट्रेन", difficulty: "medium", liarNormal: "What high-speed express train connects major cities in India?", liarLiar: "What luxury ocean cruise liner sails around tropical islands?" },
  { category: "travel", word: "Passport", wordTa: "பாஸ்போர்ட்", wordHi: "பாஸ்போர்ட்", difficulty: "easy", liarNormal: "What official booklet is essential for international airport check-in?", liarLiar: "What plastic card lets you withdraw money at any bank ATM?" },

  // School
  { category: "school", word: "Homework", wordTa: "வீட்டுப்பாடம்", wordHi: "होमवर्क", difficulty: "easy", liarNormal: "What daily study task do teachers assign students after class?", liarLiar: "What fun outdoor recess activity do kids play in school grounds?" },
  { category: "school", word: "Blackboard", wordTa: "கரும்பலகை", wordHi: "ब्लैकबोर्ड", difficulty: "easy", liarNormal: "What large dark board does a teacher write on using chalk?", liarLiar: "What electronic projector projects movie slides on a white screen?" },

  // Professions
  { category: "professions", word: "Astronaut", wordTa: "விண்வெளி வீரர்", wordHi: "अंतरिक्ष यात्री", difficulty: "medium", liarNormal: "What trained professional wears a space suit and walks on the Moon?", liarLiar: "What deep sea diver wears scuba tanks and explores coral reefs?" },
  { category: "professions", word: "Detective", wordTa: "துப்பறிவாளர்", wordHi: "जासूस", difficulty: "medium", liarNormal: "What investigator searches for clues and solves mysterious crimes?", liarLiar: "What courtroom official presides over trials and pronounces verdicts?" },

  // Objects
  { category: "objects", word: "Wireless Earbuds", wordTa: "வயர்லெஸ் இயர்பட்ஸ்", wordHi: "वायरलेस ईयरबड्स", difficulty: "easy", liarNormal: "What tiny bluetooth audio devices fit directly into your ears?", liarLiar: "What large over-ear headphones plug into audio studio consoles?" },
  { category: "objects", word: "Umbrella", wordTa: "குடை", wordHi: "छाता", difficulty: "easy", liarNormal: "What foldable canopy keeps you dry during sudden downpours?", liarLiar: "What warm woolen jacket protects you from icy winter winds?" },

  // Nature
  { category: "nature", word: "Tsunami", wordTa: "சுனாமி", wordHi: "सुनामी", difficulty: "medium", liarNormal: "What massive ocean surge is triggered by undersea earthquakes?", liarLiar: "What violent swirling wind funnel touches down from storm clouds?" },
  { category: "nature", word: "Rainbow", wordTa: "வானவில்", wordHi: "इंद्रधनुष", difficulty: "easy", liarNormal: "What 7-colored arc appears across the sky after rainfall?", liarLiar: "What glowing green light curtain dances near the North Pole?" },

  // Festivals
  { category: "festivals", word: "Diwali", wordTa: "தீபாவளி", wordHi: "दिवाली", difficulty: "easy", liarNormal: "What festival of lights features oil lamps, fireworks, and sweets?", liarLiar: "What festival of colors features splashing colored powders on friends?" },
  { category: "festivals", word: "Pongal", wordTa: "பொங்கல்", wordHi: "पोंगल", difficulty: "easy", liarNormal: "What South Indian harvest festival boils sweet rice in earthen pots?", liarLiar: "What grand boat racing festival is celebrated during Onam in Kerala?" },

  // Games
  { category: "games", word: "Carrom", wordTa: "கேரம்", wordHi: "கैरम", difficulty: "easy", liarNormal: "What wooden square board game involves flicking coins into corner pockets?", liarLiar: "What green felt table game involves striking balls with a cue stick?" },
  { category: "games", word: "Hide & Seek", wordTa: "கண்ணாமூச்சி", wordHi: "छुपन छुपाई", difficulty: "easy", liarNormal: "What classic childhood game involves one seeker searching for hidden players?", liarLiar: "What tag game involves running away from the tagged 'It' player?" },

  // Daily Life
  { category: "daily_life", word: "Alarm Clock", wordTa: "அலாரம் கடிகாரம்", wordHi: "अलार्म घड़ी", difficulty: "easy", liarNormal: "What loud buzzing device wakes you up early for work or school?", liarLiar: "What kitchen timer dings when your baked pizza is ready?" },
  { category: "daily_life", word: "Traffic Jam", wordTa: "போக்குவரத்து நெரிசல்", wordHi: "ட்ரஃபிக் ஜாம்", difficulty: "easy", liarNormal: "What frustrating peak-hour situation leaves cars stuck honking on roads?", liarLiar: "What long lineup happens at airport boarding gates?" },

  // Indian Culture
  { category: "indian_culture", word: "Auto Rickshaw", wordTa: "ஆட்டோ ரிக்ஷா", wordHi: "ऑटो रिक्शा", difficulty: "easy", liarNormal: "What iconic three-wheeled yellow-green vehicle zips through Indian streets?", liarLiar: "What double-decker bus carries passengers through London streets?" },
  { category: "indian_culture", word: "Saree", wordTa: "புடவை", wordHi: "பாடி", difficulty: "easy", liarNormal: "What elegant traditional unstitched draped garment is worn across India?", liarLiar: "What formal dark tuxedo suit is worn at western gala dinners?" },
  { category: "indian_culture", word: "Masala Chai", wordTa: "மசாலா தேனீர்", wordHi: "मसाला चाय", difficulty: "easy", liarNormal: "What spiced milk tea brewed with cardamom and ginger is sold at roadside stalls?", liarLiar: "What cold iced matcha tea is whisked with bamboo brushes?" },

  // Tamil Nadu Culture
  { category: "tamil_nadu", word: "Jallikattu", wordTa: "ஜல்லிக்கட்டு", wordHi: "जल्लीकट्टू", difficulty: "medium", liarNormal: "What traditional Pongal bull-embracing sport is celebrated in Tamil Nadu?", liarLiar: "What traditional Spanish spectacle involves matadors and red capes?" },
  { category: "tamil_nadu", word: "Bharatanatyam", wordTa: "பரதநாட்டியம்", wordHi: "भरतनाट्यम", difficulty: "medium", liarNormal: "What classical dance form features expressive mudras, footwork, and ghungroos?", liarLiar: "What energetic Punjabi dance form features loud dhol drums and leaps?" },
  { category: "tamil_nadu", word: "Kanchipuram Silk", wordTa: "காஞ்சிபுரம் பட்டு", wordHi: "காஞ்சிபுரம் சில்க்", difficulty: "hard", liarNormal: "What world-renowned heavy woven silk saree features pure zari borders?", liarLiar: "What soft pashmina shawl is hand-knitted in Kashmir valleys?" },

  // Funny & Random
  { category: "funny_random", word: "Talking Parrot", wordTa: "பேசும் கிளி", wordHi: "बोलता तोता", difficulty: "easy", liarNormal: "What hilarious feathered bird mimics whatever human words you say?", liarLiar: "What mechanical alarm clock repeats loud cuckoo sounds every hour?" },
  { category: "funny_random", word: "Banana Peel", wordTa: "வாழைப்பழத் தோல்", wordHi: "केले का छिलका", difficulty: "easy", liarNormal: "What slippery yellow skin causes cartoon characters to slip upside down?", liarLiar: "What red emergency button causes alarm sirens to wail?" },
  { category: "funny_random", word: "Invisible Cloak", wordTa: "மறைந்துபோகும் போர்வைகள்", wordHi: "அத்ருஸ்ய லபாடா", difficulty: "hard", liarNormal: "What magical fantasy garment renders whoever wears it totally unseen?", liarLiar: "What heavy weighted blanket helps people sleep soundly in winter?" },

  // AI Custom / Strategy
  { category: "ai_strategy", word: "Neural Network", wordTa: "நியூரல் நெட்வொர்க்", wordHi: "न्यूरल नेटवर्क", difficulty: "hard", liarNormal: "What AI structure mimics the human brain to process complex data patterns?", liarLiar: "What plumbing system uses pipes and valves to distribute water in a house?" },
  { category: "ai_strategy", word: "Quantum Computer", wordTa: "குவாண்டம் கணினி", wordHi: "क्वांटम कंप्यूटर", difficulty: "hard", liarNormal: "What futuristic machine uses qubits to perform calculations impossible for normal PCs?", liarLiar: "What steam engine uses burning coal to pull heavy trains across the country?" },
];
