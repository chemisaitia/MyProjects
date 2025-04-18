let currentDate = new Date();

function createCalendar(year, month) {
    const calBox = document.getElementById('cal-box');
    calBox.innerHTML = ''; // Clear the calendar
    const today = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const months = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
    const days = ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"];

    const monthName = months[month];
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    document.getElementById('date').innerHTML = `${year}, ${today} ${monthName}`;
    document.getElementById('day').innerHTML = days[currentDate.getDay()];

    const DayCont = document.createElement('div');
    DayCont.classList.add('cont');
    document.body.appendChild(DayCont);

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-box');
        dayDiv.textContent = day;

        if (hasEvents(year, month, day)) {
            dayDiv.classList.add('has-events');
        }

        dayDiv.addEventListener('click', () => {
            DayCont.innerHTML = 
            `<h1>${year}, ${day} ${monthName}</h1>` + 
            `<button class="eventbtn" onclick="addevent(${year}, ${month}, ${day})">ჩანიშნე ღონისძიება</button>` + 
            `<br><input type="text" placeholder="ღონისძიება..." id="evinp">` +
            `<div id="eventholder"></div>`;
            
            displayEvents(year, month, day);
            
            if (DayCont.classList.contains('animate')) {
                setTimeout(() => {
                    DayCont.classList.remove('animate');
                    calBox.classList.remove('margin');
                    dayDiv.style.backgroundColor = 'transparent';
                }, 2000); 
            } else {
                DayCont.classList.add('animate');
                calBox.classList.add('margin');
                dayDiv.style.backgroundColor = 'rgb(201, 196, 196)';
            }
        });

        if (day === today && month === currentMonth && year === currentYear) {
            dayDiv.classList.add('today');
        }

        calBox.appendChild(dayDiv);
    }
}

function addevent(year, month, day) {
    let inputElement = document.getElementById('evinp');
    let userInput = inputElement.value.trim();

    if (userInput === '') {
        alert('გთხოვთ ჩაწეროთ ღონისძიების სახელი!');
        return;
    }

    const key = `${year}-${month}-${day}`;
    let events = JSON.parse(localStorage.getItem(key)) || [];
    events.push(userInput);
    localStorage.setItem(key, JSON.stringify(events));
    inputElement.value = '';
    displayEvents(year, month, day);
    updateCalendar(year, month);
}

function displayEvents(year, month, day) {
    const key = `${year}-${month}-${day}`;
    const events = JSON.parse(localStorage.getItem(key)) || [];
    const holder = document.getElementById('eventholder');
    holder.innerHTML = ''; 

    events.forEach((eventText, index) => {
        let event = document.createElement('div');
        event.classList.add('event');
        event.innerHTML = `${eventText} <button class="delete" onclick="deleteEvent(${year}, ${month}, ${day}, ${index})">X</button>`;
        holder.appendChild(event);
    });
}

function deleteEvent(year, month, day, index) {
    const key = `${year}-${month}-${day}`;
    let events = JSON.parse(localStorage.getItem(key)) || [];
    events.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(events));
    displayEvents(year, month, day);
    updateCalendar(year, month);
}

function hasEvents(year, month, day) {
    const key = `${year}-${month}-${day}`;
    const events = JSON.parse(localStorage.getItem(key)) || [];
    return events.length > 0;
}

function updateCalendar(year, month) {
    const dayBoxes = document.getElementsByClassName('day-box');

    for (let dayBox of dayBoxes) {
        const day = parseInt(dayBox.textContent);
        if (hasEvents(year, month, day)) {
            dayBox.classList.add('has-events');
        } else {
            dayBox.classList.remove('has-events');
        }
    }
}

document.querySelector('.lar').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    createCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

document.querySelector('.rar').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    createCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

document.addEventListener('DOMContentLoaded', () => {
    createCalendar(currentDate.getFullYear(), currentDate.getMonth());
});