document.getElementById("mydata").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission
    submit(); // Call submit function
});
function submit() {
    let x=document.getElementById("name").value;
    const data = {
    dbs: x
};

// Send the data to the server
try {
    const response =  fetch('http://localhost:3000/post1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to submit');
    }

    console.log('Data submitted successfully');
    // Redirect or do something after successful submission
    window.location.href="div.html";
} catch (error) {
    console.error('Error:', error);
}
}