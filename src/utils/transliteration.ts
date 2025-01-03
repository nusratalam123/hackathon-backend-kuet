import axios from "axios";

// URL to fetch the Bangla word list
const BANGla_WORDS_URL =
  "https://raw.githubusercontent.com/indicnlp/indicnlp-resources/master/lexicons/bn_wordlist.txt";

// Cache to store Bangla words
let cachedBanglaWords: string[] = [];

// Default Banglish-to-Bangla fallback map
export const defaultBanglishToBanglaMap: { [key: string]: string } = {
    // Pronouns
    ami: "আমি",
    tumi: "তুমি",
    se: "সে",
    amra: "আমরা",
    tomra: "তোমরা",
    tara: "তারা",
    amake: "আমাকে",
    tume: "তুমে",
    sese: "সেসে",
    amader: "আমাদের",
    tomader: "তোমাদের",
    tader: "তাদের",
    amar: "আমার",
    tomor: "তোমর",
    tar: "তার",
   
    // Verbs
    khabo: "খাবো",
    kheyechi: "খেয়েছি",
    korchi: "করছি",
    korbo: "করবো",
    jabo: "যাবো",
    bolbo: "বলবো",
    bhalobashi: "ভালোবাসি",
    dekhi: "দেখি",
    dekbo: "দেখবো",
    likhchi: "লিখছি",
    likhbo: "লিখবো",
    porchi: "পড়ছি",
    porbo: "পড়বো",
    kheltasi: "খেলতেছি",
  
    // Greetings
    namaskar: "নমস্কার",
    shubho: "শুভ",
    prabhat: "প্রভাত",
    ratri: "রাত্রি",
    dhonnobad: "ধন্যবাদ",
    aschi: "আসছি",
  
    // Family
    baba: "বাবা",
    ma: "মা",
    bhai: "ভাই",
    bon: "বোন",
    dada: "দাদা",
    dadi: "দাদি",
    chacha: "চাচা",
    chachi: "চাচি",
    mama: "মামা",
    mami: "মামি",
    nana: "নানা",
    nani: "নানি",
    bhatija: "ভাতিজা",
    bhatiji: "ভাতিজি",
  
    // Numbers
    ek: "এক",
    dui: "দুই",
    tin: "তিন",
    char: "চার",
    pach: "পাঁচ",
    choy: "ছয়",
    shat: "সাত",
    at: "আট",
    noy: "নয়",
    dosh: "দশ",
    bish: "বিশ",
    ponchash: "পঞ্চাশ",
    shoto: "শত",
    hajar: "হাজার",
  
    // Time
    shokal: "সকাল",
    dupur: "দুপুর",
    bikal: "বিকাল",
    rate:"রাত",
    din: "দিন",
    somoy: "সময়",
    kal: "কাল",
    aj: "আজ",
    ekhon: "এখন",
    tarpor: "তারপর",
    ajker: "আজকের",
    ta: "তা",
    khub: "খুব",
    baje: "বাজে",
    ea: "ইয়া",
    ae: "আই",
    ghum: "ঘুম",
    hoy: "হয়",
    hoye: "হয়ে",
    hoyeche: "হয়েছে",
    hoyechi: "হয়েছি",
    hoyechen: "হয়েছেন",
    ni: "নি",
    na: "না",
    tare: "তারে",
    upor: "উপর",
    prochondo: "প্রচন্ড",
    shit: "শীত",
    silo: "সিলো",
    keno: "কেনো",
    miliye: "মিলিয়ে",
    lagse: "লাগে",
    lagseche: "লাগেছে",
    lagsechi: "লাগেছি",
    lagsechen: "লাগেছেন",
    lagsechilen: "লাগেছেন",
    lagsechile: "লাগেছেলে",
    lagsechileche: "লাগেছেলেছে",
    lagsechilechi: "লাগেছেলেছি",
    moddhei:"মডডেই",
    nak: "নাক",
    bondho: "বন্ধো",
    gese: "গেছে",
    matha: "মাথা",
    jeno: "জেনো",
    vari: "ভারি",
    kaje: "কাজে",
    monojog: "মনোজোগ",
    deya: "দেয়া",
    kostokor: "কস্তোকর",
    jasse: "জাসে",
    tumay:"তুমাই",
    vashi: "ভাষি",
    cha: "চা",
  

  

  
    // Nature
    mati: "মাটি",
    akash: "আকাশ",
    nodi: "নদী",
    bun: "বন",
    brikkho: "বৃক্ষ",
    phool: "ফুল",
    pata: "পাতা",
    surjo: "সূর্য",
    tarra: "তারা",
    chad: "চাঁদ",
  
    // Relationships
    bondhu: "বন্ধু",
    sotru: "শত্রু",
    premik: "প্রেমিক",
    premika: "প্রেমিকা",
    meye: "মেয়ে",
    chele: "ছেলে",
    poribar: "পরিবার",
  
    // Foods
    bhat: "ভাত",
    dal: "ডাল",
    mach: "মাছ",
    mangsho: "মাংস",
    pani: "পানি",
    chai: "চা",
    dudh: "দুধ",
    mishti: "মিষ্টি",
    ruti: "রুটি",
    bosse:"বোসে",
    khai: "খাই",
  
    // Places
    bari: "বাড়ি",
    gram: "গ্রাম",
    shohor: "শহর",
    school: "স্কুল",
    hospital: "হাসপাতাল",
    bazar: "বাজার",
    dokan: "দোকান",
    hotel: "হোটেল",
    cinema: "সিনেমা",
  
    // Miscellaneous
    hackathon: "হ্যাকাথন",
    sonar: "সোনার",
    bangla: "বাংলা",
    achi: "আছি",
    valo: "ভালো",
    kemon: "কেমন",
    notun: "নতুন",
    purano: "পুরানো",
    barri: "বাড়ি",
    kaj: "কাজ",
    onek: "অনেক",
    kichu: "কিছু",
    shob: "সব",
    shobai: "সবাই",
    ekhane: "এখানে",
    okhane: "ওখানে",
    shanti: "শান্তি",
    bishwas: "বিশ্বাস",
    jibon: "জীবন",
    somossa: "সমস্যা",
    samadhan: "সমাধান",
  };
  

/**
 * Transliterate Banglish text into Bangla using a predefined word map.
 * @param banglishText - The Banglish text to transliterate.
 * @returns The transliterated Bangla text.
 */
export const transliterateBanglishToBangla = (banglishText: string): string => {
    const words = banglishText.split(" "); // Split the Banglish sentence into words
    const banglaWords: string[] = [];
  
    for (const word of words) {
      // Look up the word in the predefined map
      const banglaWord = defaultBanglishToBanglaMap[word.toLowerCase()] || word; // Use Banglish word if no match found
      banglaWords.push(banglaWord);
    }
  
    // Join the words into a sentence
    return banglaWords.join(" ");
  };
  
  /**
   * Search for a specific word in the predefined Banglish-to-Bangla map.
   * @param word - The Banglish word to search for.
   * @returns The corresponding Bangla word or null if not found.
   */
  export const searchWordInDictionary = (word: string): string | null => {
    return defaultBanglishToBanglaMap[word.toLowerCase()] || null;
  };