// Declear variable google map
var map, infoWindow, chartPanel;
// Information api sheet
const apiSheetKey = 'AIzaSyCs5RlJYDqei1DNBtOq2MpeVwOKe_vam9g';
const spreadsheetId = '1TCxpzOZqlNYifJoKY_YeBe5zi_8OzwQz5Odk7xtfT2g';
const range = 'Sheet1';
const apiSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiSheetKey}`;
// Create markers
var locations = [
    { lat: 20.988298323299162, lng: 105.94428115310376 },
    { lat: 20.9885281986878, lng: 105.93641384324708 },
    { lat: 20.989660048349222, lng: 105.936062074998 },
    { lat: 20.990689732556987, lng: 105.9356772327678 }
];
// Link charts
const dumpCharts = [
    `
        <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2449920/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line"></iframe>
        <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2449920/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
        <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2449920/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
        <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2449920/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
    `,
    `
        <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451186/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
        <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451186/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
        <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451186/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
        <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451186/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
    `,
    `
    <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451186/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
    <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451186/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
    <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451186/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
    <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451186/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
    `,  
    `
    <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451216/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
    <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451216/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
    <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451216/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
    <iframe width="100%" height="100%" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2451216/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=10&type=line&update=15"></iframe>
    `
]

// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20.98757293313669, lng: 105.93685697450815 },
        zoom: 15
    });

    // Create a single InfoWindow instance
    infoWindow = new google.maps.InfoWindow();

    // Create a single Chart Panel instance
    chartPanel = new google.maps.InfoWindow({
        maxWidth: 400 // Adjust as needed
    });

    locations.forEach(function(location, index) {
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });

        marker.addListener('click', function() {
            fetch(apiSheetUrl)
            .then(response => response.json())
            .then(data => {
                const lastRow = data.values[data.values.length - 1];
                var shouldChangeColorGreen = parseFloat(lastRow[3]) >= 6 && parseFloat(lastRow[3]) <= 9 
                && parseFloat(lastRow[2]) >= 0 && parseFloat(lastRow[2]) <= 100 
                && parseFloat(lastRow[4]) >= 20 && parseFloat(lastRow[4]) <= 30 
                && parseFloat(lastRow[1]) >= 0 && parseFloat(lastRow[1]) <= 1000;

                var shouldChangeColorRed = parseFloat(lastRow[3]) < 6 && parseFloat(lastRow[3]) > 9 
                && parseFloat(lastRow[2]) < 0 && parseFloat(lastRow[2]) > 100 
                && parseFloat(lastRow[4]) < 20 && parseFloat(lastRow[4]) > 30 
                && parseFloat(lastRow[1]) < 0 && parseFloat(lastRow[1]) > 1000;

                if (shouldChangeColorGreen) {
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
                }else if(shouldChangeColorRed) {
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
                }else{
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
                }
                openChartPanel(location, index, lastRow);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        });
    });
}

// Open the side panel and load charts when a marker is clicked
function openChartPanel(location, index, lastRow) {
    // Open the chart panel
    chartPanel.setContent(document.getElementById('chart-panel'));
    const listItems = lastRow.map((item, idx) => `<li><strong>${idx === 0 ? "Time" : idx === 1 ? "TDS" : idx === 2 ? "Turbidity" : idx === 3 ? "PH" : "Temperature"}:</strong> ${item}</li>`).join('');
    const listHTML = `<ul>${listItems}</ul>`;
    const content = `
        <div>
            <h3>Marker ${index + 1}</h3>
            <p>Latitude: ${location.lat}</p>
            <p>Longitude: ${location.lng}</p>
            <p>Data:</p>
            ${listHTML}
        </div>
    `;
    chartPanel.setContent(content);
    chartPanel.setPosition(location);
    chartPanel.open(map);
    // Load the chart iframes dynamically
    var chartContainer = document.getElementById('charts');
    chartContainer.innerHTML = dumpCharts[index];
}

// Close the side panel
function closeChartPanel() {
    chartPanel.close();
}