let allData = [];

async function getData() {

    let response = await fetch("publicbathrooms.json");
    let data = await response.json();

    allData = data;

    if (document.getElementById("results")) {
        displayData(allData);
    }

    if (document.getElementById("chart")) {
        createChart();
        createAccessibilityChart();
        createStatusChart();
        createOperatorChart();
        createMap();
    }
}

getData();

function displayData(data) {

    let results = document.getElementById("results");

    let build = "";

    for (let i = 0; i < data.length; i++) {

        build += `
        <div class="card">
            <h3>${data[i].facility_name || "Unknown"}</h3>
            <p><b>Type:</b> ${data[i].location_type || "N/A"}</p>
            <p><b>Operator:</b> ${data[i].operator || "N/A"}</p>
            <p><b>Status:</b> ${data[i].status || "N/A"}</p>
        </div>
        `;
    }

    results.innerHTML = build;
}

function searchData() {

    let search = document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    let filtered = [];

    for (let i = 0; i < allData.length; i++) {

        let name = allData[i].facility_name || "";

        if (name.toLowerCase().includes(search)) {
            filtered.push(allData[i]);
        }
    }

    displayData(filtered);
}

function resetData() {
    displayData(allData);
}

function createChart() {

    let parks = 0;
    let libraries = 0;
    let other = 0;

    for (let i = 0; i < allData.length; i++) {

        let type = allData[i].location_type || "";

        if (type.includes("Park")) {
            parks++;
        }
        else if (type.includes("Library")) {
            libraries++;
        }
        else {
            other++;
        }
    }

    c3.generate({
        bindto: "#chart",
        data: {
            columns: [
                ["Parks", parks],
                ["Libraries", libraries],
                ["Other", other]
            ],
            type: "bar"
        }
    });
}

function createAccessibilityChart() {

    let accessible = 0;
    let other = 0;

    for (let i = 0; i < allData.length; i++) {

        let access = String(allData[i].accessibility || "").toLowerCase();

        if (
            access.includes("accessible") ||
            access.includes("yes") ||
            access.includes("ada")
        ) {
            accessible++;
        }
        else {
            other++;
        }
    }

    c3.generate({
        bindto: "#accessChart",
        data: {
            columns: [
                ["Accessible", accessible],
                ["Other", other]
            ],
            type: "pie"
        }
    });
}

function createStatusChart() {

    let operational = 0;
    let closed = 0;

    for (let i = 0; i < allData.length; i++) {

        let status = String(allData[i].status || "");

        if (status.includes("Operational")) {
            operational++;
        }
        else {
            closed++;
        }
    }

    c3.generate({
        bindto: "#statusChart",
        data: {
            columns: [
                ["Operational", operational],
                ["Closed / Other", closed]
            ],
            type: "donut"
        }
    });
}

function createOperatorChart() {

    let parks = 0;
    let libraries = 0;
    let other = 0;

    for (let i = 0; i < allData.length; i++) {

        let operator = allData[i].operator || "";

        if (operator.includes("Parks")) {
            parks++;
        }
        else if (
            operator.includes("Library") ||
            operator.includes("NYPL") ||
            operator.includes("BPL") ||
            operator.includes("QPL")
        ) {
            libraries++;
        }
        else {
            other++;
        }
    }

    c3.generate({
        bindto: "#operatorChart",
        data: {
            columns: [
                ["Parks", parks],
                ["Libraries", libraries],
                ["Other", other]
            ],
            type: "bar"
        }
    });
}

function createMap() {

    if (!document.getElementById("map")) {
        return;
    }

    let map = L.map("map").setView([40.7128, -74.0060], 10);

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap"
        }
    ).addTo(map);

    for (let i = 0; i < allData.length; i++) {

        let lat = Number(allData[i].latitude);
        let lon = Number(allData[i].longitude);

        if (!isNaN(lat) && !isNaN(lon)) {

            L.marker([lat, lon])
                .addTo(map)
                .bindPopup(allData[i].facility_name || "Restroom");
        }
    }
}