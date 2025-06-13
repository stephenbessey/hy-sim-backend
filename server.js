const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const db = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all athletes
app.get('/api/athletes', async (req, res) => {
  try {
    const athletes = await db.any(`
      SELECT a.*, 
             json_agg(
               json_build_object(
                 'name', e.name,
                 'duration', e.duration,
                 'color', e.color,
                 'order_index', e.order_index
               ) ORDER BY e.order_index
             ) as events
      FROM athletes a
      LEFT JOIN events e ON a.id = e.athlete_id
      GROUP BY a.id
      ORDER BY a.category, a.total_time
    `);
    
    res.json(athletes);
  } catch (error) {
    console.error('Error fetching athletes:', error);
    res.status(500).json({ error: 'Failed to fetch athletes' });
  }
});

// Get athlete by ID
app.get('/api/athletes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const athlete = await db.oneOrNone(`
      SELECT a.*, 
             json_agg(
               json_build_object(
                 'name', e.name,
                 'duration', e.duration,
                 'color', e.color,
                 'order_index', e.order_index
               ) ORDER BY e.order_index
             ) as events
      FROM athletes a
      LEFT JOIN events e ON a.id = e.athlete_id
      WHERE a.id = $1
      GROUP BY a.id
    `, [id]);
    
    if (!athlete) {
      return res.status(404).json({ error: 'Athlete not found' });
    }
    
    res.json(athlete);
  } catch (error) {
    console.error('Error fetching athlete:', error);
    res.status(500).json({ error: 'Failed to fetch athlete' });
  }
});

// Admin endpoint to seed more athletes (you can use this via API calls)
app.post('/api/admin/athletes', async (req, res) => {
  try {
    const { name, category, total_time, events } = req.body;
    
    // Validate required fields
    if (!name || !category || !total_time || !events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Start transaction
    await db.tx(async (t) => {
      // Insert athlete
      const athlete = await t.one(`
        INSERT INTO athletes (name, category, total_time)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [name, category, total_time]);
      
      // Insert events
      if (events.length > 0) {
        const eventInserts = events.map((event, index) => ({
          athlete_id: athlete.id,
          name: event.name,
          duration: event.duration,
          color: event.color || '#feed00',
          order_index: index
        }));
        
        await t.none(pgp.helpers.insert(eventInserts, ['athlete_id', 'name', 'duration', 'color', 'order_index'], 'events'));
      }
      
      // Fetch complete athlete data
      const completeAthlete = await t.one(`
        SELECT a.*, 
               json_agg(
                 json_build_object(
                   'name', e.name,
                   'duration', e.duration,
                   'color', e.color,
                   'order_index', e.order_index
                 ) ORDER BY e.order_index
               ) as events
        FROM athletes a
        LEFT JOIN events e ON a.id = e.athlete_id
        WHERE a.id = $1
        GROUP BY a.id
      `, [athlete.id]);
      
      res.status(201).json(completeAthlete);
    });
    
  } catch (error) {
    console.error('Error creating athlete:', error);
    res.status(500).json({ error: 'Failed to create athlete' });
  }
});

// Initialize database tables
app.post('/api/init-db', async (req, res) => {
  try {
    await initializeDatabase();
    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// Database initialization function
async function initializeDatabase() {
  try {
    // Create tables
    await db.none(`
      CREATE TABLE IF NOT EXISTS athletes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(20) NOT NULL CHECK (category IN ('men', 'women')),
        total_time INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.none(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        duration INTEGER NOT NULL,
        color VARCHAR(7) DEFAULT '#feed00',
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert default athletes if they don't exist
    const existingAthletes = await db.oneOrNone('SELECT COUNT(*) as count FROM athletes');
    
    if (existingAthletes.count === 0) {
      console.log('Seeding database with default athletes...');
      
      // Insert Hunter McIntyre
      const hunter = await db.one(`
        INSERT INTO athletes (name, category, total_time)
        VALUES ('Hunter McIntyre', 'men', 3420)
        RETURNING id
      `);
      
      const hunterEvents = [
        { name: '1km Run', duration: 180, color: '#feed00' },
        { name: '1000m SkiErg', duration: 195, color: '#feed00' },
        { name: '1km Run', duration: 185, color: '#feed00' },
        { name: '50m Sled Push', duration: 75, color: '#feed00' },
        { name: '1km Run', duration: 190, color: '#feed00' },
        { name: '50m Sled Pull', duration: 85, color: '#feed00' },
        { name: '1km Run', duration: 188, color: '#feed00' },
        { name: '80m Burpee Broad Jumps', duration: 210, color: '#feed00' },
        { name: '1km Run', duration: 192, color: '#feed00' },
        { name: '100m Rowing', duration: 195, color: '#feed00' },
        { name: '1km Run', duration: 190, color: '#feed00' },
        { name: '200m Farmers Carry', duration: 180, color: '#feed00' },
        { name: '1km Run', duration: 195, color: '#feed00' },
        { name: '100m Sandbag Lunges', duration: 240, color: '#feed00' },
        { name: '1km Run', duration: 200, color: '#feed00' },
        { name: '100 Wall Balls', duration: 510, color: '#feed00' }
      ];
      
      for (let i = 0; i < hunterEvents.length; i++) {
        await db.none(`
          INSERT INTO events (athlete_id, name, duration, color, order_index)
          VALUES ($1, $2, $3, $4, $5)
        `, [hunter.id, hunterEvents[i].name, hunterEvents[i].duration, hunterEvents[i].color, i]);
      }
      
      // Insert Lauren Weeks
      const lauren = await db.one(`
        INSERT INTO athletes (name, category, total_time)
        VALUES ('Lauren Weeks', 'women', 3840)
        RETURNING id
      `);
      
      const laurenEvents = [
        { name: '1km Run', duration: 210, color: '#feed00' },
        { name: '1000m SkiErg', duration: 195, color: '#feed00' },
        { name: '1km Run', duration: 215, color: '#feed00' },
        { name: '50m Sled Push', duration: 95, color: '#feed00' },
        { name: '1km Run', duration: 220, color: '#feed00' },
        { name: '50m Sled Pull', duration: 105, color: '#feed00' },
        { name: '1km Run', duration: 218, color: '#feed00' },
        { name: '80m Burpee Broad Jumps', duration: 280, color: '#feed00' },
        { name: '1km Run', duration: 222, color: '#feed00' },
        { name: '100m Rowing', duration: 225, color: '#feed00' },
        { name: '1km Run', duration: 220, color: '#feed00' },
        { name: '200m Farmers Carry', duration: 210, color: '#feed00' },
        { name: '1km Run', duration: 225, color: '#feed00' },
        { name: '100m Sandbag Lunges', duration: 300, color: '#feed00' },
        { name: '1km Run', duration: 230, color: '#feed00' },
        { name: '75 Wall Balls', duration: 420, color: '#feed00' }
      ];
      
      for (let i = 0; i < laurenEvents.length; i++) {
        await db.none(`
          INSERT INTO events (athlete_id, name, duration, color, order_index)
          VALUES ($1, $2, $3, $4, $5)
        `, [lauren.id, laurenEvents[i].name, laurenEvents[i].duration, laurenEvents[i].color, i]);
      }
      
      console.log('Database seeded successfully');
    }
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
});

module.exports = app;