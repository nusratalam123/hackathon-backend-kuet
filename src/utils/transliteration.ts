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
    samadhan: "সমাধান", asi: "আসি",
    ekdin:"একদিন", pecha:"পেঁচা", ar:"আর", kobutor: "কবুতর", bonovumite: "বনভূমিতে",bosechilo:"বতেদিল", pechati:"পেঁচাদি", chilo:"দিল", khubi:"খবইু ",gyani: "জ্ঞানী",
    kobutorti:"কবতর ু দি",shanto:"শান্ত", ebong:"এবং", snehomoy:"স্নেহয়",sobsomoy:"বয়", jagroto:"জাগ্রত", thakto:"থাকত", govir:"গভীর", chokh: "চাখ",
    diye:"দিয়ে", ondhokar: "অন্ধকারে", sob: "ব",dekhto:"পেখত",janto:"জানত",ondhokarer:"অন্ধকারের",sei:"পেই", lukano:"লকা ু না",
    proti:"প্রতি",sroddha:"শ্রদ্ধা",saradini:"ারাদিনই", ure:"উড়ে", berato:"বেড়াত"
    , shantipurno:"শান্তির্ণূ", monovab:" র্ণ নাভাব", niye:"নিয়ে",onneshon:"অন্বেষর্ণ",prithibite:"থিৃ বীতে",shikhbar:"শিখবার",uttor: " উত্তর",bisshas:"বিশ্বা",biswas:"বিশ্বা"
    ,valobasar:"ভালাবাার", bhaobasar:"ভালাবাার",moddhe:"ধ্যে",shottikarer:"ত্যিকারের",juddho:"যদ্ধু ",chupchap:"চুচা",boro:"বড়", shokti:"শক্তি",
    pipre:"দিঁড়ে", nodir:"নীর",giyechilo:"গিয়েদিল", halka:"হালকা", bristir:"বষ্টিৃ র",kosto:"কষ্ট",pacchilo:"াচ্ছিল",pa:"পা", pichle:"দিলে", pore:"ড়ে"
    , giye:"গিয়ে",dube:"ডুবে",thake:"থাকে",bipode:"বিতে",druto:"দ্রুত",fello:"ফেলে", kotha:"কথা",sobai:"সবাই",
    shash:"শ্বা", sash: "শ্বা",tene:"পেনে",kritoggota:"কৃতজ্ঞতা",shikari:"শিকারী", totkhonat:"তৎক্ষর্ণাৎ",kotakkho:" কাক্ষ",rekha:"রেখা", mukto:"ক্তু ", golpo:"গল্প",shekhay:"শেখায়", prokrito:"প্রকৃত", bondhutto:"বন্ধুত্ব",
    oporer:"অরের",simaboddho:"ীাবদ্ধ",shimaboddho:"ীাবদ্ধ",kokhono:"কখনও",upokaro:"উকারও",fol:"ফল",

     arafat: "আরাফাত", barandai: "বারান্দায়", bose: "বসে", mobile: "মোবাইল", scroll: "স্ক্রল", kortesilo: "করছিল", moner: "মনের", hazarta: "হাজারটা", ajarta:"হাজারটা",chinta: "চিন্তা", kintu: "কিন্তু",  korar: "করার", iccheta: "ইচ্ছেটা", shunno: "শূন্য",pakhir: "পাখির", gache: "গাছে",  misti: "মিষ্টি",sure: "সুরে", daktesilo: "ডাকছিল", arafater: "আরাফাতের", sedike: "সেদিকে", mon: "মন", nei: "নেই",
tokhoni: "তখনই", or: "ওর", rafi: "রাফি" ,orsis: "করছিস", olosh: "অলস",theke: "থেকে", labh: "লাভ", nai: "নাই", chol: "চল", football: "ফুটবল", khelte: "খেলতে" ,jai: "যাই", prothome: "প্রথমে", gaigui: "গাঁইগুঁই" ,korlo: "করল",  rafir: "রাফির", chapachapite: "চাপাচাপিতে" ,razi: "রাজি" , gelo: "গেল", parar: "পাড়ার", mathe: "মাঠে", pouchhe: "পৌঁছে", dekhe: "দেখে", aro: "আরও" ,onekei: "অনেকেই", khelche: "খেলছে",batashe: "বাতাসে", mathta: "মাঠটা" ,pranobonto: "প্রাণবন্ত", uthesilo: "উঠেছিল",
khelar: "খেলার", majhe: "মাঝে" ,ekta: "একটা", goal: "গোল" ,dite: "দিতে",   haslo: "হাসল",o: "ও" ,nijeo: "নিজেও", hasi: "হাসি", thamate: "থামাতে", parlo: "পারল" , anondo: "আনন্দ",etai: "এটাই" ,dintake: "দিনটাকে", bishesh: "বিশেষ", kore: "করে", tullo: "তুলল",
shondhyay: "সন্ধ্যায়" ,fire: "ফিরে" ,bhbalo: "ভাবল" ,shomoygulo: "সময়গুলোকে" ,jodi: "যদি" ,ektu: "একটু",lagai: "লাগাই" ,tahole: "তাহলে", dintagulo: "দিনগুলো", sundor: "সুন্দর", hobe: "হবে",


Wow:"ওয়াও",
good:"গুড",
post:"পাস্ট",
vai:"ভাই",
ei: "এই",
price:"প্রাইজ",
e: "এ",
eto:"এত",
bhalo:"ভাল",
phone:"পান",
mamu: "মাম", 
laglo:"লাগলা",
vaya: "ভায়া",
but:"বাট",
share:"পয়ার",
it:"ইট",
er:"এর",
old: "ওল্ড",
version: "ভার্সন",
varson: "ভার্সন",
verson: "ভার্সন",
use: "ইউজ",
kori: "করি",
bro:"ব্রা",
osadharon:"অর্সাধারণ",
osthir:"অস্থির",
app:"অ্যাপ",
banaisen:
"বানাইল'ন",
banaichen:
"বানাইল'ন",
go:"গা",
ehed:"এল(ড",
ahed: "এল(ড",
ahead: "এল(ড",
sms: "এর্সএমএর্স",
forward: "রওয়ার্ড",
to: "টু",
build:"বিল্ড",
diben: "মি)বেন",
vat: "ভাট",
plz: "প্লীজ",
please: "প্লীজ",
osam:"অর্সাম",
awesome: "অর্সাম",
awsome: "অর্সাম",
site:"র্সাইট",
thank: "থ্যাংক",
for:"র",
eta:"এটা",
ata: "এটা",
ki: "কি",
life:"লাই",
time: "টাইম",
jono: "জন্য",
limit:"লিমিট",
ache: "আল'",
ase: "আল'",
working:"ওয়ার্কিং",
hole:"(লে",
ai:"এই",
link: "লিঙ্ক",
a:"এ",
jan:"যান",
zan: "যান",
tri:"ট্রাই",
try:"ট্রাই",
koren:"করেন",
speed:"স্পীড",
kom:"কম",

gmail:"জিমেইল",
facebook:
"পর্সবকু ",
loading: "লাডিং",
loding: "লাডিং",

vpn:"ভিপিএন",
korun: "করুন",

windows:"উইন্ডাজ",
jonno: "জন্য",
abar:"আবার",
download:"ডাউনলাড", korlam:"করলাম",
same:"পর্সইম",
emaol:"ইমেল",
password:"পার্সওয়ার্ড"
,
best:"বেস্ট",
1: "১",
logo:"লাগা",
designer:"ডিজাইনার"
,
software:"র্সটওয়্যার"
,
den: "প)ন",
then:"প)ন",
win:"উইন",
ok: "ওকে",
bujheci:"বল5ু মি'",
bujhesi:"বল5ু মি'",
wifi:"ওয়াইাই",
isp: "আইএর্সপি",
slow: "স্লা ",
apnar:"আপনার",
oala:"ওয়ালা",
karbar:"কারবার",
upload:"আপলাড"
,
barti:"বাড়তি",
mb:"এমবি",
khoroch: "খরচ",
kora:"করা",
lage:"লাগে",
khoroc:"খরচ",
khetre:"ক্ষেত্রে",

hack:"(্যাক",
kon:"কান",
trick:"ট্রিক",
jana: "জানা",
thakle:"থাকলে",
help:"প(ল্প",

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