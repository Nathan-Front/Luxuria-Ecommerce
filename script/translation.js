export function translateContent() {
  const languageSelector = document.querySelector("#language");
  languageSelector.addEventListener("change", (e) => {
    const selectedLanguage = e.target.value;
    changeLanguage(selectedLanguage);
  });
}

export function changeLanguage(language) {
  console.log(`Changing language to: ${language}`);
  localStorage.setItem("language", language);

  window.location.reload();
}

export function initializeLanguage() {
  const opt = document.querySelector("#language");

  if (!opt) return;

  const savedLanguage = localStorage.getItem("language") || "en";

  opt.value = savedLanguage;
}

import {
  formatCurrency,
  getExchangeRates,
  convertCurrency,
} from "../components/shop/filters.js";
const rates = getExchangeRates();
const currency = changeLanguage === "ja" ? "JPY" : "USD";
const locale = changeLanguage === "ja" ? "ja-JP" : "en-US";
const displayPrice = rates
  ? convertCurrency(Number(300), currency, rates)
  : Number(300);

const displayCurrency = rates ? currency : "USD";
const displayLocale = rates ? locale : "en-US";
export const languages = {
  en: {
    /* Upper Navigation */
    upperNavText: "Free Shipping on orders over $300",
    help: "Help",
    trackOrder: "Track Order",
    english: "ENG",
    japanese: "JAP",
    /* Lower Navigation */
    navigationNew: "NEW",
    navigationShop: "SHOP",
    navigationStyles: "STYLES",
    navigationAbout: "WHO ARE WE",
    /* Index Second Section */
    shipping: "Free Shipping",
    shippingText: "On orders over $300",
    return: "Easy Returns",
    returnText: "14-day return policy",
    secure: "Secure Payment",
    secureText: "100% secure checkout",
    support: "24/7 Support",
    supportText: "We're here to help",
    shopByCategory: "Shop By Category",
    /* Index Third Section */
    newArrivals: "New Arrivals",
    /* Index Fourth Section */
    sustainable: "Sustainable",
    sustainableText: "Conscious fashion",
    premium: "Premium Quality",
    premiumText: "Build to last",
    designedIn: "Designed In",
    designedInText: "New York",
    customerLove: "Customer Love",
    customerLoveText: "4.5/5 Rating",
    /* Shop filter */
    filter: "Filter",
    clearAll: "Clear all",
    category: "Category",
    filterMen: "Men",
    filterWomen: "Women",
    filterDresses: "Dresses",
    filterTops: "Tops",
    filterBags: "Bags",
    filterAccessories: "Accessories",
    filterPriceRange: "Price Range",
    filterCurrency: "$",
    filterFeatures: "Features",
    filterSortBy: "Sort by:",
    filterSortByDefault: "Default",
    filterSortByNew: "New",
    filterSortByBestSeller: "Best Seller",
    filterSortBySale: "Sale",
    /* Shop filter count */
    countShowing: "Showing item",
    countOutOF: "out of",
    countTotalJA: "",
    /* Cart modal */
    cartModalQuick: "Quick Shop",
    cartModalView: "View product details",
    cartModalColor: "Select Color",
    cartModalColorText: "*Color on the actual product might slightly be off.",
    cartModalSize: "Select Size",
    cartModalAddToCart: "Add To Cart",
    /* Footer Section */
    footerText:
      "Discover timeless pieces crafted for those who appreciate refined style, quality, and individuality.",
    footTitleShop: "Shop",
    footShop: "Shop",
    footCollections: "Collections",
    footWomen: "Women",
    footMen: "Men",
    footAccessories: "Accessories",
    footSale: "Sale",
    footTitleAbout: "About",
    footOurStory: "Our Story",
    footOurPhilosophy: "Our Philosophy",
    footContactUs: "Contact Us",
    footFAQs: "FAQs",
    footTitleCustomerCare: "Customer Care",
    footShippingDelivery: "Shipping & Delivery",
    footReturnExchanges: "Return & Exchanges",
    footOrderTracking: "Order Tracking",
    footPrivacyPolicy: "Privacy Policy",
    footTermsConditions: "Terms & Conditions",
    //Cart page
    yourItems: "Your Items",
    summarySubTotal: "Sub Total:",
    summaryDeliveryFee: "Delivery Fee:",
    summaryEstimatedTax: "Estimated Tax:",
    summaryTotal: "Total",
    summaryColor: "Color:",
    summarySize: "Size:",
    summaryCondition: "Condition:",
    summaryOrderDetails: "Order Details",
    summarySecureText: "Secure checkout powered by Luxuria",
    summaryPayment: "Payment",
    summaryFreeShippingText: "Free shipping on all orders",
    summarySecurePayment: "Secure Payment",
    summaryReturn: "Easy 30-days return",
    summaryNeedHelp: "Need Help?",
    summaryOurTeam: "Our team is here for you.",
    summaryProceed: "Proceed To Checkout",
    summaryContinueShop: "Continue shopping",
    /* Checkout page */
    checkoutOrderSummary: "Order Summary",
    checkoutSubTotal: "Sub Total:",
    checkoutDelFee: "Delivery Fee:",
    checkoutTax: "Extimated Tax:",
    checkoutGrand: "Grand Total:",
    checkoutFreeShip: "Free shipping on orders over $300",
  },

  ja: {
    /* Upper Navigation */
    upperNavText: "以上ご注文で送料無料",
    help: "ヘルプ",
    trackOrder: "注文追跡",
    english: "英語",
    japanese: "日本語",
    /* Lower Navigation */
    navigationNew: "新着",
    navigationShop: "ショップ",
    navigationStyles: "スタイル",
    navigationAbout: "私たちについて",
    /* Index Second Section */
    shipping: "送料無料",
    shippingText: "以上の注文",
    return: "簡単返品",
    returnText: "14日間返品ポリシー",
    secure: "安全な支払い",
    secureText: "100%安全なチェックアウト",
    support: "24時間年中無休サポート",
    supportText: "いつでもお気軽にご相談ください",
    shopByCategory: "カテゴリーから探す",
    /* Index Third Section */
    newArrivals: "新着商品",
    /* Index Fourth Section */
    sustainable: "持続可能",
    sustainableText: "意識の高いファッション",
    premium: "プレミアム品質",
    premiumText: "長く使えるよう設計",
    designedIn: "設計された場所",
    designedInText: "ニューヨーク",
    customerLove: "お客様のレビュー",
    customerLoveText: "4.5 / 5 評価",
    /* Shop filter */
    filter: "フィルター",
    clearAll: "クリア",
    category: "カテゴリー",
    filterMen: "メンズ",
    filterWomen: "レーディス",
    filterDresses: "ワンピース",
    filterTops: "トップス",
    filterBags: "バッグ",
    filterAccessories: "アクセサリー",
    filterPriceRange: "価格帯",
    filterCurrency: "￥",
    filterFeatures: "こだわり",
    filterSortBy: "並べ替え:",
    filterSortByDefault: "デフォルト",
    filterSortByNew: "新着順",
    filterSortByBestSeller: "ベストセラー",
    filterSortBySale: "セール",
    /* Shop filter count */
    countShowing: " ",
    countOutOF: "/",
    countTotalJA: "件",
    /* Cart modal */
    cartModalQuick: "簡単購入",
    cartModalView: "商品詳細を見る",
    cartModalColor: "色選択",
    cartModalColorText: "実際の商品と色味が若干異なる場合があります。",
    cartModalSize: "サイズ選択",
    cartModalAddToCart: "カートに入れる",
    /* Footer Section */
    footerText:
      "洗練されたスタイル、品質、個性を重視する方のために作られた、時代を超えたアイテムを発見してください。",
    footTitleShop: "ショップ",
    footShop: "ショップ",
    footCollections: "コレクション",
    footWomen: "女性",
    footMen: "男性",
    footAccessories: "アクセサリー",
    footSale: "セール",
    footTitleAbout: "ブランドについて",
    footOurStory: "私たちの物語",
    footOurPhilosophy: "私たちの哲学",
    footContactUs: "お問い合わせ",
    footFAQs: "よくある質問",
    footTitleCustomerCare: "カスタマーケア",
    footShippingDelivery: "配送と発送",
    footReturnExchanges: "返品と交換",
    footOrderTracking: "注文追跡",
    footPrivacyPolicy: "プライバシーポリシー",
    footTermsConditions: "利用規約",
    //Cart page
    yourItems: "ご注文商品",
    summarySubTotal: "小計:",
    summaryDeliveryFee: "配送料",
    summaryEstimatedTax: "税金",
    summaryTotal: "合計:",
    summaryColor: "色：",
    summarySize: "サイズ：",
    summaryCondition: "状態：",
    summaryOrderDetails: "注文詳細",
    summarySecureText: "Luxuriaによる安全な決済",
    summaryPayment: "お支払い",
    summaryFreeShippingText: "全品送料無料",
    summarySecurePayment: "安心・安全なお支払い",
    summaryReturn: "30日以内の返品が可能",
    summaryNeedHelp: "お困りですか？",
    summaryOurTeam: "私たちのチームがいつでもサポートいたします。",
    summaryProceed: "チェックアウトに進む",
    summaryContinueShop: "ショップページへ",
    /* Checkout page */
    checkoutOrderSummary: "注文概要",
    checkoutSubTotal: "小計:",
    checkoutDelFee: "配送料:",
    checkoutTax: "税金:",
    checkoutGrand: "合計:",
    checkoutFreeShip: `${(formatCurrency(displayPrice, displayCurrency, displayLocale), "以上のお買い上げで送料無料")}`,
  },
};

export const colorTranslations = {
  //Basic colors
  black: "ブラック",
  "matte black": "マットブラック",
  white: "ホワイト",
  gray: "グレー",
  "light gray": "ライトグレー",
  silver: "シルバー",
  gold: "ゴールド",
  bronze: "ブロンズ",

  //Blue colors
  blue: "ブルー",
  "light blue": "ライトブルー",
  "pastel blue": "パステルブルー",
  "powder blue": "パウダーブルー",
  "sky blue": "スカイブルー",
  "midnight blue": "ミッドナイトブルー",
  "navy blue": "ネイビーブルー",
  "cobalt blue": "コバルトブルー",
  "sapphire blue": "サファイアブルー",
  "steel blue": "スチールブルー",
  "cornflower blue": "コーンフラワーブルー",
  "blue gray": "ブルーグレー",
  "blue green": "ブルーグリーン",
  glaucous: "グレイッシュブルー",

  //Green colors
  green: "グリーン",
  "olive green": "オリーブグリーン",
  "hunter green": "ハンターグリーン",
  "moss green": "モスグリーン",
  "fern green": "ファーングリーン",
  "sage green": "セージグリーン",
  "seafoam green": "シーフォームグリーン",
  "lincoln green": "リンカーングリーン",
  celadon: "セラドン",
  pistachio: "ピスタチオ",
  teal: "ティール",
  turquoise: "ターコイズ",

  //Purple colors
  "light violet": "ライトバイオレット",
  "pastel purple": "パステルパープル",
  "red purple": "レッドパープル",
  mauve: "モーブ",
  thistle: "シスル",
  byzantium: "ビザンチウム",

  //Red and pink colors
  red: "レッド",
  maroon: "マルーン",
  wine: "ワインレッド",
  sienna: "シエナ",
  "red orange": "レッドオレンジ",
  "burnt orange": "バーントオレンジ",
  "pumpkin orange": "パンプキンオレンジ",
  orange: "オレンジ",
  "pastel orange": "パステルオレンジ",
  "pink orange": "ピンクオレンジ",
  pink: "ピンク",
  "coral pink": "コーラルピンク",
  "watermelon pink": "ウォーターメロンピンク",
  peach: "ピーチ",
  poppy: "ポピーレッド",

  //Brown and neutral colors
  brown: "ブラウン",
  russet: "ラセット",
  chestnut: "チェスナット",
  cinnamon: "シナモン",
  camel: "キャメル",
  cognac: "コニャック",
  coffee: "コーヒーブラウン",
  bisque: "ビスク",
  fawn: "フォーン",
  ochre: "オークル",
  khaki: "カーキ",
  wheat: "ウィート",
  "dark yellow": "ダークイエロー",
  "mustard yellow": "マスタードイエロー",
  "navajo white": "ナバホホワイト",
  smoke: "スモーク",
  denim: "デニム",
  "terra cotta": "テラコッタ",
  zantium: "ザンティウム",
  periwinkle: "ペリウィンクル",
};

//Color selection translation
export function translateColors(colors, language) {
  if (!colors) return "";
  if (language === "en") return colors;

  if (colors.trim().toLowerCase() === "none") {
    return "なし";
  }
  return colors
    .split(",")
    .map((color) => {
      const key = color.trim().toLowerCase();
      return colorTranslations[key] || color.trim();
    })
    .join(", ");
}
