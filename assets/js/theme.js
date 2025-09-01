// Light theme only - no switching functionality

// Set light theme permanently
document.documentElement.setAttribute("data-theme", "light");
document.documentElement.setAttribute("data-theme-setting", "light");

// Ensure light theme CSS is always active
let setLightThemeOnly = () => {
  document.getElementById("highlight_theme_dark").media = "none";
  document.getElementById("highlight_theme_light").media = "";
  
  // Remove dark theme classes from tables
  let tables = document.getElementsByTagName("table");
  for (let i = 0; i < tables.length; i++) {
    tables[i].classList.remove("table-dark");
  }
};

// Initialize light theme on load
document.addEventListener("DOMContentLoaded", function () {
  setLightThemeOnly();
});

// Run immediately as well
setLightThemeOnly();
