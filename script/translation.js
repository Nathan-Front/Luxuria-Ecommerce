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
  },
};
