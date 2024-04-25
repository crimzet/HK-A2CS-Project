// Procedure to add a news article
function AddArticle(artTitle, artText){
    // Create main card div
    var card = document.createElement("div");
    card.className = "card mb-3";

    // Create row div
    var row = document.createElement("div");
    row.className = "row g-0";
    card.appendChild(row);

    // Create first column for image
    var colImg = document.createElement("div");
    colImg.className = "col-md-4";
    row.appendChild(colImg);

    // Create img tag
    var img = document.createElement("img");
    img.src = "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=300"; // Replace '...' with the actual image source
    img.className = "img-fluid rounded-start";
    img.alt = "..."; // Replace '...' with appropriate alternative text
    colImg.appendChild(img);

    // Create second column
    var colText = document.createElement("div");
    colText.className = "col-md-8";
    row.appendChild(colText);

    // Create card body div
    var cardBody = document.createElement("div");
    cardBody.className = "card-body";
    colText.appendChild(cardBody);

    // Create title h5
    var title = document.createElement("h5");
    title.className = "card-title";
    title.innerText = artTitle;
    cardBody.appendChild(title);

    // Create main card text paragraph
    var cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.innerText = artText;
    cardBody.appendChild(cardText);

    // Create secondary text paragraph
    var cardTextSmall = document.createElement("p");
    cardTextSmall.className = "card-text";
    var smallText = document.createElement("small");
    smallText.className = "text-body-secondary";
    smallText.innerText = "Today";
    cardTextSmall.appendChild(smallText);
    cardBody.appendChild(cardTextSmall);

    // Append the main card div to the document
    document.getElementById('news').appendChild(card);   
}

// Procedure to pull the ARTICLE table contents of the most recent date from the database
function FetchNews() {
    // Read data with a selected date range
    fetch(`/news-data`).then(res => res.json())
        .then(data => {
            data.forEach(element => {
                AddArticle(element.ArticleTitle, element.ArticleDesc);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

