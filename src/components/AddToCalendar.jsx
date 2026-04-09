import React, { useState } from "react";

export default function AddToCalendar() {
    const [isOpen, setIsOpen] = useState(false);

    // --- CALENDAR DATA ---
    const title = "Ashish & Prashansa's Wedding";
    const details = "Join us as we tie the knot! Check our digital invitation for venue details and the photo gallery.";
    const location = "Piraukhar, Via-Chaurot, Madhubani, Bihar"; 
    
    // Format: YYYYMMDDThhmmssZ (Z = UTC time, adjust hours as needed)
    const startDate = "20260630T100000Z"; 
    const endDate = "20260702T050000Z"; 

    // 1. Google Calendar Link Generator
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

    // 2. Apple/Outlook .ICS File Generator
    const downloadICS = () => {
        const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${title}\nDESCRIPTION:${details}\nLOCATION:${location}\nDTSTART:${startDate}\nDTEND:${endDate}\nEND:VEVENT\nEND:VCALENDAR`;
        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Ashish_Prashansa_Wedding.ics";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsOpen(false);
    };

    return (
        <div className="calendar-container">
            <button 
                className="glass-btn calendar-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                📅 Add to Calendar
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="calendar-dropdown">
                    <a href={googleUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                        Google Calendar
                    </a>
                    <button onClick={downloadICS}>
                        Apple / Outlook
                    </button>
                </div>
            )}
        </div>
    );
}