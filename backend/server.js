import express from 'express';
import cors from 'cors';
import { users, products, pets, reservations, orders, payments } from './data/dummyData.js';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Middleware for simple authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Simple dummy auth - in real app, verify JWT
  next();
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      token: 'dummy-jwt-token-' + user.id,
      user: userWithoutPassword 
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, username, password, phone, address } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email,
    username,
    password,
    phone,
    address,
    role: 'customer',
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ 
    success: true, 
    token: 'dummy-jwt-token-' + newUser.id,
    user: userWithoutPassword 
  });
});

// Products routes
app.get('/api/products', (req, res) => {
  const { search, category } = req.query;
  let filtered = [...products];
  
  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/products', authenticate, (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body,
    stock: req.body.stock || 0
  };
  products.push(newProduct);
  res.json(newProduct);
});

app.put('/api/products/:id', authenticate, (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', authenticate, (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    products.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Pets routes
app.get('/api/pets', authenticate, (req, res) => {
  const userId = parseInt(req.query.userId);
  if (userId) {
    const userPets = pets.filter(p => p.userId === userId);
    res.json(userPets);
  } else {
    res.json(pets);
  }
});

app.get('/api/pets/:id', authenticate, (req, res) => {
  const pet = pets.find(p => p.id === parseInt(req.params.id));
  if (pet) {
    res.json(pet);
  } else {
    res.status(404).json({ error: 'Pet not found' });
  }
});

app.post('/api/pets', authenticate, (req, res) => {
  const newPet = {
    id: pets.length + 1,
    ...req.body
  };
  pets.push(newPet);
  res.json(newPet);
});

app.put('/api/pets/:id', authenticate, (req, res) => {
  const index = pets.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    pets[index] = { ...pets[index], ...req.body };
    res.json(pets[index]);
  } else {
    res.status(404).json({ error: 'Pet not found' });
  }
});

app.delete('/api/pets/:id', authenticate, (req, res) => {
  const index = pets.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    pets.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Pet not found' });
  }
});

// Reservations routes
app.get('/api/reservations', authenticate, (req, res) => {
  const userId = parseInt(req.query.userId);
  if (userId) {
    const userReservations = reservations.filter(r => r.userId === userId);
    res.json(userReservations);
  } else {
    res.json(reservations);
  }
});

app.get('/api/reservations/:id', authenticate, (req, res) => {
  const reservation = reservations.find(r => r.id === parseInt(req.params.id));
  if (reservation) {
    res.json(reservation);
  } else {
    res.status(404).json({ error: 'Reservation not found' });
  }
});

app.post('/api/reservations', authenticate, (req, res) => {
  const newReservation = {
    id: reservations.length + 1,
    ...req.body,
    status: 'menunggu'
  };
  reservations.push(newReservation);
  res.json(newReservation);
});

app.put('/api/reservations/:id', authenticate, (req, res) => {
  const index = reservations.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    reservations[index] = { ...reservations[index], ...req.body };
    res.json(reservations[index]);
  } else {
    res.status(404).json({ error: 'Reservation not found' });
  }
});

app.delete('/api/reservations/:id', authenticate, (req, res) => {
  const index = reservations.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    reservations.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Reservation not found' });
  }
});

// Orders routes
app.get('/api/orders', authenticate, (req, res) => {
  const userId = parseInt(req.query.userId);
  if (userId) {
    const userOrders = orders.filter(o => o.userId === userId);
    res.json(userOrders);
  } else {
    res.json(orders);
  }
});

app.get('/api/orders/:id', authenticate, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.post('/api/orders', authenticate, (req, res) => {
  const { userId, items } = req.body;
  let total = 0;
  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  });
  
  const newOrder = {
    id: orders.length + 1,
    userId,
    items,
    total,
    status: 'menunggu',
    date: new Date().toISOString().split('T')[0]
  };
  orders.push(newOrder);
  res.json(newOrder);
});

app.put('/api/orders/:id', authenticate, (req, res) => {
  const index = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (index !== -1) {
    orders[index] = { ...orders[index], ...req.body };
    res.json(orders[index]);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Payments routes
app.get('/api/payments', authenticate, (req, res) => {
  const userId = parseInt(req.query.userId);
  if (userId) {
    const userPayments = payments.filter(p => {
      const order = orders.find(o => o.id === p.orderId);
      return order && order.userId === userId;
    });
    res.json(userPayments);
  } else {
    res.json(payments);
  }
});

app.get('/api/payments/:id', authenticate, (req, res) => {
  const payment = payments.find(p => p.id === parseInt(req.params.id));
  if (payment) {
    res.json(payment);
  } else {
    res.status(404).json({ error: 'Payment not found' });
  }
});

app.post('/api/payments', authenticate, (req, res) => {
  const { orderId, amount, method, proof } = req.body;
  const newPayment = {
    id: payments.length + 1,
    orderId,
    amount,
    method,
    proof,
    status: 'menunggu',
    date: new Date().toISOString().split('T')[0]
  };
  payments.push(newPayment);
  
  // Update order status
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = 'dikonfirmasi';
  }
  
  res.json(newPayment);
});

app.put('/api/payments/:id', authenticate, (req, res) => {
  const index = payments.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    payments[index] = { ...payments[index], ...req.body };
    
    // Update order status based on payment status
    if (req.body.status === 'terverifikasi') {
      const orderIndex = orders.findIndex(o => o.id === payments[index].orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].status = 'selesai';
      }
    }
    
    res.json(payments[index]);
  } else {
    res.status(404).json({ error: 'Payment not found' });
  }
});

// Users routes (admin only)
app.get('/api/users', authenticate, (req, res) => {
  const usersWithoutPassword = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPassword);
});

app.get('/api/users/:id', authenticate, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/api/users/:id', authenticate, (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    const { password, ...userWithoutPassword } = users[index];
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Stats route for admin
app.get('/api/stats', authenticate, (req, res) => {
  res.json({
    totalUsers: users.length,
    totalProducts: products.length,
    totalPets: pets.length,
    totalReservations: reservations.length,
    totalOrders: orders.length,
    totalPayments: payments.length,
    totalRevenue: payments.filter(p => p.status === 'terverifikasi').reduce((sum, p) => sum + p.amount, 0)
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
