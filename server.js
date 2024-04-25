const express = require("express");
const sqlite = require("sqlite3");
const path = require("path");

// Initiate express js
const app = express();
const port = 3000;

// Link to the 'public' folder
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html',  'timetable.html'));
});

app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html',  'news.html'));
});

app.get('/feedback', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html',  'feedback.html'));
});

// Open the database + check for errors
let db = new sqlite.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

app.get('/news-data', (req, res) => {
    const sql = "SELECT * FROM ARTICLE";
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows); // Send data as JSON
    });
});

app.get('/form-submit', (req, res) => {
    const {name, type, rating} = req.query; // Extract both form values from query
    if (name.length != 0 && type.length != 0) {
        const sql = "INSERT INTO FEEDBACK (FeedbackName, SportID, FeedbackGrade) VALUES (?, ?, ?)";
        db.all(sql, [name, type, rating], (err, rows) => {
            if (err) {
                throw err;
            }
            res.json(rows); // Send data as JSON
        });
    }
});

app.get('/get-feedback', (req, res) => {
    const sql = "SELECT FEEDBACK.FeedbackName, FEEDBACK.FeedbackGrade, SPORT.SportName FROM FEEDBACK RIGHT JOIN SPORT ON FEEDBACK.SportID = SPORT.SportID";
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows); // Send data as JSON
    });
})

app.get('/data', (req, res) => {
    const sql = "SELECT SPORT.SportName, TEACHER.TeacherName, LOCATION.LocationName, EVENT.TimeStart, EVENT.TimeEnd, EVENT.EventDate FROM EVENT INNER JOIN SPORT ON EVENT.SportID = SPORT.SportID INNER JOIN LOCATION ON EVENT.LocationID = LOCATION.LocationID INNER JOIN TEACHER ON EVENT.TeacherID = TEACHER.TeacherID";
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows); // Send data as JSON
    });
});

app.get('/week', (req, res) => {
    const {weekStart, weekEnd} = req.query; // Extract both weekStart and weekEnd from query
    const sql = "SELECT SPORT.SportName, TEACHER.TeacherName, LOCATION.LocationName, EVENT.TimeStart, EVENT.TimeEnd, EVENT.EventDate FROM EVENT INNER JOIN SPORT ON EVENT.SportID = SPORT.SportID INNER JOIN LOCATION ON EVENT.LocationID = LOCATION.LocationID INNER JOIN TEACHER ON EVENT.TeacherID = TEACHER.TeacherID WHERE EVENT.EventDate BETWEEN ? AND ?";
    db.all(sql, [weekStart, weekEnd], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows); // Send data as JSON
    });
});

app.get('/data-search', (req, res) => {
    const {value, name, weekStart, weekEnd} = req.query; // Extract both element and their name from query
    var sql = "SELECT SPORT.SportName, TEACHER.TeacherName, LOCATION.LocationName, EVENT.TimeStart, EVENT.TimeEnd, EVENT.EventDate FROM EVENT INNER JOIN SPORT ON EVENT.SportID = SPORT.SportID INNER JOIN LOCATION ON EVENT.LocationID = LOCATION.LocationID INNER JOIN TEACHER ON EVENT.TeacherID = TEACHER.TeacherID WHERE ";
    if (name == "Name") sql += "(SPORT.SportName = ? OR TEACHER.TeacherName = ?)";
    if (name == "Location") sql += "(LOCATION.LocationName = ? OR LOCATION.LocationName = ?)";
    if (name == "Time") sql += "(EVENT.TimeStart = ? OR EVENT.TimeEnd = ?)";
    if (name == "Date") sql += "(EVENT.EventDate = ? OR EVENT.EventDate = ?)";
    sql += " AND EVENT.EventDate BETWEEN ? AND ?";
    db.all(sql, [value, value, weekStart, weekEnd], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows); // Send data as JSON
    });
});

// Send a message if port is available
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
