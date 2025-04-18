
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const projectRoutes = require('./routes/projects');
const taskRoutes    = require('./routes/tasks');

const app = express();


app.use(cors());
app.use(express.json());

// روت‌ها
app.use('/api/projects', projectRoutes);
app.use('/api/tasks',    taskRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  });
})
.catch(err => console.error('❌ MongoDB connection error:', err));
