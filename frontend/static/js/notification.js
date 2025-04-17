const notificationDiv = document.getElementById("notification-container");
const notificationText = document.getElementById("notification-text");
const notificationIcon = document.getElementById("notification-icon");

function clearNotification(){
    notificationText.innerText = "";
    notificationIcon.className = "";
}

function showNotification(){
    notificationDiv.classList.add('active');
}

function hideNotification(){
    notificationDiv.classList.remove('active');
}

function cancelInput(){
    AppState.searchParams.searchMode = false;
    hideNotification();
}

function startInputNotification(){
    notificationText.innerHTML = "Type or Click the Map to set Starting Station. Click me to Cancel!"
    notificationIcon.className = "fa-solid fa-location-dot";
    notificationIcon.style.color = "#006400";
    showNotification();
    notificationDiv.onclick = cancelInput;
}


function destInputNotification(){
    notificationText.innerHTML = "Type or Click the Map to set Starting Station. Click me to Cancel!"
    notificationIcon.className = "fa-solid fa-location-dot";
    notificationIcon.style.color = "#8B0000";
    showNotification();
    notificationDiv.onclick = cancelInput;
}



