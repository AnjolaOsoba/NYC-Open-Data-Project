let allData = [];

async function getData() {

    let response = await fetch("publicbathrooms.json");
    let data = await response.json();

    allData = data;

    if (document.getElementById("results")) {
        displayData(allData);
    }

    if (document.getElementById("chart")) {
        createChart(allData);
        createAccessibilityChart(allData);
        createStatusChart(allData);
        createOperatorChart(allData);
        createMap(allData);
    }
}

getData();


function displayChart(data, chartId, chartType) {

    c3.generate({
        bindto: `#${chartId}`,
        data: {
            columns: data,
            type: chartType
        }
    });

}


function displayData(data) {

    let results = document.getElementById("results");

    results.innerHTML = "";

    for (let item of data) {

        results.innerHTML += `
        <div class="card">
            <h3>${item.facility_name || "Unknown Facility"}</h3>
            <p><b>Type:</b> ${item.location_type || "N/A"}</p>
            <p><b>Operator:</b> ${item.operator || "N/A"}</p>
            <p><b>Status:</b> ${item.status || "N/A"}</p>
            <p><b>Accessibility:</b> ${item.accessibility || "N/A"}</p>
        </div>
        `;
    }
}


function searchData() {

    let input = document.getElementById("searchBox").value.toLowerCase();

    let filtered = [];

    for (let item of allData) {

        if (
            item.facility_name &&
            item.facility_name.toLowerCase().includes(input)
        ) {
            filtered.push(item);
        }
    }

    displayData(filtered);
}


function resetData() {
    displayData(allData);
}


function createChart(data) {

    let parks = 0;
    let libraries = 0;
    let other = 0;

    for (let item of data) {

        if (item.location_type === "Park") {
            parks++;
        }
        else if (item.location_type === "Library") {
            libraries++;
        }
        else {
            other++;
        }
    }

    displayChart(
        [
            ["Parks", parks],
            ["Libraries", libraries],
            ["Other", other]
        ],
        "chart",
        "bar"
    );
}


function createAccessibilityChart(data) {

    let accessible = 0;
    let notAccessible = 0;

    for (let item of data) {

        if (item.accessibility) {
            accessible++;
        }
        else {
            notAccessible++;
        }
    }

    displayChart(
        [
            ["Accessible", accessible],
            ["Not Listed", notAccessible]
        ],
        "accessChart",
        "pie"
    );
}


function createStatusChart(data) {

    let operational = 0;
    let notOperational = 0;
    let closed = 0;
    let other = 0;

    for (let item of data) {

        let status = item.status || "";

        if (status.includes("Operational") &&
            !status.includes("Not Operational")) {
            operational++;
        }
        else if (status.includes("Not Operational")) {
            notOperational++;
        }
        else if (status.includes("Closed")) {
            closed++;
        }
        else {
            other++;
        }
    }

    displayChart(
        [
            ["Operational", operational],
            ["Not Operational", notOperational],
            ["Closed", closed],
            ["Other", other]
        ],
        "statusChart",
        "donut"
    );
}


function createOperatorChart(data) {

    let parks = 0;
    let libraries = 0;
    let other = 0;

    for (let item of data) {

        let operator = item.operator || "";

        if (operator.includes("Parks")) {
            parks++;
        }
        else if (
            operator.includes("BPL") ||
            operator.includes("NYPL") ||
            operator.includes("QPL")
        ) {
            libraries++;
        }
        else {
            other++;
        }
    }

    displayChart(
        [
            ["NYC Parks", parks],
            ["Libraries", libraries],
            ["Other", other]
        ],
        "operatorChart",
        "bar"
    );
}


function createMap(data) {

    let map = L.map("map").setView([40.7128, -74.0060], 11);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "OpenStreetMap"
        }
    ).addTo(map);

    for (let item of data) {

        if (item.latitude && item.longitude) {

            L.marker([
                parseFloat(item.latitude),
                parseFloat(item.longitude)
            ])
            .addTo(map)
            .bindPopup(
                `<b>${item.facility_name}</b><br>${item.location_type}`
            );
        }
    }
}