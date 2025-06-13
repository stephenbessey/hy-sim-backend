const pgp = require('pg-promise')();
require('dotenv').config();

// Database connection
const db = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Default athletes data
const defaultAthletes = [
  {
    name: 'Hunter McIntyre',
    category: 'men',
    total_time: 3420, // 57:00
    events: [
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
    ]
  },
  {
    name: 'Lauren Weeks',
    category: 'women',
    total_time: 3840, // 64:00
    events: [
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
    ]
  },
  {
    name: 'Jake Dearden',
    category: 'men',
    total_time: 3240, // 54:00
    events: [
      { name: '1km Run', duration: 175, color: '#feed00' },
      { name: '1000m SkiErg', duration: 190, color: '#feed00' },
      { name: '1km Run', duration: 180, color: '#feed00' },
      { name: '50m Sled Push', duration: 70, color: '#feed00' },
      { name: '1km Run', duration: 185, color: '#feed00' },
      { name: '50m Sled Pull', duration: 80, color: '#feed00' },
      { name: '1km Run', duration: 183, color: '#feed00' },
      { name: '80m Burpee Broad Jumps', duration: 200, color: '#feed00' },
      { name: '1km Run', duration: 187, color: '#feed00' },
      { name: '100m Rowing', duration: 190, color: '#feed00' },
      { name: '1km Run', duration: 185, color: '#feed00' },
      { name: '200m Farmers Carry', duration: 175, color: '#feed00' },
      { name: '1km Run', duration: 190, color: '#feed00' },
      { name: '100m Sandbag Lunges', duration: 230, color: '#feed00' },
      { name: '1km Run', duration: 195, color: '#feed00' },
      { name: '100 Wall Balls', duration: 495, color: '#feed00' }
    ]
  },
  {
    name: 'Faye Stenning',
    category: 'women',
    total_time: 3600, // 60:00
    events: [
      { name: '1km Run', duration: 200, color: '#feed00' },
      { name: '1000m SkiErg', duration: 190, color: '#feed00' },
      { name: '1km Run', duration: 205, color: '#feed00' },
      { name: '50m Sled Push', duration: 90, color: '#feed00' },
      { name: '1km Run', duration: 210, color: '#feed00' },
      { name: '50m Sled Pull', duration: 100, color: '#feed00' },
      { name: '1km Run', duration: 208, color: '#feed00' },
      { name: '80m Burpee Broad Jumps', duration: 270, color: '#feed00' },
      { name: '1km Run', duration: 212, color: '#feed00' },
      { name: '100m Rowing', duration: 220, color: '#feed00' },
      { name: '1km Run', duration: 210, color: '#feed00' },
      { name: '200m Farmers Carry', duration: 200, color: '#feed00' },
      { name: '1km Run', duration: 215, color: '#feed00' },
      { name: '100m Sandbag Lunges', duration: 290, color: '#feed00' },
      { name: '1km Run', duration: 220, color: '#feed00' },
      { name: '75 Wall Balls', duration: 400, color: '#feed00' }
    ]
  },
  {
    name: 'Ryan Kent',
    category: 'men',
    total_time: 3300, // 55:00
    events: [
      { name: '1km Run', duration: 178, color: '#feed00' },
      { name: '1000m SkiErg', duration: 192, color: '#feed00' },
      { name: '1km Run', duration: 182, color: '#feed00' },
      { name: '50m Sled Push', duration: 72, color: '#feed00' },
      { name: '1km Run', duration: 188, color: '#feed00' },
      { name: '50m Sled Pull', duration: 82, color: '#feed00' },
      { name: '1km Run', duration: 185, color: '#feed00' },
      { name: '80m Burpee Broad Jumps', duration: 205, color: '#feed00' },
      { name: '1km Run', duration: 190, color: '#feed00' },
      { name: '100m Rowing', duration: 192, color: '#feed00' },
      { name: '1km Run', duration: 188, color: '#feed00' },
      { name: '200m Farmers Carry', duration: 178, color: '#feed00' },
      { name: '1km Run', duration: 192, color: '#feed00' },
      { name: '100m Sandbag Lunges', duration: 235, color: '#feed00' },
      { name: '1km Run', duration: 198, color: '#feed00' },
      { name: '100 Wall Balls', duration: 503, color: '#feed00' }
    ]
  },
  {
    name: 'Tia-Clair Toomey',
    category: 'women',
    total_time: 3720, // 62:00
    events: [
      { name: '1km Run', duration: 205, color: '#feed00' },
      { name: '1000m SkiErg', duration: 192, color: '#feed00' },
      { name: '1km Run', duration: 210, color: '#feed00' },
      { name: '50m Sled Push', duration: 92, color: '#feed00' },
      { name: '1km Run', duration: 215, color: '#feed00' },
      { name: '50m Sled Pull', duration: 102, color: '#feed00' },
      { name: '1km Run', duration: 213, color: '#feed00' },
      { name: '80m Burpee Broad Jumps', duration: 275, color: '#feed00' },
      { name: '1km Run', duration: 217, color: '#feed00' },
      { name: '100m Rowing', duration: 222, color: '#feed00' },
      { name: '1km Run', duration: 215, color: '#feed00' },
      { name: '200m Farmers Carry', duration: 205, color: '#feed00' },
      { name: '1km Run', duration: 220, color: '#feed00' },
      { name: '100m Sandbag Lunges', duration: 295, color: '#feed00' },
      { name: '1km Run', duration: 225, color: '#feed00' },
      { name: '75 Wall Balls', duration: 412, color: '#feed00' }
    ]
  }
];

async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...\n');
    
    // Drop existing tables (cascade will handle foreign keys)
    console.log('🗑️  Dropping existing tables...');
    await db.none('DROP TABLE IF EXISTS events CASCADE');
    await db.none('DROP TABLE IF EXISTS athletes CASCADE');
    console.log('✅ Tables dropped successfully\n');
    
    // Create athletes table
    console.log('🏗️  Creating athletes table...');
    await db.none(`
      CREATE TABLE athletes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        category VARCHAR(20) NOT NULL CHECK (category IN ('men', 'women')),
        total_time INTEGER NOT NULL CHECK (total_time > 0),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Athletes table created\n');
    
    // Create events table
    console.log('🏗️  Creating events table...');
    await db.none(`
      CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        duration INTEGER NOT NULL CHECK (duration > 0),
        color VARCHAR(7) DEFAULT '#feed00',
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(athlete_id, order_index)
      )
    `);
    console.log('✅ Events table created\n');
    
    // Create indexes for better performance
    console.log('📊 Creating indexes...');
    await db.none('CREATE INDEX idx_athletes_category ON athletes(category)');
    await db.none('CREATE INDEX idx_athletes_total_time ON athletes(total_time)');
    await db.none('CREATE INDEX idx_events_athlete_id ON events(athlete_id)');
    await db.none('CREATE INDEX idx_events_order ON events(athlete_id, order_index)');
    console.log('✅ Indexes created\n');
    
    // Insert default athletes and their events
    console.log('🏃 Inserting default athletes...');
    for (const athleteData of defaultAthletes) {
      // Insert athlete
      const athlete = await db.one(`
        INSERT INTO athletes (name, category, total_time)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [athleteData.name, athleteData.category, athleteData.total_time]);
      
      // Insert events for this athlete
      for (let i = 0; i < athleteData.events.length; i++) {
        const event = athleteData.events[i];
        await db.none(`
          INSERT INTO events (athlete_id, name, duration, color, order_index)
          VALUES ($1, $2, $3, $4, $5)
        `, [athlete.id, event.name, event.duration, event.color, i]);
      }
      
      console.log(`✅ Added athlete: ${athleteData.name} (${athleteData.events.length} events)`);
    }
    
    console.log('\n📊 Database reset completed successfully!');
    console.log(`📈 Total athletes added: ${defaultAthletes.length}`);
    console.log(`🏃 Men's division: ${defaultAthletes.filter(a => a.category === 'men').length}`);
    console.log(`🏃‍♀️ Women's division: ${defaultAthletes.filter(a => a.category === 'women').length}`);
    
    // Verify the data
    const athleteCount = await db.one('SELECT COUNT(*) as count FROM athletes');
    const eventCount = await db.one('SELECT COUNT(*) as count FROM events');
    console.log(`\n🔍 Verification:`);
    console.log(`📊 Athletes in database: ${athleteCount.count}`);
    console.log(`🎯 Events in database: ${eventCount.count}`);
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    pgp.end();
  }
}

// Check if script is run directly
if (require.main === module) {
  console.log('🚀 Hyrox Simulator - Database Reset\n');
  console.log('⚠️  WARNING: This will completely reset your database!');
  console.log('⚠️  All existing data will be lost!\n');
  
  // Add a confirmation prompt
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      resetDatabase().then(() => {
        console.log('\n🎉 Database reset completed successfully!');
        process.exit(0);
      });
    } else {
      console.log('❌ Database reset cancelled.');
      process.exit(0);
    }
    rl.close();
  });
} else {
  // Export for use in other scripts
  module.exports = { resetDatabase, defaultAthletes };
}