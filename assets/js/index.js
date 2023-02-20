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