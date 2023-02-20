// Execute this function when the form with id add_user is submitted.
$("#update_user").submit(function (event) {
  event.preventDefault();

  // creates an array of all the values of this update_user form
  let unindexed_array = $(this).serializeArray();

  // We need to go from an array to an object format for our request
  let data = {};

  // Populate our data object with the information from unindexed_array
  $.map(unindexed_array, function (n, i) {
    data[n["name"]] = n["value"];
  });

  console.log(data);

  // Create a put request for the user update
  let request = {
    url: `http://localhost:3000/api/users/${data.id}`,
    method: "PUT",
    data: data,
  };

  // Use ajax to send the request and create an alert
  $.ajax(request).done(function (response) {
    alert("Data updated succesfully!");
    location.reload();
  });
});

// Chart.js
const ctx = document.getElementById("myChart");

const sightingElements = document.querySelectorAll(".sighting");

const locationTally = {
  "Flying": 0,
  "Feeder": 0,
  "Foliage": 0,
  "Water": 0,
};

sightingElements.forEach((sightingElement) => {
  // Get the location value of the current sighting element
  const locationValue = sightingElement.querySelector(".sighting-summary p:nth-child(6)").textContent;
  const index = locationValue.indexOf(" ");
  const result = locationValue.substring(index + 1);
  if (result in locationTally) {
    locationTally[result]++;
    console.log(result + " +1");
  } else {
    console.log(result + " does not exist");
  }
  
});

new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Flying", "Feeder", "Foliage", "Water"],
    datasets: [
      {
        label: "# of sightings",
        data: [
          locationTally.Flying,
          locationTally.Feeder,
          locationTally.Foliage,
          locationTally.Water,
        ],
        borderWidth: 1,
        backgroundColor: ["#f28624", "#c9b728", "#42dba3", "#a0ebad"],
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
  },
});
