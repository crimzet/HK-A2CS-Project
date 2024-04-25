import sqlite3

sportArray = [["Volleyball"], ["Football"], ["Basketball"], ["Rugby"]]

locationArray = [["Kelsey Kerridge"], ["15 Station Road"]]

teacherArray = [["Andy Hillton"], ["William Van Boesschoten"], ["George Self"]]

eventArray = [[1, 1, 1, "16:00", "17:00", "2024-04-08"],
        [3, 2, 1, "16:00", "17:00", "2024-04-09"],
        [4, 3, 2, "15:00", "16:00", "2024-04-10"],
        [1, 1, 1, "15:00", "16:00", "2024-04-11"],
        [1, 1, 1, "16:00", "17:00", "2024-04-12"],
        [3, 2, 1, "16:00", "17:00", "2024-04-12"],
        [1, 1, 1, "16:00", "17:00", "2024-04-15"],
        [3, 2, 1, "16:00", "17:00", "2024-04-16"],
        [4, 3, 2, "15:00", "16:00", "2024-04-18"],
        [1, 1, 1, "15:00", "16:00", "2024-04-19"],
        [1, 1, 1, "16:00", "17:00", "2024-04-20"],
        [3, 2, 1, "16:00", "17:00", "2024-04-20"]]

newsArray = [["Volleyball session cancelled", "Lorem ipsum dolor", "2024-02-20"], ["Basketball competition results", "As the result of a basketball competition the ending score was 51:20 in favour of St Andrew\'s college!", "2024-02-22"]
        ]

feedbackArray = [["John Doe", 1, 5], ["Alex Smith", 2, 10]]

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('database.db')

# Create a cursor object using the cursor method of the connection
cursor = conn.cursor()

sports_table = '''
CREATE TABLE IF NOT EXISTS SPORT (
    SportID INTEGER PRIMARY KEY AUTOINCREMENT,
    SportName VARCHAR(255)
)
'''

location_table = '''
CREATE TABLE IF NOT EXISTS LOCATION (
    LocationID INTEGER PRIMARY KEY AUTOINCREMENT,
    LocationName TEXT
)
'''

teacher_table = '''
CREATE TABLE IF NOT EXISTS TEACHER (
    TeacherID INTEGER PRIMARY KEY AUTOINCREMENT,
    TeacherName VARCHAR(255)
)
'''

event_table = '''
CREATE TABLE IF NOT EXISTS EVENT (
    EventID INTEGER PRIMARY KEY AUTOINCREMENT,
    SportID INTEGER,
    TeacherID INTEGER,
    LocationID INTEGER,
    TimeStart TIME(0),
    TimeEnd TIME(0),
    EventDate DATE,
    FOREIGN KEY (SportID) REFERENCES SPORT(SportID),
    FOREIGN KEY (TeacherID) REFERENCES TEACHER(TeacherID),
    FOREIGN KEY (LocationID) REFERENCES LOCATION(LocationID)
)
'''

news_table = '''
CREATE TABLE IF NOT EXISTS ARTICLE (
    ArticleID INTEGER PRIMARY KEY AUTOINCREMENT,
    ArticleTitle VARCHAR(255),
    ArticleDesc TEXT,
    TimeStamp DATE
)
'''

feedback_table = '''
CREATE TABLE IF NOT EXISTS FEEDBACK (
    FeedbackID INTEGER PRIMARY KEY AUTOINCREMENT,
    FeedbackName TEXT,
    SportID INTEGER NOT NULL,
    FeedbackGrade INTEGER,
    FOREIGN KEY (SportID) REFERENCES SPORT(SportID)
)
'''

# SQL statement to add info to any table
def insert_data(array, table):
    name = table.split()[5]
    values = table.split("(", maxsplit=1)[1]
    values = [x.split()[0] for x in values.split(",\n")]
    values = values[1:]
    filtered_values = list(filter(lambda x: x[1].islower(), values))
    res = f"INSERT INTO {name} ({', '.join(filtered_values)}) VALUES "
    for entity in array:
        res += '( '
        for element in entity:
            res += str(f'''\"{element}\", ''')
        res = res[:-2]
        res += '), '
    res = res[:-2]
    res += ';'
    return res


# Execute the SQL statement to create the tables
cursor.execute(sports_table)
cursor.execute(location_table)
cursor.execute(teacher_table)
cursor.execute(event_table)
cursor.execute(news_table)
cursor.execute(feedback_table)

# Execute the SQL statement to add values
cursor.execute(insert_data(sportArray, sports_table))
cursor.execute(insert_data(teacherArray, teacher_table))
cursor.execute(insert_data(locationArray, location_table))
cursor.execute(insert_data(eventArray, event_table))
cursor.execute(insert_data(newsArray, news_table))
cursor.execute(insert_data(feedbackArray, feedback_table))


# Commit the changes and close the connection
conn.commit()
conn.close()

print("Database and table created successfully.")

