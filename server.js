require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;
function readJSON(filename) {
  const filePath = path.join(__dirname, 'data', filename);
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function writeJSON(filename, data) {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
const ALL_PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600573472556-e636c2acda9e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600047508006-6f0c2c3e3fdb?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=600&h=400&fit=crop'
];
let imageIndex = 0;
function getPropertyImage(type, index) {
  const idx = (index !== undefined ? index : imageIndex++) % ALL_PROPERTY_IMAGES.length;
  return ALL_PROPERTY_IMAGES[idx];
}
const aiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; 
function getCacheKey(city, type, minPrice, maxPrice) {
  return `${city || 'all'}_${type || 'all'}_${minPrice || 0}_${maxPrice || 0}`;
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'provest-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } 
}));
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  res.status(401).json({ success: false, message: 'Please log in first.' });
}
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}
app.post('/auth/register', (req, res) => {
  const { name, mobile, password } = req.body;
  if (!name || !mobile || !password) {
    return res.status(400).json({ success: false, message: 'Name, mobile, and password are required.' });
  }
  const users = readJSON('users.json');
  let user = users.find(u => u.mobile === mobile);
  if (user) {
    return res.status(409).json({ success: false, message: 'Mobile number already registered.' });
  }
  user = {
    id: 'user-' + Date.now(),
    name,
    mobile,
    password: hashPassword(password),
    createdAt: new Date().toISOString()
  };
  users.push(user);
  writeJSON('users.json', users);
  req.session.user = { id: user.id, name: user.name, mobile: user.mobile };
  res.status(201).json({ success: true, user: req.session.user });
});
app.post('/auth/login', (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) {
    return res.status(400).json({ success: false, message: 'Mobile and password are required.' });
  }
  const users = readJSON('users.json');
  const user = users.find(u => u.mobile === mobile);
  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ success: false, message: 'Invalid mobile or password.' });
  }
  req.session.user = { id: user.id, name: user.name, mobile: user.mobile };
  res.json({ success: true, user: req.session.user });
});
app.post('/auth/forgot-password', (req, res) => {
  const { mobile, newPassword } = req.body;
  if (!mobile || !newPassword) {
    return res.status(400).json({ success: false, message: 'Mobile and new password are required.' });
  }
  const users = readJSON('users.json');
  const userIndex = users.findIndex(u => u.mobile === mobile);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'Mobile number not found.' });
  }
  users[userIndex].password = hashPassword(newPassword);
  writeJSON('users.json', users);
  res.json({ success: true, message: 'Password updated successfully!' });
});
app.get('/auth/user', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  }
  res.json({ authenticated: false, user: null });
});
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});
async function generateAIProperties(city, type, minPrice, maxPrice) {
  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_KEY || OPENROUTER_KEY === 'your_openrouter_key_here') {
    return null; 
  }
  const cacheKey = getCacheKey(city, type, minPrice, maxPrice);
  const cached = aiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  const cityFilter = city && city !== 'all' ? `in or near ${city}` : 'across major Indian cities like Mumbai, Delhi, Bangalore, Kolkata, Hyderabad, Chennai, Pune, Jaipur, Goa, Ahmedabad';
  const typeFilter = type && type !== 'all' ? `of type "${type}"` : 'of various types (Apartment, Villa, Plot, Commercial)';
  let priceRange = '';
  if (minPrice && maxPrice) {
    priceRange = `with prices between ₹${Number(minPrice).toLocaleString('en-IN')} and ₹${Number(maxPrice).toLocaleString('en-IN')}`;
  } else if (minPrice) {
    priceRange = `with prices above ₹${Number(minPrice).toLocaleString('en-IN')}`;
  } else if (maxPrice) {
    priceRange = `with prices up to ₹${Number(maxPrice).toLocaleString('en-IN')}`;
  } else {
    priceRange = 'with realistic Indian market prices (ranging from ₹30,00,000 to ₹50,00,00,000)';
  }
  const prompt = `Generate exactly 8 realistic Indian real estate property listings ${cityFilter} ${typeFilter} ${priceRange}.
Return ONLY a valid JSON array with no extra text. Each object must have exactly these fields:
- "title": string (descriptive property name, e.g., "3BHK Luxury Apartment in Andheri West")
- "location": string (specific area + city, e.g., "Andheri West, Mumbai")
- "price": number (price in INR, no decimals)
- "type": string (one of: "Apartment", "Villa", "Plot", "Commercial", "Penthouse")
- "bedrooms": number (0-6, use 0 for Commercial/Plot)
- "bathrooms": number (1-5, use 0 for Plot)
- "area": number (square feet, 500-10000)
- "description": string (2-3 sentences about the property, mention area-specific landmarks or features)
- "phone": string (Indian format like "+91 98765 43210")
- "tag": string (one of: "Premium", "Hot Deal", "New Launch", "Verified", "Exclusive", "RERA Approved")
Return ONLY the JSON array, nothing else.`;
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: 'You are a JSON generator. Return ONLY valid JSON arrays with no markdown formatting, no code fences, no explanations.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 4000
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Ghar ki Samrat'
      },
      timeout: 15000
    });
    const content = response.data.choices?.[0]?.message?.content;
    if (!content) return null;
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    const properties = JSON.parse(cleaned);
    if (!Array.isArray(properties)) return null;
    const enriched = properties.map((prop, index) => ({
      id: `ai-${Date.now()}-${index}`,
      title: prop.title || 'Untitled Property',
      location: prop.location || 'India',
      price: Number(prop.price) || 5000000,
      image: getPropertyImage(prop.type || 'Apartment', index),
      type: prop.type || 'Apartment',
      bedrooms: Number(prop.bedrooms) || 2,
      bathrooms: Number(prop.bathrooms) || 1,
      area: Number(prop.area) || 1000,
      description: prop.description || 'A beautiful property in a prime location.',
      phone: prop.phone || '+91 98765 43210',
      tag: prop.tag || 'Available',
      yield: (Math.random() * 5 + 6).toFixed(1) + '%',
      funded: Math.floor(Math.random() * 60 + 20),
      investors: Math.floor(Math.random() * 200 + 50),
      userId: 'ai-generated',
      createdAt: new Date().toISOString(),
      source: 'ai'
    }));
    aiCache.set(cacheKey, { data: enriched, timestamp: Date.now() });
    console.log(`  ✦ AI generated ${enriched.length} properties for: ${cacheKey}`);
    return enriched;
  } catch (err) {
    console.error('  ✗ AI property generation failed:', err.message);
    return null;
  }
}
app.get('/api/search', async (req, res) => {
  const { city, type, minPrice, maxPrice } = req.query;
  const aiProperties = await generateAIProperties(city, type, minPrice, maxPrice);
  if (aiProperties && aiProperties.length > 0) {
    return res.json({
      source: 'ai',
      message: 'Live AI-generated listings',
      count: aiProperties.length,
      properties: aiProperties
    });
  }
  console.log('  ⚠ Using fallback properties...');
  let properties = readJSON('properties.json');
  if (city && city !== 'all') {
    properties = properties.filter(p =>
      p.location.toLowerCase().includes(city.toLowerCase())
    );
  }
  if (type && type !== 'all') {
    properties = properties.filter(p =>
      p.type.toLowerCase() === type.toLowerCase()
    );
  }
  if (minPrice) {
    properties = properties.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    properties = properties.filter(p => p.price <= Number(maxPrice));
  }
  properties = properties.map(p => ({ ...p, source: 'local' }));
  res.json({
    source: 'fallback',
    message: 'Live data unavailable — showing verified listings',
    count: properties.length,
    properties
  });
});
app.get('/properties', (req, res) => {
  let properties = readJSON('properties.json');
  const { city, type, minPrice, maxPrice, search } = req.query;
  if (city && city !== 'all') {
    properties = properties.filter(p => 
      p.location.toLowerCase().includes(city.toLowerCase())
    );
  }
  if (type && type !== 'all') {
    properties = properties.filter(p => 
      p.type.toLowerCase() === type.toLowerCase()
    );
  }
  if (minPrice) {
    properties = properties.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    properties = properties.filter(p => p.price <= Number(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    properties = properties.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }
  res.json(properties);
});
app.get('/property/:id', (req, res) => {
  const properties = readJSON('properties.json');
  const property = properties.find(p => p.id === req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found.' });
  }
  res.json(property);
});
app.post('/property', (req, res) => {
  const { title, price, location, image, type, bedrooms, bathrooms, area, description, phone } = req.body;
  if (!title || !price || !location) {
    return res.status(400).json({ success: false, message: 'Title, price, and location are required.' });
  }
  const user = req.user || req.session?.user;
  const properties = readJSON('properties.json');
  const propertyType = type || 'Apartment';
  const newProperty = {
    id: 'prop-' + Date.now(),
    title,
    price: Number(price),
    location,
    image: image || getPropertyImage(propertyType),
    type: propertyType,
    bedrooms: Number(bedrooms) || 2,
    bathrooms: Number(bathrooms) || 1,
    area: Number(area) || 1000,
    description: description || 'A beautiful property in a prime location.',
    phone: phone || '+91 98765 43210',
    tag: 'New Listing',
    yield: (Math.random() * 4 + 6).toFixed(1) + '%',
    funded: Math.floor(Math.random() * 40 + 20),
    investors: Math.floor(Math.random() * 100 + 30),
    userId: user?.id || 'anonymous',
    createdAt: new Date().toISOString()
  };
  properties.push(newProperty);
  writeJSON('properties.json', properties);
  res.status(201).json({ success: true, message: 'Property listed successfully!', property: newProperty });
});
app.delete('/property/:id', (req, res) => {
  let properties = readJSON('properties.json');
  const index = properties.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Property not found.' });
  }
  properties.splice(index, 1);
  writeJSON('properties.json', properties);
  res.json({ success: true, message: 'Property removed successfully.' });
});
app.get('/cart', (req, res) => {
  const user = req.user || req.session?.user;
  if (!user) return res.json([]);
  const cart = readJSON('cart.json');
  const userCart = cart.filter(c => c.userId === user.id);
  const properties = readJSON('properties.json');
  const enriched = userCart.map(item => {
    const prop = properties.find(p => p.id === item.propertyId);
    return { ...item, property: prop || null };
  }).filter(item => item.property);
  res.json(enriched);
});
app.post('/cart', (req, res) => {
  const user = req.user || req.session?.user;
  if (!user) return res.status(401).json({ success: false, message: 'Please log in first.' });
  const { propertyId } = req.body;
  if (!propertyId) {
    return res.status(400).json({ success: false, message: 'Property ID is required.' });
  }
  const cart = readJSON('cart.json');
  const exists = cart.find(c => c.userId === user.id && c.propertyId === propertyId);
  if (exists) {
    return res.status(409).json({ success: false, message: 'Property already in cart.' });
  }
  let properties = readJSON('properties.json');
  let prop = properties.find(p => p.id === propertyId);
  if (!prop && req.body.propertyData) {
    prop = req.body.propertyData;
    properties.push(prop);
    writeJSON('properties.json', properties);
  }
  if (!prop) {
    return res.status(404).json({ success: false, message: 'Property not found.' });
  }
  cart.push({
    id: 'cart-' + Date.now(),
    userId: user.id,
    propertyId,
    addedAt: new Date().toISOString()
  });
  writeJSON('cart.json', cart);
  res.status(201).json({ success: true, message: 'Added to cart!', cartCount: cart.filter(c => c.userId === user.id).length });
});
app.delete('/cart/:propertyId', (req, res) => {
  const user = req.user || req.session?.user;
  if (!user) return res.status(401).json({ success: false, message: 'Please log in.' });
  let cart = readJSON('cart.json');
  const before = cart.length;
  cart = cart.filter(c => !(c.userId === user.id && c.propertyId === req.params.propertyId));
  if (cart.length === before) {
    return res.status(404).json({ success: false, message: 'Item not in cart.' });
  }
  writeJSON('cart.json', cart);
  res.json({ success: true, message: 'Removed from cart.', cartCount: cart.filter(c => c.userId === user.id).length });
});
app.get('/cart/count', (req, res) => {
  const user = req.user || req.session?.user;
  if (!user) return res.json({ count: 0 });
  const cart = readJSON('cart.json');
  const count = cart.filter(c => c.userId === user.id).length;
  res.json({ count });
});
app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ success: false, message: 'Name and message are required.' });
  }
  const messages = readJSON('messages.json');
  messages.push({
    id: 'msg-' + Date.now(),
    name,
    email: email || '',
    phone: phone || '',
    message,
    createdAt: new Date().toISOString()
  });
  writeJSON('messages.json', messages);
  res.status(201).json({ success: true, message: 'Message sent successfully!' });
});
app.get('/messages', (req, res) => {
  const messages = readJSON('messages.json');
  res.json(messages);
});
app.get('/search', (req, res) => {
  const { location } = req.query;
  let properties = readJSON('properties.json');
  if (location && location.trim()) {
    const q = location.trim().toLowerCase();
    properties = properties.filter(p => {
      const loc = (p.location || '').toLowerCase();
      const city = (p.city || '').toLowerCase();
      const area = (p.area || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      return loc.includes(q) || city.includes(q) || area.includes(q) || title.includes(q);
    });
  }
  res.json({
    count: properties.length,
    properties: properties.map(p => ({ ...p, source: 'local' }))
  });
});
app.get('/suggest', (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.json({ cities: [], areas: [], types: [] });
  }
  const query = q.trim().toLowerCase();
  const properties = readJSON('properties.json');
  const citySet = new Set();
  const areaSet = new Set();
  const typeSet = new Set();
  properties.forEach(p => {
    const locParts = (p.location || '').split(',').map(s => s.trim());
    locParts.forEach(part => {
      if (part.toLowerCase().includes(query)) citySet.add(part);
    });
    if (p.city && p.city.toLowerCase().includes(query)) citySet.add(p.city);
    if (p.area && p.area.toLowerCase().includes(query)) areaSet.add(p.area);
    if (p.type && p.type.toLowerCase().includes(query)) typeSet.add(p.type);
    if (p.title && p.title.toLowerCase().includes(query)) {
      areaSet.add(p.title.split(' ').slice(0, 4).join(' '));
    }
  });
  const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Hyderabad', 'Chennai', 'Pune', 'Jaipur', 'Goa', 'Ahmedabad', 'Lucknow', 'Chandigarh', 'Noida', 'Gurgaon', 'Thane', 'Navi Mumbai'];
  indianCities.forEach(c => {
    if (c.toLowerCase().includes(query)) citySet.add(c);
  });
  const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Penthouse'];
  propertyTypes.forEach(t => {
    if (t.toLowerCase().includes(query)) typeSet.add(t);
  });
  res.json({
    cities: [...citySet].slice(0, 6),
    areas: [...areaSet].slice(0, 4),
    types: [...typeSet].slice(0, 4)
  });
});
const chatRateLimit = new Map();
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, reply: 'Please enter a message.' });
  }
  const sessionId = req.session?.id || 'anon';
  const now = Date.now();
  const userLimits = chatRateLimit.get(sessionId) || [];
  const recentRequests = userLimits.filter(t => now - t < 60000);
  if (recentRequests.length >= 10) {
    return res.status(429).json({ success: false, reply: 'Too many requests. Please wait a moment.' });
  }
  recentRequests.push(now);
  chatRateLimit.set(sessionId, recentRequests);
  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_KEY || OPENROUTER_KEY === 'your_openrouter_key_here') {
    return res.json({ success: true, reply: 'AI assistant is not configured. Please add your API key in .env file.' });
  }
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: `You are a helpful, friendly real estate assistant for "Ghar ki Samrat", India's premium property marketplace. You help users find properties across Indian cities like Mumbai, Delhi, Bangalore, Kolkata, Hyderabad, Chennai, Pune, Jaipur, Goa, Ahmedabad. You can:
- Suggest properties based on budget, location, and type
- Answer questions about buying, selling, or renting
- Explain RERA regulations and property documentation
- Provide market insights and investment advice
- Help with home loan calculations
Keep responses concise (2-4 sentences), helpful, and always in a friendly tone. Use ₹ for prices. If asked about something unrelated to real estate, politely redirect.`
        },
        { role: 'user', content: message.trim() }
      ],
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Ghar ki Samrat'
      },
      timeout: 15000
    });
    const reply = response.data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process that. Please try again.';
    res.json({ success: true, reply: reply.trim() });
  } catch (err) {
    console.error('Chat API error:', err.message);
    res.json({ success: true, reply: 'I\'m having trouble connecting right now. Please try again in a moment.' });
  }
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});
app.get('/home', (req, res) => {
  if (req.session && req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/');
  }
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`\n  ✦ Ghar ki Samrat server running at http://localhost:${PORT}`);
  console.log(`  ✦ Auth: Mobile & Password Configured ✓`);
  console.log(`  ✦ AI Search: ${process.env.OPENROUTER_API_KEY ? 'Configured ✓' : 'Not configured (using fallback)'}`);
  console.log(`  ✦ AI Chatbot: ${process.env.OPENROUTER_API_KEY ? 'Configured ✓' : 'Not configured'}\n`);
});