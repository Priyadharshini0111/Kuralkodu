let latitude = "";
let longitude = "";

if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function (position) {

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        document.getElementById("locationText").innerText =
            "Location: " + latitude + ", " + longitude;

    });

}
const API = "http://localhost:3000";

const form = document.getElementById("reportForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value;

        const res = await fetch(API + "/report", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                category,
                description,
                location: latitude + "," + longitude

            })

        });

        const data = await res.json();

        document.getElementById("result").innerText =
            "Complaint ID: " + data.id;

    });

}

async function trackComplaint() {

    const id = document.getElementById("complaintId").value;

    const res = await fetch(API + "/complaint/" + id);

    const data = await res.json();

    document.getElementById("status").innerText =
        "Status: " + data.status;

}

async function loadComplaints() {

    const res = await fetch("http://localhost:3000/complaints");

    const data = await res.json();

    const list = document.getElementById("complaintList");

    list.innerHTML = "";

    data.forEach(c => {

        const row = document.createElement("tr");

        row.innerHTML = `
<td>${c.category}</td>
<td>${c.description}</td>
<td>${c.status}</td>
<td>
<button onclick="resolveComplaint('${c._id}')">Resolve</button>
</td>
`;

        list.appendChild(row);

    });

}

async function resolveComplaint(id) {

    await fetch("http://localhost:3000/update/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            status: "Resolved"
        })

    });

    alert("Complaint Resolved");

    loadComplaints();

}