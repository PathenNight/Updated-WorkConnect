const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const useHttps = process.env.USE_HTTPS === 'true';

// --- Middleware ---
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', // Allow CORS from the React dev server
    credentials: true,
}));

// --- Static Files ---
app.use(express.static(path.join(__dirname, 'Frontend')));

// --- Database Setup ---
const pool = require('./config/db');
(async () => {
    try {
        const setupDatabase = require('./config/setupDatabase');
        await setupDatabase();
        console.log('Database setup complete.');
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    }
})();

// --- Get Local IP Address ---
function getLocalIP() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const details of iface) {
            if (details.family === 'IPv4' && !details.internal) {
                return details.address; // Return local IP address
            }
        }
    }
    return 'localhost';
}

// --- HTTPS Server Setup ---
if (useHttps) {
    try {
        const httpsOptions = {
            key: fs.readFileSync(path.join(__dirname, 'certificates', 'server.key')),
            cert: fs.readFileSync(path.join(__dirname, 'certificates', 'server.cert')),
        };

        https.createServer(httpsOptions, app).listen(port, '0.0.0.0', () => {
            console.log(`HTTPS server running at https://${getLocalIP()}:${port}`);
        });
    } catch (error) {
        console.error('Failed to start HTTPS server:', error.message);
        process.exit(1);
    }
} else {
    app.listen(port, '0.0.0.0', () => {
        console.log(`HTTP server running at http://${getLocalIP()}:${port}`);
    });
}

// --- Routes ---
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');
const messageRoutes = require('./routes/message');
const calendarRoutes = require('./routes/calendar');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task');

app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// --- Root Route ---
app.get('/', (req, res) => {
    res.send('Welcome to the WorkConnect backend!');
});

// --- Error Handling ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// --- Graceful Shutdown ---
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    process.exit(0);
});
