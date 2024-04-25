// Main js file [module]

// Function that inputs a date and returns the week it belongs to (weekends excluded) in the format DD/MM
function CalculateDateRange(eventDate) {
    // Convert the event date string to a Date object
    var date = new Date(eventDate);
    
    // Find the day of the week (1 = Monday, ..., 6 = Saturday)
    var dayOfWeek = date.getDay();
    
    // Calculate the start date of the week (Monday)
    var startDate = new Date(date);
    startDate.setDate(date.getDate() - dayOfWeek + 1);
    
    // Calculate the end date of the week (Sunday)
    var endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Format the dates as strings in 'DD/MM' format
    var startDateString = startDate.toLocaleString().split("/");
    startDateString.pop();
    var endDateString = endDate.toLocaleString().split("/");
    endDateString.pop();
    
    // Return the date range as an array
    return [startDateString.join("/"), endDateString.join("/")];
}

// Function to map the date of sport to its place in the timetable grid
function MapDateToGrid(eventDate) {
    var date = new Date(eventDate);
    return date.getDay();
}

// Procedure to add a sport
function AddEvent(sportName, teacherName, sportLoc, sportDate, timeStart, timeEnd){
    var sport = document.createElement("div");
    sport.classList.add("sport");

    // Event attributes
    // Event special color
    var color = document.createElement("div");
    color.classList.add("event-color")
    sport.appendChild(color);

    // Main container
    var container = document.createElement("div");
    container.classList.add("event-container");

    // Event location
    var desc = document.createElement("div");
    desc.classList.add("event-desc");

    var loc = document.createElement("p");
    loc.innerText = sportLoc;
    desc.appendChild(loc);

    // Event timing
    var time = document.createElement("p");
    time.innerText = "".concat(timeStart, "-", timeEnd);
    desc.appendChild(time);

    container.appendChild(desc);

    // Event name
    var title = document.createElement("p");
    title.innerText = sportName;
    title.classList.add("event-name");
    container.appendChild(title);

    // Event Teacher name
    var tname = document.createElement("p");
    tname.innerText = teacherName;
    container.appendChild(tname);
    
    sport.appendChild(container);

    document.getElementsByClassName("timetable-day")[MapDateToGrid(sportDate)-1].appendChild(sport);
}

// Function that converts the date from the usual format into SQL format
function ConvertDateToSQL(date) {
    const weekRange = date.innerText.split(" - ");
    const weekStart =  "".concat(new Date().getFullYear(), "-", weekRange[0].split("/").reverse().join("-")); 
    const weekEnd =  "".concat(new Date().getFullYear(), "-", weekRange[1].split("/").reverse().join("-")); 

    // return dates as an array
    return [weekStart, weekEnd];
}

// Procedure to pull the TEACHER and SPORT table contents of the most recent date from the database
function FetchSportsDate() {
    // Clean past sports
    for (let index = 0; index < 5; index++) {
        document.getElementsByClassName("timetable-day")[index].innerHTML = "";
    }

    // Extract dates from the timestamp select
    const dates = document.getElementsByClassName("form-select")[0].options;
    const weekRange = ConvertDateToSQL(dates[dates.selectedIndex]); 

    // Read data with a selected date range
    fetch(`/week?weekStart=${weekRange[0]}&weekEnd=${weekRange[1]}`).then(res => res.json())
        .then(data => {
            data.forEach(element => {
                AddEvent(element.SportName, element.TeacherName, element.LocationName, element.EventDate, element.TimeStart, element.TimeEnd); 
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Procedure to print the currently displayed timetable
function PrintTable() {
    var table = document.getElementById("timetable-container").innerHTML;
    var body = document.body.innerHTML;
    
    // Exchange HTML
    document.body.innerHTML = table;

    // Print the html left
    window.print();

    // Roll back the html changes
    document.body.innerHTML = body;
}

function SuggestionSelect(el) {
    // Clean past sports
    for (let index = 0; index < 5; index++) {
        document.getElementsByClassName("timetable-day")[index].innerHTML = "";
    }
    const select = document.querySelector("#search > select");
    const value = el.innerText;
    const name = select.options[select.selectedIndex].innerText;

    // Extract dates from the timestamp select
    const dates = document.getElementsByClassName("form-select")[0].options;
    const weekRange = ConvertDateToSQL(dates[dates.selectedIndex]); 

    // Read data with a selected value
    fetch(`/data-search?value=${value}&name=${name}&weekStart=${weekRange[0]}&weekEnd=${weekRange[1]}`).then(res => res.json())
        .then(data => {
            data.forEach(element => {
                AddEvent(element.SportName, element.TeacherName, element.LocationName, element.EventDate, element.TimeStart, element.TimeEnd); 
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    document.querySelector("#search > input").value = value;
}

function Search(value, db) {
    // Variable to confirm that results are found
    let resultsFound = false;

    // Clean past sports
    for (let index = 0; index < 5; index++) {
        document.getElementsByClassName("timetable-day")[index].innerHTML = "";
    }
    
    // Search for given query
    for (const i of db) {
        for (const el of i) {
            // If data found, create an event
            if (value != "" && value === el) {
                AddEvent(i[0], i[1], i[2], i[5], i[3], i[4]); 
                resultsFound = true;
            }
        }
    }

    document.querySelector("#search > input").value = "";
    return resultsFound;
}

// Function for creating alerts
function AppendAlert(message) {
    // Create the alert
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
    `<div class="alert alert-danger alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '</div>'
    ].join('');

    setTimeout(function () {
        wrapper.classList.add('active');
    }, 1000);
    // Remove alerts one by one
    setTimeout(function () {
        document.body.removeChild(wrapper);
    }, 2000);
    
    //Append the alert to body
    document.body.appendChild(wrapper);
}
