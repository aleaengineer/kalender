document.addEventListener('DOMContentLoaded', function() {
    // Initialize with current date
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    // DOM Elements
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const calendarBody = document.getElementById('calendarBody');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const currentMonthBtn = document.getElementById('currentMonthBtn');
    const convertToHijriBtn = document.getElementById('convertToHijri');
    const convertToGregorianBtn = document.getElementById('convertToGregorian');
    const hijriResult = document.getElementById('hijriResult');
    const gregorianResult = document.getElementById('gregorianResult');
    
    // Initialize calendar
    function initCalendar() {
        monthSelect.value = currentMonth;
        yearSelect.value = currentYear;
        generateCalendar(currentMonth, currentYear);
    }
    
    // Generate calendar
    function generateCalendar(month, year) {
        // Update month and year display
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        currentMonthYear.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and total days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Get previous month days
        const prevMonthDays = new Date(year, month, 0).getDate();
        
        // Clear calendar body
        calendarBody.innerHTML = '';
        
        let date = 1;
        let nextMonthDate = 1;
        
        // Create calendar rows (6 weeks)
        for (let i = 0; i < 6; i++) {
            // Stop if we've rendered all days
            if (date > daysInMonth && i > 0) break;
            
            const row = document.createElement('tr');
            
            // Create cells for each day of the week
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                cell.className = 'calendar-day p-2';
                
                if (i === 0 && j < firstDay) {
                    // Days from previous month
                    const prevDate = prevMonthDays - (firstDay - j - 1);
                    cell.innerHTML = `<span class="text-muted">${prevDate}</span>`;
                    cell.classList.add('text-muted');
                } else if (date > daysInMonth) {
                    // Days from next month
                    cell.innerHTML = `<span class="text-muted">${nextMonthDate}</span>`;
                    cell.classList.add('text-muted');
                    nextMonthDate++;
                } else {
                    // Current month days
                    // Check if today
                    const isToday = date === today.getDate() && 
                                month === today.getMonth() && 
                                year === today.getFullYear();
                    
                    if (isToday) {
                        cell.classList.add('today');
                    }
                
                    // Get Hijri date with -2 days adjustment
                    const gregorianDate = new Date(year, month, date);
                    const adjustedDate = new Date(gregorianDate);
                    adjustedDate.setDate(gregorianDate.getDate() - 2); // Kurangi 2 hari
                    
                    const hijriDate = convertToHijri(adjustedDate);
                    
                    cell.innerHTML = `
                        <div>${date}</div>
                        <div class="hijri-date">${hijriDate}</div>
                    `;
                    
                    date++;
                }
                
                row.appendChild(cell);
            }
            
            calendarBody.appendChild(row);
        }
    }
    
    // Convert Gregorian to Hijri
    function convertToHijri(date) {
        try {
            const hijriDate = new Intl.DateTimeFormat('id-u-ca-islamic', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(date);
            
            return hijriDate;
        } catch (error) {
            console.error("Error converting to Hijri:", error);
            return "Error";
        }
    }
    
    // Convert Hijri to Gregorian (with +2 days adjustment)
    function convertHijriToGregorian(hYear, hMonth, hDay) {
        try {
            // Using approximate calculation for conversion
            const epoch = 227014; // JD of 622/7/16 (Hijri epoch)
            const jd = hDay + Math.ceil(29.5 * (hMonth - 1)) + (hYear - 1) * 354 + Math.floor((3 + (11 * hYear)) / 30) + epoch;
            
            // Convert JD to Gregorian date
            const l = jd + 68569;
            const n = Math.floor(4 * l / 146097);
            l = l - Math.floor((146097 * n + 3) / 4);
            const i = Math.floor(4000 * (l + 1) / 1461001);
            l = l - Math.floor(1461 * i / 4) + 31;
            const j = Math.floor(80 * l / 2447);
            const day = l - Math.floor(2447 * j / 80);
            l = Math.floor(j / 11);
            const month = j + 2 - 12 * l;
            const year = 100 * (n - 49) + i + l;
            
            // Add 2 days to compensate for the -2 days adjustment in display
            const gregorianDate = new Date(year, month - 1, day);
            gregorianDate.setDate(gregorianDate.getDate() + 2);
            
            return gregorianDate;
        } catch (error) {
            console.error("Error converting Hijri to Gregorian:", error);
            return null;
        }
    }
    
    // Event Listeners (remain the same as previous code)
    monthSelect.addEventListener('change', function() {
        currentMonth = parseInt(this.value);
        generateCalendar(currentMonth, currentYear);
    });
    
    yearSelect.addEventListener('change', function() {
        currentYear = parseInt(this.value);
        generateCalendar(currentMonth, currentYear);
    });
    
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        monthSelect.value = currentMonth;
        yearSelect.value = currentYear;
        generateCalendar(currentMonth, currentYear);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        monthSelect.value = currentMonth;
        yearSelect.value = currentYear;
        generateCalendar(currentMonth, currentYear);
    });
    
    currentMonthBtn.addEventListener('click', function() {
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        monthSelect.value = currentMonth;
        yearSelect.value = currentYear;
        generateCalendar(currentMonth, currentYear);
    });
    
    convertToHijriBtn.addEventListener('click', function() {
        const gregorianDate = document.getElementById('gregorianDate').value;
        if (!gregorianDate) {
            hijriResult.innerHTML = '<div class="text-danger">Masukkan tanggal Masehi terlebih dahulu</div>';
            return;
        }
        
        const [year, month, day] = gregorianDate.split('-');
        const date = new Date(year, month - 1, day);
        
        // Apply -2 days adjustment for display
        const adjustedDate = new Date(date);
        adjustedDate.setDate(date.getDate() - 2);
        
        try {
            const hijriDate = new Intl.DateTimeFormat('id-u-ca-islamic', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
            }).format(adjustedDate);
            
            hijriResult.innerHTML = `
                <div class="fw-bold">Hasil Konversi (dengan koreksi -2 hari):</div>
                <div>${hijriDate}</div>
                <div class="text-muted small">Tanggal Masehi: ${date.toLocaleDateString('id-ID')}</div>
            `;
        } catch (error) {
            hijriResult.innerHTML = `
                <div class="text-danger">Gagal mengkonversi tanggal</div>
                <div class="text-muted small">${error.message}</div>
            `;
        }
    });
    
    convertToGregorianBtn.addEventListener('click', function() {
        const day = parseInt(document.getElementById('hijriDay').value);
        const month = parseInt(document.getElementById('hijriMonth').value);
        const year = parseInt(document.getElementById('hijriYear').value);
        
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            gregorianResult.innerHTML = '<div class="text-danger">Masukkan tanggal Hijriyah dengan lengkap</div>';
            return;
        }
        
        try {
            // Using our conversion function which already includes +2 days compensation
            const gregorianDate = convertHijriToGregorian(year, month, day);
            
            if (!gregorianDate) {
                throw new Error("Konversi gagal");
            }
            
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            
            const formattedDate = gregorianDate.toLocaleDateString('id-ID', options);
            
            gregorianResult.innerHTML = `
                <div class="fw-bold">Hasil Konversi (dengan koreksi +2 hari):</div>
                <div>${formattedDate}</div>
                <div class="text-muted small">Format ISO: ${gregorianDate.getFullYear()}-${(gregorianDate.getMonth() + 1).toString().padStart(2, '0')}-${gregorianDate.getDate().toString().padStart(2, '0')}</div>
                <div class="text-muted small">Tanggal Hijriyah asli: ${day} ${document.getElementById('hijriMonth').options[month-1].text} ${year} H</div>
            `;
        } catch (error) {
            gregorianResult.innerHTML = `
                <div class="text-danger">Terjadi kesalahan dalam konversi</div>
                <div class="text-muted small">${error.message}</div>
            `;
        }
    });
    
    // Initialize
    initCalendar();
});