/* ==========================================================================
   Stackly — Shared data store
   Menu catalogue, testimonials, and demo auth credentials.
   Loaded before every other page script (see <script> order in each page).
   ========================================================================== */

/* Demo credentials for the login/signin demo flow.
   NOTE: hardcoded on purpose — this is a static front-end demo with no backend.
   customer: demo@restaurant.in / demo1234
   admin:    admin@restaurant.in / admin1234 */
const DEMO_CREDENTIALS = {
  customer: {
    email: 'demo@restaurant.in',
    password: 'demo1234',
    name: 'Aditi Sharma',
    role: 'customer'
  },
  admin: {
    email: 'admin@restaurant.in',
    password: 'admin1234',
    name: 'Restaurant Admin',
    role: 'admin'
  }
};

const RESTAURANT_INFO = {
  name: 'Stackly',
  tagline: 'Authentic Flavors, Delivered Fresh',
  address: 'Connaught Place, New Delhi, Delhi 110001, India',
  phone: '+91 98765 43210',
  phoneHref: '+919876543210',
  email: 'hello@stackly.in',
  hours: 'Mon – Sun · 11:00 AM – 11:00 PM',
  mapEmbedSrc: 'https://www.google.com/maps?q=Connaught+Place,+New+Delhi,+Delhi+110001,+India&output=embed',
  social: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    twitter: 'https://www.twitter.com/',
    youtube: 'https://www.youtube.com/'
  }
};

const MENU_ITEMS = [
  { id: 'm01', name: 'Paneer Tikka Skewers', category: 'starters', price: 249, veg: true, popular: true, rating: 4.8, desc: 'Char-grilled cottage cheese marinated in smoked yogurt spice.', emoji: '🧆' },
  { id: 'm02', name: 'Chicken Seekh Kebab', category: 'starters', price: 289, veg: false, popular: true, rating: 4.7, desc: 'Minced chicken skewers with ginger, mint and roasted spices.', emoji: '🍢' },
  { id: 'm03', name: 'Crispy Corn Chaat', category: 'starters', price: 189, veg: true, popular: false, rating: 4.4, desc: 'Golden fried corn tossed in tangy chaat masala.', emoji: '🌽' },
  { id: 'm04', name: 'Tandoori Prawns', category: 'starters', price: 349, veg: false, popular: false, rating: 4.6, desc: 'Jumbo prawns marinated in tandoori spice, char-grilled.', emoji: '🍤' },

  { id: 'm05', name: 'Butter Chicken', category: 'mains', price: 379, veg: false, popular: true, rating: 4.9, desc: 'Slow-cooked chicken in a velvety tomato-butter gravy.', emoji: '🍛' },
  { id: 'm06', name: 'Paneer Butter Masala', category: 'mains', price: 329, veg: true, popular: true, rating: 4.7, desc: 'Cottage cheese cubes in a rich cashew tomato gravy.', emoji: '🍲' },
  { id: 'm07', name: 'Dal Makhani', category: 'mains', price: 259, veg: true, popular: false, rating: 4.6, desc: 'Black lentils simmered overnight with cream and spice.', emoji: '🥘' },
  { id: 'm08', name: 'Hyderabadi Biryani', category: 'mains', price: 349, veg: false, popular: true, rating: 4.9, desc: 'Fragrant basmati rice layered with slow-cooked spiced chicken.', emoji: '🍚' },
  { id: 'm09', name: 'Veg Kolhapuri', category: 'mains', price: 299, veg: true, popular: false, rating: 4.3, desc: 'Mixed vegetables in a fiery Kolhapuri masala.', emoji: '🥕' },
  { id: 'm10', name: 'Rogan Josh', category: 'mains', price: 399, veg: false, popular: false, rating: 4.7, desc: 'Kashmiri-style lamb curry with aromatic whole spices.', emoji: '🍖' },

  { id: 'm11', name: 'Garlic Naan', category: 'breads', price: 69, veg: true, popular: true, rating: 4.6, desc: 'Tandoor-baked flatbread topped with garlic and coriander.', emoji: '🫓' },
  { id: 'm12', name: 'Laccha Paratha', category: 'breads', price: 79, veg: true, popular: false, rating: 4.4, desc: 'Layered, flaky whole-wheat flatbread.', emoji: '🥯' },
  { id: 'm13', name: 'Steamed Basmati Rice', category: 'breads', price: 99, veg: true, popular: false, rating: 4.3, desc: 'Fluffy long-grain basmati, steamed to perfection.', emoji: '🍙' },

  { id: 'm14', name: 'Gulab Jamun', category: 'desserts', price: 129, veg: true, popular: true, rating: 4.8, desc: 'Warm milk-solid dumplings soaked in cardamom syrup.', emoji: '🍡' },
  { id: 'm15', name: 'Rasmalai', category: 'desserts', price: 149, veg: true, popular: false, rating: 4.7, desc: 'Soft paneer discs in saffron-infused sweet milk.', emoji: '🍮' },
  { id: 'm16', name: 'Kesar Kulfi', category: 'desserts', price: 139, veg: true, popular: false, rating: 4.5, desc: 'Traditional saffron-pistachio frozen dessert.', emoji: '🍨' },

  { id: 'm17', name: 'Masala Chai', category: 'drinks', price: 59, veg: true, popular: false, rating: 4.5, desc: 'Spiced Indian tea brewed with milk and cardamom.', emoji: '🍵' },
  { id: 'm18', name: 'Mango Lassi', category: 'drinks', price: 99, veg: true, popular: true, rating: 4.8, desc: 'Chilled yogurt smoothie blended with Alphonso mango.', emoji: '🥭' },
  { id: 'm19', name: 'Fresh Lime Soda', category: 'drinks', price: 79, veg: true, popular: false, rating: 4.3, desc: 'Refreshing lime soda, sweet or salted.', emoji: '🥤' }
];

const TESTIMONIALS = [
  { name: 'Priya Nair', role: 'Regular customer', quote: 'The butter chicken tastes exactly like home-cooked comfort food. Delivery is always on time and hot!', rating: 5, avatar: 'PN' },
  { name: 'Rohan Mehta', role: 'Food blogger', quote: 'Best biryani I have had delivered in the city — layered, fragrant, and generously portioned.', rating: 5, avatar: 'RM' },
  { name: 'Ayesha Khan', role: 'Weekly diner', quote: 'Love the paneer tikka starters. Packaging keeps everything fresh and the app ordering is effortless.', rating: 4, avatar: 'AK' },
  { name: 'Karan Kapoor', role: 'First-time visitor', quote: 'Dined in last weekend — cozy ambience and the tandoori prawns were outstanding.', rating: 5, avatar: 'KK' }
];
