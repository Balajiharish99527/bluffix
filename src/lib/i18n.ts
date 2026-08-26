export type Language = "en" | "ta" | "hi";

export interface Translations {
  gameTitle: string;
  gameSubtitle: string;
  playOnline: string;
  createRoom: string;
  joinRoom: string;
  howToPlay: string;
  leaderboards: string;
  settings: string;
  nickname: string;
  avatar: string;
  enterName: string;
  roomCode: string;
  enterRoomCode: string;
  join: string;
  create: string;
  cancel: string;
  start: string;
  ready: string;
  notReady: string;
  hostControls: string;
  kick: string;
  transferHost: string;
  roomSettings: string;
  category: string;
  difficulty: string;
  gameMode: string;
  rounds: string;
  impostorsCount: string;
  clueTimer: string;
  discussionTimer: string;
  votingTimer: string;
  maxPlayers: string;
  shareCode: string;
  copied: string;
  copyCode: string;
  playersJoined: string;
  waitingForHost: string;
  youAreCivilian: string;
  youAreImpostor: string;
  youAreLiar: string;
  secretWordIs: string;
  impostorInstruction: string;
  liarInstruction: string;
  yourTurnToClue: string;
  waitingForPlayerClue: string;
  submitClue: string;
  typeCluePlaceholder: string;
  previousClues: string;
  discussionPhase: string;
  discussWhoIsImpostor: string;
  votingPhase: string;
  voteSuspect: string;
  alreadyVoted: string;
  voteSubmitted: string;
  voteResult: string;
  highestVoted: string;
  impostorGuessPhase: string;
  impostorGuessInstruction: string;
  guessWord: string;
  submitGuess: string;
  roundResults: string;
  winningTeam: string;
  civiliansWin: string;
  impostorsWin: string;
  scores: string;
  nextRound: string;
  finalResults: string;
  gameWinner: string;
  mvp: string;
  playAgain: string;
  leaveRoom: string;
  sound: string;
  haptics: string;
  language: string;
  easy: string;
  medium: string;
  hard: string;
  classicMode: string;
  multiImpostorMode: string;
  findLiarMode: string;
  rulesClassic: string;
  rulesMulti: string;
  rulesLiar: string;
  points: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    gameTitle: "BLUFFIX",
    gameSubtitle: "Neural Intelligence Deducted",
    playOnline: "Initialize Link",
    createRoom: "Create Session",
    joinRoom: "Join Session",
    howToPlay: "Manual",
    leaderboards: "Ranks",
    settings: "Config",
    nickname: "Agent Alias",
    avatar: "Identity Signature",
    enterName: "Input alias...",
    roomCode: "Protocol Key",
    enterRoomCode: "Input 6-digit key",
    join: "Establish Uplink",
    create: "Initialize Environment",
    cancel: "Abort",
    start: "Launch Game",
    ready: "Ready",
    notReady: "Standby",
    hostControls: "Root Privileges",
    kick: "Disconnect Player",
    transferHost: "Elevate to Root",
    roomSettings: "Session Parameters",
    category: "Data Module",
    difficulty: "Security Level",
    gameMode: "Operation Protocol",
    rounds: "Cycles",
    impostorsCount: "Infiltrator Count",
    clueTimer: "Input Window",
    discussionTimer: "Analysis Phase",
    votingTimer: "Elimination Cycle",
    maxPlayers: "Node Capacity",
    shareCode: "Transmit Key",
    copied: "Data copied to clipboard",
    copyCode: "Copy Key",
    playersJoined: "Active Nodes",
    waitingForHost: "Waiting for Root authorization...",
    youAreCivilian: "Identity Verified: Civilian Agent",
    youAreImpostor: "Identity Flagged: Infiltrator",
    youAreLiar: "Identity Flagged: Asymmetric Outlier",
    secretWordIs: "Target Keyword",
    impostorInstruction: "Mask your connection. Infiltrate the stream without detection.",
    liarInstruction: "Your data variance is high. Align your response with the group.",
    yourTurnToClue: "YOUR TURN TO TRANSMIT DATA",
    waitingForPlayerClue: "is processing a transmission...",
    submitClue: "Transmit",
    typeCluePlaceholder: "Input single keyword...",
    previousClues: "Data Logs",
    discussionPhase: "ANALYSIS PHASE",
    discussWhoIsImpostor: "Cross-reference data logs for anomalies.",
    votingPhase: "ELIMINATION CYCLE",
    voteSuspect: "Select the anomalous target for termination:",
    alreadyVoted: "Target Locked",
    voteSubmitted: "Target selected. Synchronizing with other nodes...",
    voteResult: "ANALYTICS VERDICT",
    highestVoted: "Primary Suspect",
    impostorGuessPhase: "OVERRIDE ATTEMPT",
    impostorGuessInstruction: "Infiltrator, attempt to override and decrypt target keyword.",
    guessWord: "Decryption Attempt",
    submitGuess: "Submit Override",
    roundResults: "CYCLE COMPLETE",
    winningTeam: "Operation Result",
    civiliansWin: "THREAT ELIMINATED",
    impostorsWin: "SYSTEM COMPROMISED",
    scores: "Network Standings",
    nextRound: "Next Cycle",
    finalResults: "TERMINAL ANALYTICS",
    gameWinner: "ELITE OPERATIVE",
    mvp: "Mission MVP",
    playAgain: "Initialize New Session",
    leaveRoom: "Disconnect",
    sound: "Audio Feedback",
    haptics: "Tactile Response",
    language: "Linguistic Interface",
    easy: "Lvl 1 (Entry)",
    medium: "Lvl 2 (Standard)",
    hard: "Lvl 3 (Elite)",
    classicMode: "Standard Protocol",
    multiImpostorMode: "Swarm Infiltration",
    findLiarMode: "Anomaly Probe",
    rulesClassic: "Standard operation: Identify the single masked infiltrator through data triangulation.",
    rulesMulti: "High risk: Multiple synchronized infiltrators have compromised the stream.",
    rulesLiar: "Asymmetric data: One node is receiving a variance in the primary signal.",
    points: "Aggregate",
  },
  ta: {
    gameTitle: "பிளஃபிக்ஸ்",
    gameSubtitle: "ஆன்லைன் வார்த்தை ஏமாற்று விளையாட்டு",
    playOnline: "விளையாடு",
    createRoom: "அறை உருவாக்கு",
    joinRoom: "அறையில் சேர்",
    howToPlay: "விளையாடுவது எப்படி",
    leaderboards: "தரவரிசை",
    settings: "அமைப்புகள்",
    nickname: "உங்கள் பெயர்",
    avatar: "அவதார் தேர்வு",
    enterName: "பெயரை உள்ளிடவும்...",
    roomCode: "அறை குறியீடு",
    enterRoomCode: "6 இலக்க குறியீட்டை உள்ளிடுக",
    join: "சேர்க",
    create: "உருவாக்கு",
    cancel: "ரத்து செய்",
    start: "ஆட்டத்தை தொடங்கு",
    ready: "தயார்",
    notReady: "தயாராக இல்லை",
    hostControls: "தொகுப்பாளர் கட்டுப்பாடுகள்",
    kick: "வெளியேற்று",
    transferHost: "தலைவராக்கு",
    roomSettings: "அறை அமைப்புகள்",
    category: "பிரிவு",
    difficulty: "கடினம்",
    gameMode: "விளையாட்டு முறை",
    rounds: "சுற்றுகள்",
    impostorsCount: "ஏமாற்றுக்காரர் எண்ணிக்கை",
    clueTimer: "குறிப்பு நேரம்",
    discussionTimer: "விவாதம் நேரம்",
    votingTimer: "வாக்களிப்பு நேரம்",
    maxPlayers: "அதிகபட்ச ஆட்டக்காரர்கள்",
    shareCode: "பகிர்",
    copied: "நகலெடுக்கப்பட்டது!",
    copyCode: "குறியீட்டை நகலெடு",
    playersJoined: "அறையில் உள்ளவர்கள்",
    waitingForHost: "தொடங்க காத்திருக்கிறது...",
    youAreCivilian: "நீங்கள் குடிமகன்!",
    youAreImpostor: "நீங்கள் ஏமாற்றுக்காரர்!",
    youAreLiar: "நீங்கள் பொய் சொல்பவர்!",
    secretWordIs: "ரகசிய வார்த்தை",
    impostorInstruction: "வார்த்தை தெரியாமல் மற்றவர்களை நம்பவையுங்கள்!",
    liarInstruction: "உங்களுக்கு வேறு கேள்வி உள்ளது! கவனமாக பதில் சொல்லுங்கள்.",
    yourTurnToClue: "உங்கள் குறிப்பு அளிக்கும் முறை!",
    waitingForPlayerClue: "குறிப்பு யோசிக்கிறார்...",
    submitClue: "குறிப்பை அனுப்பு",
    typeCluePlaceholder: "1 குறிப்பு வார்த்தை எழுதுங்கள்...",
    previousClues: "அளிக்கப்பட்ட குறிப்புகள்",
    discussionPhase: "விவாதம்",
    discussWhoIsImpostor: "யார் சந்தேகத்திற்குரியவர் என்று விவாதிக்கவும்!",
    votingPhase: "வாக்களிப்பு",
    voteSuspect: "சந்தேகத்திற்குரியவரை தேர்ந்தெடுங்கள்:",
    alreadyVoted: "வாக்கு அளிக்கப்பட்டது",
    voteSubmitted: "வாக்களித்துவிட்டீர்கள்! காத்திருக்கவும்...",
    voteResult: "வாக்கு முடிவுகள்",
    highestVoted: "அதிக வாக்கு பெற்றவர்",
    impostorGuessPhase: "ஏமாற்றுக்காரர் ஊகம்",
    impostorGuessInstruction: "ரகசிய வார்த்தையை ஊகிக்கவும்!",
    guessWord: "வார்த்தை ஊகம்",
    submitGuess: "அனுப்பு",
    roundResults: "சுற்று முடிவுகள்",
    winningTeam: "வெற்றி பெற்ற அணி",
    civiliansWin: "குடிமக்கள் வெற்றி!",
    impostorsWin: "ஏமாற்றுக்காரர் வெற்றி!",
    scores: "மதிப்பெண் பட்டியல்",
    nextRound: "அடுத்த சுற்று",
    finalResults: "இறுதி முடிவுகள்",
    gameWinner: "சாம்பியன்கள்",
    mvp: "சிறந்த ஆட்டக்காரர்",
    playAgain: "மீண்டும் விளையாடு",
    leaveRoom: "வெளியேறு",
    sound: "ஒலி",
    haptics: "அதிர்வு",
    language: "மொழி",
    easy: "எளிது",
    medium: "நடுத்தரம்",
    hard: "கடினம்",
    classicMode: "கிளாசிக் ஏமாற்றுக்காரன்",
    multiImpostorMode: "பல ஏமாற்றுக்காரர்கள்",
    findLiarMode: "பொய்யனை கண்டுபிடி",
    rulesClassic: "1 நபரை தவிர மற்ற அனைவருக்கும் ரகசிய வார்த்தை தெரியும்!",
    rulesMulti: "2 அல்லது அதற்கு மேற்பட்டவர்கள் சேர்ந்து ஏமாற்றுவார்கள்!",
    rulesLiar: "பொய்யனுக்கு வேறு கேள்வி கொடுக்கப்படும்!",
    points: "புள்ளிகள்",
  },
  hi: {
    gameTitle: "ब्लफ़िक्स",
    gameSubtitle: "ऑनलाइन शब्द धोखेबाज़ गेम",
    playOnline: "ऑनलाइन खेलें",
    createRoom: "कमरा बनाएं",
    joinRoom: "कमरे में जुड़ें",
    howToPlay: "कैसे खेलें",
    leaderboards: "लीडरबोर्ड",
    settings: "सेटिंग्स",
    nickname: "खिलाड़ी का नाम",
    avatar: "अवतार चुनें",
    enterName: "अपना नाम दर्ज करें...",
    roomCode: "रूम कोड",
    enterRoomCode: "6-अक्षरों का कोड दर्ज करें",
    join: "जुड़ें",
    create: "बनाएं",
    cancel: "रद्द करें",
    start: "खेल शुरू करें",
    ready: "तैयार",
    notReady: "तैयार नहीं",
    hostControls: "होस्ट नियंत्रण",
    kick: "बाहर निकालें",
    transferHost: "होस्ट बनाएं",
    roomSettings: "रूम सेटिंग्स",
    category: "श्रेणी",
    difficulty: "कठिनाई",
    gameMode: "गेम मोड",
    rounds: "राउंड्स",
    impostorsCount: "धोखेबाज़ों की संख्या",
    clueTimer: "सुराग टाइमर",
    discussionTimer: "चर्चा टाइमर",
    votingTimer: "वोटिंग टाइमर",
    maxPlayers: "अधिकतम खिलाड़ी",
    shareCode: "कोड शेयर करें",
    copied: "कॉपी किया गया!",
    copyCode: "कोड कॉपी करें",
    playersJoined: "कमरे में खिलाड़ी",
    waitingForHost: "होस्ट के शुरू करने का इंतज़ार...",
    youAreCivilian: "आप एक नागरिक हैं!",
    youAreImpostor: "आप धोखेबाज़ हैं!",
    youAreLiar: "आप झूठे (Liar) हैं!",
    secretWordIs: "गुप्त शब्द",
    impostorInstruction: "बिना शब्द जाने सबको चकमा दें! सुराग ध्यान से सुनें।",
    liarInstruction: "आपके पास थोड़ा अलग सवाल है! ध्यान से जवाब दें।",
    yourTurnToClue: "आपकी सुराग देने की बारी!",
    waitingForPlayerClue: "सुराग सोच रहा है...",
    submitClue: "सुराग भेजें",
    typeCluePlaceholder: "1 छोटा सुराग शब्द लिखें...",
    previousClues: "दिए गए सुराग",
    discussionPhase: "चर्चा का दौर",
    discussWhoIsImpostor: "सुरागों पर चर्चा करें! किसने अजीब जवाब दिया?",
    votingPhase: "वोटिंग दौर",
    voteSuspect: "आपको जिस पर शक है उसे चुनें:",
    alreadyVoted: "वोट दिया गया",
    voteSubmitted: "आपने वोट दिया! दूसरों का इंतज़ार करें...",
    voteResult: "वोट परिणाम",
    highestVoted: "सबसे ज्यादा शक वाला खिलाड़ी",
    impostorGuessPhase: "धोखेबाज़ का अनुमान",
    impostorGuessInstruction: "धोखेबाज़, बोनस पॉइंट्स के लिए गुप्त शब्द का अनुमान लगाएं!",
    guessWord: "गुप्त शब्द का अनुमान",
    submitGuess: "अनुमान भेजें",
    roundResults: "राउंड परिणाम",
    winningTeam: "राउंड विजेता",
    civiliansWin: "नागरिकों की जीत!",
    impostorsWin: "धोखेबाज़ों की जीत!",
    scores: "स्कोरबोर्ड",
    nextRound: "अगला राउंड",
    finalResults: "अंतिम खेल परिणाम",
    gameWinner: "चैंपियंस",
    mvp: "गेम MVP",
    playAgain: "फिर से खेलें",
    leaveRoom: "कमरा छोड़ें",
    sound: "ध्वनि प्रभाव",
    haptics: "कंपन",
    language: "भाषा",
    easy: "आसान",
    medium: "मध्यम",
    hard: "कठिन",
    classicMode: "क्लासिक धोखेबाज़",
    multiImpostorMode: "कई धोखेबाज़",
    findLiarMode: "झूठे को खोजें",
    rulesClassic: "1 धोखेबाज़ को छोड़कर बाकी सबको गुप्त शब्द मिलता है!",
    rulesMulti: "2 या अधिक धोखेबाज़ मिलकर नागरिकों को बेवकूफ बनाते हैं!",
    rulesLiar: "सबको सवाल A मिलता है, लेकिन Liar को सवाल B मिलता है!",
    points: "अंक",
  },
};
