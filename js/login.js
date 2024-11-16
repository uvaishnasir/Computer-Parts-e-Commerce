//function after DOMContentLoaded

document.addEventListener("DOMContentLoaded", function () {
  // Select the form element
  const loginForm = document.getElementById("loginForm");

  // Add a submit event listener to the form
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);

    // Extract values from the FormData object
    const username = formData.get("username");
    const password = formData.get("password");

    // Log the form data to the console
    // console.log("Username:", username);
    // console.log("Password:", password);

    //if username and password u=is correct then redirect to Home page
    if (username === "admin" && password === "admin") {
      window.location.href = "/Computer-Parts-e-Commerce/home.html";
    } else {
      alert("Invalid credentials.");
    }
  });
});
