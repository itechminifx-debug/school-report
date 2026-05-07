const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DATA_FILE = path.join(__dirname, 'shared_data.json');

// Load or create shared data file
function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (e) {
        console.log('Error loading data, creating new file');
    }
    return {
        students: [],
        teachers: [
            { title: 'Mr.', name: 'Mensah' },
            { title: 'Mrs.', name: 'Appiah' },
            { title: 'Mr.', name: 'Osei' },
            { title: 'Ms.', name: 'Asante' },
            { title: 'Mr.', name: 'Boadu' }
        ],
        scores: {},
        settings: {},
        personality: {}
    };
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// MIME types for serving files
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

// Create server
const server = http.createServer((req, res) => {
    // Enable CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = url.pathname;

    // ==================== API ROUTES ====================

    // GET /api/data - Get all shared data
    if (pathname === '/api/data' && req.method === 'GET') {
        const data = loadData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }

    // POST /api/data - Save all shared data
    if (pathname === '/api/data' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const newData = JSON.parse(body);
                saveData(newData);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Data saved!' }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
            }
        });
        return;
    }

    // POST /api/students - Add a student
    if (pathname === '/api/students' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const student = JSON.parse(body);
                const data = loadData();
                data.students.push(student);
                saveData(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, student }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
            }
        });
        return;
    }

    // DELETE /api/students - Delete a student
    if (pathname === '/api/students' && req.method === 'DELETE') {
        const studentId = url.searchParams.get('id');
        const data = loadData();
        data.students = data.students.filter(s => s.id !== studentId);
        saveData(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
    }

    // POST /api/teachers - Add a teacher
    if (pathname === '/api/teachers' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const teacher = JSON.parse(body);
                const data = loadData();
                data.teachers.push(teacher);
                saveData(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, teacher }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
            }
        });
        return;
    }

    // DELETE /api/teachers - Delete a teacher
    if (pathname === '/api/teachers' && req.method === 'DELETE') {
        const index = parseInt(url.searchParams.get('index'));
        const data = loadData();
        if (index >= 0 && index < data.teachers.length) {
            data.teachers.splice(index, 1);
            saveData(data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
    }

    // ==================== SERVE STATIC FILES ====================
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('============================================');
    console.log('  SCHOOL REPORT PORTAL - SHARED SERVER');
    console.log('============================================');
    console.log(`  Server running at: http://0.0.0.0:${PORT}`);
    console.log(`  Data file: ${DATA_FILE}`);
    console.log('============================================');
    console.log('  All devices on the same WiFi can now');
    console.log('  access and share the same data!');
    console.log('============================================');
});