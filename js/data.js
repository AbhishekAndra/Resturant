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
  { id: 'm19', name: 'Fresh Lime Soda', category: 'drinks', price: 79, veg: true, popular: false, rating: 4.3, desc: 'Refreshing lime soda, sweet or salted.', emoji: '🥤' },

  { id: 'm20', name: "Chef's Tasting Plate", category: 'mains', price: 349, veg: true, popular: false, rating: 4.6, desc: 'A curated small plate with seasonal greens and a light citrus dressing.', emoji: '🍽️' },
  { id: 'm21', name: 'Spicy Red Curry', category: 'mains', price: 289, veg: true, popular: false, rating: 4.5, desc: 'Fiery coconut-based curry loaded with fresh red chillies and herbs.', emoji: '🍲' },
  { id: 'm47', name: 'Penne Arrabbiata', category: 'mains', price: 279, veg: true, popular: false, rating: 4.5, desc: 'Penne pasta tossed in a spicy garlic tomato sauce with fresh basil.', emoji: '🍝' },
  { id: 'm50', name: 'Masala Dosa', category: 'mains', price: 129, veg: true, popular: true, rating: 4.7, desc: 'Crispy golden dosa filled with spiced potato masala, served with sambar and chutneys.', emoji: '🥞' },
  { id: 'm51', name: 'Traditional Thali', category: 'mains', price: 249, veg: true, popular: true, rating: 4.6, desc: 'A wholesome combo plate with roti, mixed curries and a sweet lassi.', emoji: '🍛' },
  { id: 'm52', name: 'Pan-Seared Salmon', category: 'mains', price: 449, veg: false, popular: false, rating: 4.7, desc: 'Salmon fillets in a creamy citrus sauce, finished with fresh herbs.', emoji: '🐟' },

  { id: 'm26', name: 'Margherita Pizza', category: 'pizza', price: 299, veg: true, popular: true, rating: 4.7, desc: 'Classic Neapolitan pizza with tomato, mozzarella and fresh basil.', emoji: '🍕' },
  { id: 'm39', name: 'BBQ Chicken Pizza', category: 'pizza', price: 449, veg: false, popular: false, rating: 4.8, desc: 'Smoky BBQ base with grilled chicken, red onions and bell peppers.', emoji: '🍕' },
  { id: 'm48', name: 'Pepperoni Pizza', category: 'pizza', price: 399, veg: false, popular: true, rating: 4.9, desc: 'Loaded with premium pepperoni on a rich tomato and mozzarella base.', emoji: '🍕' },

  { id: 'm27', name: 'Veggie Delight Burger', category: 'burgers', price: 199, veg: true, popular: true, rating: 4.5, desc: 'Crispy veggie patty with fresh lettuce, tomato and house mayo.', emoji: '🍔' },
  { id: 'm34', name: 'BBQ Bacon Burger', category: 'burgers', price: 299, veg: false, popular: false, rating: 4.7, desc: 'Double patty stacked with smoky bacon and tangy BBQ sauce.', emoji: '🍔' },
  { id: 'm40', name: 'Classic Cheeseburger', category: 'burgers', price: 249, veg: false, popular: true, rating: 4.6, desc: 'A juicy grilled patty with melted cheese, pickles and onion.', emoji: '🍔' },

  { id: 'm28', name: 'Orange Glazed Chicken', category: 'asian', price: 279, veg: false, popular: false, rating: 4.5, desc: 'Crispy chicken tossed in a sweet-tangy orange glaze with broccoli.', emoji: '🥢' },
  { id: 'm33', name: 'Sushi Platter', category: 'asian', price: 449, veg: false, popular: true, rating: 4.7, desc: 'Chef\'s selection of nigiri and maki rolls, fresh daily.', emoji: '🍣' },
  { id: 'm36', name: 'Salmon Sashimi Platter', category: 'asian', price: 499, veg: false, popular: false, rating: 4.8, desc: 'Delicate salmon sashimi sliced fresh, served with wasabi and soy.', emoji: '🍣' },
  { id: 'm38', name: 'Steamed Dumplings', category: 'asian', price: 199, veg: true, popular: true, rating: 4.6, desc: 'Soft steamed dumplings with a savoury vegetable filling.', emoji: '🥟' },
  { id: 'm42', name: 'Shrimp Ramen Bowl', category: 'asian', price: 329, veg: false, popular: false, rating: 4.7, desc: 'Rich noodle broth with shrimp, soft egg and seasonal greens.', emoji: '🍜' },
  { id: 'm44', name: 'Chicken Fried Rice', category: 'asian', price: 219, veg: false, popular: true, rating: 4.4, desc: 'Wok-tossed fried rice with juicy chicken and seasonal vegetables.', emoji: '🍚' },

  { id: 'm24', name: "Chef's Sharing Platter", category: 'starters', price: 349, veg: false, popular: false, rating: 4.5, desc: 'An assortment of grilled meats and crispy bites, perfect for sharing.', emoji: '🍢' },
  { id: 'm29', name: 'Crispy Golden Fries', category: 'starters', price: 129, veg: true, popular: true, rating: 4.5, desc: 'Classic golden fries, salted and served piping hot.', emoji: '🍟' },
  { id: 'm37', name: 'Crispy Chicken Tenders', category: 'starters', price: 219, veg: false, popular: false, rating: 4.6, desc: 'Breaded chicken tenders fried golden, served with dip.', emoji: '🍗' },
  { id: 'm43', name: 'Crispy Veg Samosas', category: 'starters', price: 99, veg: true, popular: true, rating: 4.7, desc: 'Golden fried pastry parcels filled with spiced potatoes and peas.', emoji: '🥟' },
  { id: 'm49', name: 'Loaded Cheese Fries', category: 'starters', price: 179, veg: true, popular: false, rating: 4.6, desc: 'Crispy fries loaded with melted cheese and herbs.', emoji: '🍟' },

  { id: 'm22', name: 'Superfood Salad Bowl', category: 'salads', price: 279, veg: true, popular: false, rating: 4.6, desc: 'Kale, avocado, egg and cherry tomato with a light vinaigrette.', emoji: '🥗' },
  { id: 'm23', name: 'Garden Veggie Spread', category: 'salads', price: 249, veg: true, popular: false, rating: 4.4, desc: 'A colourful spread of fresh, crisp seasonal vegetables.', emoji: '🥗' },
  { id: 'm25', name: 'Rainbow Buddha Bowl', category: 'salads', price: 299, veg: true, popular: true, rating: 4.7, desc: 'Avocado, chickpeas, sweet potato and greens with tahini dressing.', emoji: '🥗' },
  { id: 'm31', name: 'Power Grain Bowl', category: 'salads', price: 319, veg: false, popular: false, rating: 4.6, desc: 'Quinoa and greens topped with seared salmon and cherry tomatoes.', emoji: '🥗' },

  { id: 'm32', name: 'Brownie Ice Cream Delight', category: 'desserts', price: 219, veg: true, popular: true, rating: 4.8, desc: 'Warm fudge brownie topped with vanilla ice cream and caramel.', emoji: '🍫' },
  { id: 'm35', name: 'Belgian Waffles', category: 'desserts', price: 189, veg: true, popular: false, rating: 4.7, desc: 'Crispy fluffy waffles served with berries and maple syrup.', emoji: '🧇' },
  { id: 'm46', name: 'Funfetti Drip Cake', category: 'desserts', price: 249, veg: true, popular: false, rating: 4.8, desc: 'Celebration layer cake with sprinkles and a pink drip glaze.', emoji: '🎂' },

  { id: 'm30', name: 'Mocktail Trio', category: 'drinks', price: 249, veg: true, popular: false, rating: 4.6, desc: 'Three signature fruit mocktails, served chilled with fresh garnish.', emoji: '🍹' },
  { id: 'm41', name: 'Pomegranate Berry Smoothie', category: 'drinks', price: 179, veg: true, popular: false, rating: 4.6, desc: 'Fresh pomegranate and berries blended with mint.', emoji: '🍓' },
  { id: 'm45', name: 'Green Detox Smoothie', category: 'drinks', price: 169, veg: true, popular: false, rating: 4.5, desc: 'Spinach, kiwi, apple and cucumber blended fresh.', emoji: '🥬' },

  { id: 'm53', name: 'Fresh Watermelon Juice', category: 'drinks', price: 89, veg: true, popular: false, rating: 4.5, desc: 'Chilled watermelon juice, naturally sweet and refreshing.', emoji: '🍉' },
  { id: 'm54', name: 'Green Apple Juice', category: 'drinks', price: 99, veg: true, popular: false, rating: 4.4, desc: 'Freshly pressed green apple juice with a crisp, tart finish.', emoji: '🍏' },
  { id: 'm55', name: 'Cold Coffee', category: 'drinks', price: 129, veg: true, popular: true, rating: 4.7, desc: 'Chilled blended coffee topped with a scoop of vanilla ice cream.', emoji: '☕' }
];

const TESTIMONIALS = [
  { name: 'Priya Nair', role: 'Regular customer', quote: 'The butter chicken tastes exactly like home-cooked comfort food. Delivery is always on time and hot!', rating: 5, avatar: 'PN' },
  { name: 'Rohan Mehta', role: 'Food blogger', quote: 'Best biryani I have had delivered in the city — layered, fragrant, and generously portioned.', rating: 5, avatar: 'RM' },
  { name: 'Ayesha Khan', role: 'Weekly diner', quote: 'Love the paneer tikka starters. Packaging keeps everything fresh and the app ordering is effortless.', rating: 4, avatar: 'AK' },
  { name: 'Karan Kapoor', role: 'First-time visitor', quote: 'Dined in last weekend — cozy ambience and the tandoori prawns were outstanding.', rating: 5, avatar: 'KK' }
];
