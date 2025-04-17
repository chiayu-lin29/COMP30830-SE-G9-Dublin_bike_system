const timeButton = document.getElementById("select-time");
const dropdown = document.getElementById('timeDropdown');


function formatTime(date){
    return date.toLocaleString('en-US', {
        weekday: 'long',    
        hour: '2-digit',
        minute: '2-digit',
        hour12: false       
      })
}

function updateTime(){
    const newTime = formatTime(AppState.selectedTime);
    timeButton.innerHTML = newTime;
}

function showTime(){
    generateHours();
    dropdown.style.display = 'block';
  }

  function hideTime(){
    dropdown.style.display = 'none';
  }




  function generateHours() {
    const now = new Date();
    AppState.selectedTime = now;
    for (let i = 0; i < 48; i++) {
      const optionTime = new Date(now.getTime() + i * 60 * 60 * 1000); // every hour
      const label = optionTime.toLocaleString([], {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        month: 'short',
        day: 'numeric'
      });

      const div = document.createElement('div');
      div.textContent = label;
      div.onclick = () => handleTimeClick(optionTime);
      dropdown.appendChild(div);
    }
  }

  function handleTimeClick(time) {
    AppState.selectedTime = time;
    updateTime();
    hideTime();
  }



  generateHours();