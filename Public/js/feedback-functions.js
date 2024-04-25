// Functions for the feedback html file
//

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

// Function to add feedback as entity into database 
function SubmitFeedback() {
    const name = document.getElementById("floatingInput").value;
    const sportType = document.querySelector(".form-select").value;
    const rating = document.getElementById("customRange").value;

    if (name.length == 0) {
        AppendAlert("Error: 'Name' field is empty");
    }
    else if (sportType === '0') {
        AppendAlert("Error: No sport selected");
    }
    else {
        fetch(`/form-submit?name=${name}&type=${sportType}&rating=${rating}`)
            .catch(error => console.error('Error fetching data:', error));
    }
    document.getElementById("floatingInput").value = "";
    document.querySelector(".form-select").value = 0;
    document.getElementById("customRange").value = 5;
}

// Function to convert sql fetched data into a dictionary
function ConvertData(data) {
    let keys = [];
    let values = [];
    let mentions = [];

    for (let i = 0; i < data.length; i++) {
        const el = data[i];
        const sportName = el.SportName;
        const foundIndex = keys.indexOf(sportName);
        
        if (foundIndex >= 0) {
            values[foundIndex] += parseInt(el.FeedbackGrade);
            mentions[foundIndex]++;
        } 
        else {
            let grade = parseInt(el.FeedbackGrade);
            if (grade == 0 || el.FeedbackGrade == null) {
                grade = 1;
            }
            keys.push(sportName);
            values.push(grade);
            mentions.push(1);
        }
    }
    
    // Convert from sum into average
    for (let i = 0; i < values.length; i++) {
        values[i] /= mentions[i]; 
    }

    return [keys, values];
}
