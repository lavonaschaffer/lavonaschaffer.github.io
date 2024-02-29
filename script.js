var map, infoWindow, chartPanel;

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

    // Create markers
    var locations = [
        { lat: 20.98757293313669, lng: 105.93685697450815 },
        { lat: 20.9885281986878, lng: 105.93641384324708 },
        { lat: 20.989660048349222, lng: 105.936062074998 },
        { lat: 20.990689732556987, lng: 105.9356772327678 }
    ];

    locations.forEach(function(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });

        marker.addListener('click', function() {
            openChartPanel(location);
        });
    });
}

// Open the side panel and load charts when a marker is clicked
function openChartPanel(location) {
    // Open the chart panel
    chartPanel.setContent(document.getElementById('chart-panel'));
    chartPanel.setPosition(location);
    chartPanel.open(map);

    // Load the chart iframes dynamically
    var chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = `
        <iframe width="100%" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2449920/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line"></iframe>
        <iframe width="100%" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2449920/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>
        <iframe width="100%" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2449920/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>
        <iframe width="100%" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2449920/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>
    `;
}

// Close the side panel
function closeChartPanel() {
    chartPanel.close();
}
