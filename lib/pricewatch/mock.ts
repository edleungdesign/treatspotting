import type { Product, AlertItem, StoreName } from '@/types/pricewatch';

export const mockAlerts: AlertItem[] = [
  {
    id: 'alert-1',
    severity: 'recall',
    date: '2026-06-20',
    title: {
      en: 'Recall of specific batch of Imported Prepackaged Chocolate due to potential Salmonella contamination',
      'zh-Hant': '召回特定批次進口預包裝巧克力，因可能受沙門氏菌污染'
    },
    url: 'https://www.cfs.gov.hk/english/multimedia/multimedia_pub/multimedia_pub_fsf_190_01.html'
  },
  {
    id: 'alert-2',
    severity: 'warning',
    date: '2026-06-18',
    title: {
      en: 'Center for Food Safety warns public against consuming prepackaged milk beverage containing plastic fragments',
      'zh-Hant': '食物安全中心呼籲市民停止飲用含塑料碎片的預包裝牛奶飲品'
    },
    url: 'https://www.cfs.gov.hk/english/press/20260618_1000.html'
  },
  {
    id: 'alert-3',
    severity: 'notice',
    date: '2026-06-15',
    title: {
      en: 'CFS found excessive amount of preservative sulphur dioxide in raw noodle sample',
      'zh-Hant': '食安中心於生麵樣本檢出防腐劑二氧化硫超標'
    },
    url: 'https://www.cfs.gov.hk/english/press/20260615_0900.html'
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    code: '4891118123412',
    name: {
      en: 'Golden Elephant Premium Jasmine Rice 5kg',
      'zh-Hant': '金象牌頂級絲苗米 5公斤'
    },
    brand: {
      en: 'Golden Elephant',
      'zh-Hant': '金象牌'
    },
    category: 'Rice & Grains',
    prices: [
      { store: 'WELLCOME', price: 74.9, prevPrice: 79.9, offer: 'Save $5' },
      { store: 'PARKNSHOP', price: 75.0, prevPrice: 75.0 },
      { store: 'TASTE', price: 73.5, prevPrice: 78.0, offer: 'Special Price' },
      { store: 'AEON', price: 72.0, prevPrice: 72.0 },
      { store: 'HKTVMALL', price: 69.9, prevPrice: 74.9, offer: 'HKTV Exclusive' }
    ],
    sparkline: [75, 74, 74.5, 73, 72, 70, 69.9],
    watched: true,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 69.9,
    priceSpread: 5.1,
    trend: 'down',
    offerBadge: 'Save $5'
  },
  {
    id: 'prod-2',
    code: '4891111002234',
    name: {
      en: 'Kowloon Dairy Fresh Milk 946ml',
      'zh-Hant': '九龍維記鮮牛奶 946毫升'
    },
    brand: {
      en: 'Kowloon Dairy',
      'zh-Hant': '維記'
    },
    category: 'Dairy & Chilled',
    prices: [
      { store: 'WELLCOME', price: 29.5, prevPrice: 29.5 },
      { store: 'PARKNSHOP', price: 28.9, prevPrice: 31.5, offer: 'Buy 2 for $54' },
      { store: 'TASTE', price: 28.9, prevPrice: 31.5, offer: 'Buy 2 for $54' },
      { store: 'AEON', price: 27.5, prevPrice: 27.5 },
      { store: 'HKTVMALL', price: 29.0, prevPrice: 29.0 }
    ],
    sparkline: [31.5, 31, 30.5, 29, 28.5, 27.9, 27.5],
    watched: false,
    cheapestStore: 'AEON',
    cheapestPrice: 27.5,
    priceSpread: 2.0,
    trend: 'down',
    offerBadge: 'Buy 2 for $54'
  },
  {
    id: 'prod-3',
    code: '4891028110291',
    name: {
      en: 'Knife Brand Peanut Oil 900ml x 3',
      'zh-Hant': '刀嘜花生油 900毫升 x 3支'
    },
    brand: {
      en: 'Knife',
      'zh-Hant': '刀嘜'
    },
    category: 'Cooking Oil & Condiments',
    prices: [
      { store: 'WELLCOME', price: 112.0, prevPrice: 119.0, offer: 'Special Bundle' },
      { store: 'PARKNSHOP', price: 109.9, prevPrice: 119.0, offer: 'Super Saver' },
      { store: 'TASTE', price: 109.9, prevPrice: 119.0 },
      { store: 'AEON', price: 115.0, prevPrice: 115.0 },
      { store: 'HKTVMALL', price: 99.9, prevPrice: 119.0, offer: 'Flash Sale' }
    ],
    sparkline: [119, 118, 115, 112, 109.9, 105, 99.9],
    watched: true,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 99.9,
    priceSpread: 15.1,
    trend: 'down',
    offerBadge: 'Flash Sale'
  },
  {
    id: 'prod-4',
    code: '070662015033',
    name: {
      en: 'Nissin Demae Itcho Sesame Oil Noodles 100g x 5',
      'zh-Hant': '出前一丁麻油味即食麵 100克 x 5包裝'
    },
    brand: {
      en: 'Nissin',
      'zh-Hant': '日清'
    },
    category: 'Noodles & Pasta',
    prices: [
      { store: 'WELLCOME', price: 18.5, prevPrice: 17.5, offer: 'Price Up' },
      { store: 'PARKNSHOP', price: 17.9, prevPrice: 17.9 },
      { store: 'TASTE', price: 17.9, prevPrice: 17.9 },
      { store: 'AEON', price: 16.5, prevPrice: 16.5 },
      { store: 'HKTVMALL', price: 18.0, prevPrice: 18.0 }
    ],
    sparkline: [16.5, 17, 17.5, 17.9, 17.9, 18, 18.5],
    watched: false,
    cheapestStore: 'AEON',
    cheapestPrice: 16.5,
    priceSpread: 2.0,
    trend: 'up',
    offerBadge: undefined
  },
  {
    id: 'prod-5',
    code: '4891001150030',
    name: {
      en: 'Coca-Cola 330ml Can x 8',
      'zh-Hant': '可口可樂汽水 330毫升罐裝 x 8罐'
    },
    brand: {
      en: 'Coca-Cola',
      'zh-Hant': '可口可樂'
    },
    category: 'Beverages',
    prices: [
      { store: 'WELLCOME', price: 29.9, prevPrice: 29.9 },
      { store: 'PARKNSHOP', price: 28.5, prevPrice: 28.5 },
      { store: 'TASTE', price: 28.5, prevPrice: 28.5 },
      { store: 'AEON', price: 26.9, prevPrice: 26.9 },
      { store: 'HKTVMALL', price: 25.0, prevPrice: 32.0, offer: 'Discount 22%' }
    ],
    sparkline: [32, 31, 29.9, 28.5, 27.5, 26.9, 25],
    watched: true,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 25.0,
    priceSpread: 4.9,
    trend: 'down',
    offerBadge: 'Discount 22%'
  },
  {
    id: 'prod-6',
    code: '4890008100100',
    name: {
      en: 'Vitasoy Soy Milk 250ml x 6',
      'zh-Hant': '維他奶原味豆奶 250毫升 x 6盒'
    },
    brand: {
      en: 'Vitasoy',
      'zh-Hant': '維他奶'
    },
    category: 'Beverages',
    prices: [
      { store: 'WELLCOME', price: 16.9, prevPrice: 16.9 },
      { store: 'PARKNSHOP', price: 15.9, prevPrice: 15.9 },
      { store: 'TASTE', price: 15.9, prevPrice: 15.9 },
      { store: 'AEON', price: 14.5, prevPrice: 14.5 },
      { store: 'HKTVMALL', price: 15.0, prevPrice: 15.0 }
    ],
    sparkline: [14.5, 14.5, 15, 15.5, 15.9, 15.9, 16.9],
    watched: false,
    cheapestStore: 'AEON',
    cheapestPrice: 14.5,
    priceSpread: 2.4,
    trend: 'stable',
    offerBadge: undefined
  },
  {
    id: 'prod-7',
    code: '4891138910016',
    name: {
      en: 'Lee Kum Kee Premium Oyster Sauce 510g',
      'zh-Hant': '李錦記舊庄特級蠔油 510克'
    },
    brand: {
      en: 'Lee Kum Kee',
      'zh-Hant': '李錦記'
    },
    category: 'Cooking Oil & Condiments',
    prices: [
      { store: 'WELLCOME', price: 34.0, prevPrice: 38.0, offer: '$4 Off' },
      { store: 'PARKNSHOP', price: 33.9, prevPrice: 38.0, offer: '$4.1 Off' },
      { store: 'TASTE', price: 33.9, prevPrice: 38.0 },
      { store: 'AEON', price: 35.0, prevPrice: 35.0 },
      { store: 'HKTVMALL', price: 32.5, prevPrice: 38.0, offer: 'HKTV Price' }
    ],
    sparkline: [38, 37.5, 36, 35, 34, 33.9, 32.5],
    watched: false,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 32.5,
    priceSpread: 2.5,
    trend: 'down',
    offerBadge: '$4.1 Off'
  },
  {
    id: 'prod-8',
    code: '4901301274310',
    name: {
      en: 'Kao Attack Liquid Laundry Detergent Refill 1.6kg',
      'zh-Hant': '潔霸瞬乾極淨洗衣液補充裝 1.6公斤'
    },
    brand: {
      en: 'Kao',
      'zh-Hant': '花王'
    },
    category: 'Household',
    prices: [
      { store: 'WELLCOME', price: 39.9, prevPrice: 39.9 },
      { store: 'PARKNSHOP', price: 38.5, prevPrice: 42.0, offer: 'Special Promotion' },
      { store: 'TASTE', price: 38.5, prevPrice: 42.0 },
      { store: 'AEON', price: 36.9, prevPrice: 36.9 },
      { store: 'HKTVMALL', price: 35.9, prevPrice: 39.9, offer: 'Combo Discount' }
    ],
    sparkline: [42, 41, 39.9, 38.5, 37.5, 36.9, 35.9],
    watched: true,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 35.9,
    priceSpread: 4.0,
    trend: 'down',
    offerBadge: 'Combo Discount'
  },
  {
    id: 'prod-9',
    code: '4891141121010',
    name: {
      en: 'Amoy Gold Label Light Soy Sauce 500ml',
      'zh-Hant': '淘大金標生抽 500毫升'
    },
    brand: {
      en: 'Amoy',
      'zh-Hant': '淘大'
    },
    category: 'Cooking Oil & Condiments',
    prices: [
      { store: 'WELLCOME', price: 14.5, prevPrice: 14.5 },
      { store: 'PARKNSHOP', price: 13.9, prevPrice: 15.5, offer: 'Promo' },
      { store: 'TASTE', price: 13.9, prevPrice: 15.5 },
      { store: 'AEON', price: 13.0, prevPrice: 13.0 },
      { store: 'HKTVMALL', price: 14.0, prevPrice: 14.0 }
    ],
    sparkline: [15.5, 15, 14.5, 14, 13.9, 13.5, 13],
    watched: false,
    cheapestStore: 'AEON',
    cheapestPrice: 13.0,
    priceSpread: 1.5,
    trend: 'down',
    offerBadge: 'Promo'
  },
  {
    id: 'prod-10',
    code: '4891338008816',
    name: {
      en: 'Tempo 3-Ply White Box Tissue 4 Packs',
      'zh-Hant': '得寶三層盒裝紙巾 4盒裝'
    },
    brand: {
      en: 'Tempo',
      'zh-Hant': '得寶'
    },
    category: 'Household',
    prices: [
      { store: 'WELLCOME', price: 27.9, prevPrice: 29.9, offer: 'Discounted' },
      { store: 'PARKNSHOP', price: 28.0, prevPrice: 28.0 },
      { store: 'TASTE', price: 28.0, prevPrice: 28.0 },
      { store: 'AEON', price: 25.9, prevPrice: 25.9 },
      { store: 'HKTVMALL', price: 24.5, prevPrice: 29.9, offer: 'Stock clearance' }
    ],
    sparkline: [29.9, 29, 28, 27.9, 27, 25.9, 24.5],
    watched: false,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 24.5,
    priceSpread: 3.5,
    trend: 'down',
    offerBadge: 'Stock clearance'
  },
  {
    id: 'prod-11',
    code: '4890001001101',
    name: {
      en: 'Heinz Baked Beans in Tomato Sauce 415g',
      'zh-Hant': '亨氏茄汁焗豆 415克'
    },
    brand: {
      en: 'Heinz',
      'zh-Hant': '亨氏'
    },
    category: 'Canned Food',
    prices: [
      { store: 'WELLCOME', price: 16.5, prevPrice: 16.5 },
      { store: 'PARKNSHOP', price: 15.9, prevPrice: 15.9 },
      { store: 'TASTE', price: 15.9, prevPrice: 15.9 },
      { store: 'AEON', price: 15.0, prevPrice: 15.0 },
      { store: 'HKTVMALL', price: 14.8, prevPrice: 14.8 }
    ],
    sparkline: [16.5, 16, 15.9, 15.5, 15.2, 15, 14.8],
    watched: false,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 14.8,
    priceSpread: 1.7,
    trend: 'stable',
    offerBadge: undefined
  },
  {
    id: 'prod-12',
    code: '012000000133',
    name: {
      en: 'Campbell Tomato Soup 305g',
      'zh-Hant': '金寶忌廉番茄湯 305克'
    },
    brand: {
      en: 'Campbell',
      'zh-Hant': '金寶'
    },
    category: 'Canned Food',
    prices: [
      { store: 'WELLCOME', price: 11.9, prevPrice: 12.9, offer: 'Special Offer' },
      { store: 'PARKNSHOP', price: 11.5, prevPrice: 12.9, offer: 'Buy 2 for $21' },
      { store: 'TASTE', price: 11.5, prevPrice: 12.9, offer: 'Buy 2 for $21' },
      { store: 'AEON', price: 10.9, prevPrice: 10.9 },
      { store: 'HKTVMALL', price: 10.5, prevPrice: 12.9, offer: 'Bulk Save' }
    ],
    sparkline: [12.9, 12, 11.9, 11.5, 11, 10.9, 10.5],
    watched: false,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 10.5,
    priceSpread: 1.4,
    trend: 'down',
    offerBadge: 'Buy 2 for $21'
  },
  {
    id: 'prod-13',
    code: '4891118002901',
    name: {
      en: 'Anchor Salted Butter 250g',
      'zh-Hant': '安佳有鹽牛油 250克'
    },
    brand: {
      en: 'Anchor',
      'zh-Hant': '安佳'
    },
    category: 'Dairy & Chilled',
    prices: [
      { store: 'WELLCOME', price: 36.5, prevPrice: 38.5 },
      { store: 'PARKNSHOP', price: 35.9, prevPrice: 35.9 },
      { store: 'TASTE', price: 35.9, prevPrice: 35.9 },
      { store: 'AEON', price: 34.0, prevPrice: 34.0 },
      { store: 'HKTVMALL', price: 32.9, prevPrice: 38.5, offer: 'Cooler Special' }
    ],
    sparkline: [38.5, 37.5, 36.5, 35.9, 35, 34, 32.9],
    watched: false,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 32.9,
    priceSpread: 3.6,
    trend: 'down',
    offerBadge: 'Cooler Special'
  },
  {
    id: 'prod-14',
    code: '074182001150',
    name: {
      en: 'Lipton Yellow Label Tea Bags 50S',
      'zh-Hant': '立頓黃牌精選紅茶包 50包裝'
    },
    brand: {
      en: 'Lipton',
      'zh-Hant': '立頓'
    },
    category: 'Beverages',
    prices: [
      { store: 'WELLCOME', price: 23.9, prevPrice: 25.9 },
      { store: 'PARKNSHOP', price: 22.9, prevPrice: 22.9 },
      { store: 'TASTE', price: 22.9, prevPrice: 22.9 },
      { store: 'AEON', price: 21.9, prevPrice: 21.9 },
      { store: 'HKTVMALL', price: 20.9, prevPrice: 25.9, offer: 'Tea Time Disc' }
    ],
    sparkline: [25.9, 25, 23.9, 22.9, 22, 21.9, 20.9],
    watched: false,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 20.9,
    priceSpread: 3.0,
    trend: 'down',
    offerBadge: 'Tea Time Disc'
  },
  {
    id: 'prod-15',
    code: '4902430588820',
    name: {
      en: 'Pampers Baby Dry Diapers L 68P',
      'zh-Hant': '幫寶適超薄乾爽嬰兒紙尿片 大碼 68片'
    },
    brand: {
      en: 'Pampers',
      'zh-Hant': '幫寶適'
    },
    category: 'Baby Care',
    prices: [
      { store: 'WELLCOME', price: 145.0, prevPrice: 155.0 },
      { store: 'PARKNSHOP', price: 142.9, prevPrice: 155.0, offer: 'Save $12.1' },
      { store: 'TASTE', price: 142.9, prevPrice: 155.0 },
      { store: 'AEON', price: 139.0, prevPrice: 139.0 },
      { store: 'HKTVMALL', price: 135.0, prevPrice: 155.0, offer: 'Baby Carnival' }
    ],
    sparkline: [155, 150, 145, 142.9, 140, 139, 135],
    watched: true,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 135.0,
    priceSpread: 10.0,
    trend: 'down',
    offerBadge: 'Baby Carnival'
  },
  {
    id: 'prod-16',
    code: '4890002131230',
    name: {
      en: 'Colgate Total All-in-One Toothpaste 110g x 3',
      'zh-Hant': '高露潔全效全能牙膏 110克 x 3支'
    },
    brand: {
      en: 'Colgate',
      'zh-Hant': '高露潔'
    },
    category: 'Personal Care',
    prices: [
      { store: 'WELLCOME', price: 49.9, prevPrice: 49.9 },
      { store: 'PARKNSHOP', price: 48.0, prevPrice: 55.0, offer: '$7 Save' },
      { store: 'TASTE', price: 48.0, prevPrice: 55.0 },
      { store: 'AEON', price: 45.9, prevPrice: 45.9 },
      { store: 'HKTVMALL', price: 44.5, prevPrice: 55.0, offer: 'Family Save' }
    ],
    sparkline: [55, 52, 49.9, 48, 47, 45.9, 44.5],
    watched: false,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 44.5,
    priceSpread: 5.4,
    trend: 'down',
    offerBadge: 'Family Save'
  },
  {
    id: 'prod-17',
    code: '4891122131411',
    name: {
      en: 'Dettol Anti-Bacterial Body Wash 950ml',
      'zh-Hant': '滴露防菌沐浴露 950毫升'
    },
    brand: {
      en: 'Dettol',
      'zh-Hant': '滴露'
    },
    category: 'Personal Care',
    prices: [
      { store: 'WELLCOME', price: 42.5, prevPrice: 45.0 },
      { store: 'PARKNSHOP', price: 41.9, prevPrice: 45.0, offer: 'Special Promotion' },
      { store: 'TASTE', price: 41.9, prevPrice: 45.0 },
      { store: 'AEON', price: 39.9, prevPrice: 39.9 },
      { store: 'HKTVMALL', price: 38.0, prevPrice: 45.0, offer: 'Super Sale' }
    ],
    sparkline: [45, 43, 42.5, 41.9, 40, 39.9, 38],
    watched: false,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 38.0,
    priceSpread: 4.5,
    trend: 'down',
    offerBadge: 'Super Sale'
  },
  {
    id: 'prod-18',
    code: '4902430112349',
    name: {
      en: 'Head & Shoulders Anti-Dandruff Shampoo 750ml',
      'zh-Hant': '海倫仙度絲去頭皮洗髮乳 750毫升'
    },
    brand: {
      en: 'Head & Shoulders',
      'zh-Hant': '海倫仙度絲'
    },
    category: 'Personal Care',
    prices: [
      { store: 'WELLCOME', price: 65.0, prevPrice: 65.0 },
      { store: 'PARKNSHOP', price: 62.9, prevPrice: 69.9, offer: 'Hot Offer' },
      { store: 'TASTE', price: 62.9, prevPrice: 69.9 },
      { store: 'AEON', price: 59.9, prevPrice: 59.9 },
      { store: 'HKTVMALL', price: 58.5, prevPrice: 69.9, offer: 'Cool Deal' }
    ],
    sparkline: [69.9, 67, 65, 62.9, 61, 59.9, 58.5],
    watched: true,
    cheapestStore: 'HKTVMALL',
    cheapestPrice: 58.5,
    priceSpread: 6.5,
    trend: 'down',
    offerBadge: 'Cool Deal'
  }
];
