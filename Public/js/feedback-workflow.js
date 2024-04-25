// Workflow of feedback webpage
//

// Pull feedback data from the database into the chart
const ctx = document.getElementById("chart");
fetch(`/get-feedback`).then(res => res.json())
    .then(data => {
        console.log(data);
        convertedData= ConvertData(data);
        // Create a chart with student feedback
        new Chart(ctx, {
        type: 'bar',
        data: {
            labels: convertedData[0],
            datasets: [{
                label: 'Average grade of #',
                data: convertedData[1],
                borderWidth: 1,
                maxBarThickness: 100
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
        });
    })
    .catch(error => console.error('Error fetching data:', error));


// Initialize tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Dyncamically set tooltip's text to the range value
document.getElementById("customRange").addEventListener('change', function () {
    const tooltip = bootstrap.Tooltip.getInstance('#customRange'); // Returns a Bootstrap tooltip instance

    // setContent example
    tooltip.setContent({ '.tooltip-inner': this.value });
});

// Submit data into the database when the button is pressed
document.querySelector("#feedback-form > button").addEventListener('click', function () {
    SubmitFeedback();
});
