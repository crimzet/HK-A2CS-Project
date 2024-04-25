// Workflow file
//

let dbContents = [];

// Preload database data
fetch(`/data`).then(res => res.json())
    .then(data => {
        for (let i in data) {
            dbContents.push(Object.values(data[i]));
        }
    })
    .catch(error => console.error('Error fetching data:', error));

// Event listener for different data types
document.querySelector("#search > select").addEventListener("change", function() {
    let input = document.querySelector("#search > input");

    if (this.value == "1" || this.value == "2") {
        input.placeholder = "Enter text...";
        input.maxLength = 255;
    }
    if (this.value == "3") {
        input.placeholder = "yyyy-mm-dd";
        input.maxLength = 10;
    }
    if (this.value == "4") {
        input.placeholder = "hh:mm";
        input.maxLength = 5;
    }
});

// Event listener for search suggestions
document.querySelector("#search > input").addEventListener("input", function() {

    let inputType = document.querySelector("#search > select").value;

    // set specialised input style if date is entered
    if (inputType == "3") {
        // Remove that is not a digit
        let value = this.value.replace(/\D/g, '');
        // Automatically add dashes after the year and month
        value = value.replace(/^(\d{4})(\d)/, '$1-$2').replace(/-(\d{2})(\d)/, '-$1-$2');
        value = value.substr(0, 10);
        this.value = value;
    }
    // same for time
    if (inputType == "4") {
        // Remove that is not a digit
        let value = this.value.replace(/\D/g, '');
        // Automatically add dashes after the year and month
        value = value.replace(/^(\d{2})(\d)/, '$1:$2');
        value = value.substr(0, 5);
        this.value = value;
    }

    document.getElementsByClassName("dropdown-menu")[0].innerHTML = "";
    let suggestions = [];

    // Loop through the database
    for (const i of dbContents) {
        if (this.value != "") {
            if (inputType == "1") {
                let field = [i[0], i[1]];
                for (const x of field) {
                    if (x.toLowerCase().startsWith(this.value.toLowerCase())) {
                        // Append to an array
                        suggestions.push(x);
                    }

                }
            }
            if (inputType == "2") {
                let x = i[2];
                if (x.toLowerCase().startsWith(this.value.toLowerCase())) {
                    // Append to an array
                    suggestions.push(x);
                }

            }
            if (inputType == "3") {
                let x = i[5];
                if (x.startsWith(this.value)) {
                    // Append to an array
                    suggestions.push(x);
                }

            }
            if (inputType == "4") {
                let field = [i[3], i[4]];
                for (const x of field) {
                    if (x.startsWith(this.value)) {
                        // Append to an array
                        suggestions.push(x);
                    }

                }
            }
        }
    }

    // Make so that the list only contains unique items
    suggestions = Array.from(new Set(suggestions));

    // Highlight each suggestion's matched part
    suggestions = suggestions.map(element => "<b>" + element.substr(0, this.value.length) + "</b>" + element.substr(this.value.length));

    // Map each suggestion to a list element
    let suggestionHtml = suggestions.map(element => `<li><a onclick="SuggestionSelect(this)" class="dropdown-item">${element}</a></li>`).join('');
    
    // Create a suggestion element for that
    document.getElementsByClassName("dropdown-menu")[0].innerHTML += suggestionHtml;
});

// Event listener when the enter button is pressed
document.querySelector("#search > input").addEventListener("search", function() {
    if (this.value == "") {
        AppendAlert("Error: No data entered.");
    }
    else {
        if (!Search(this.value, dbContents)) {
            AppendAlert("Error: Entered data doesn\'t exist.")
        }
    }
});

// Filling the timestamp select
var tStamp = document.getElementsByClassName("form-select")[0];
for (let index = 0; index < 3; index++) {
    var lastWeekDate = new Date(new Date() - 7*24*3600*1000);
    var dateRange = CalculateDateRange(new Date(lastWeekDate.getTime() + index*7*24*3600*1000));
    tStamp.options[index].innerText = dateRange[0].concat(" - ", dateRange[1]);
}

// Fetch for initially selected date
FetchSportsDate();
