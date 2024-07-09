import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const ReservationCalendar = ({ events }) => {
  return (
    <div className="reservation-calendar-container">
      <FullCalendar plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="ro"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        buttonText={{
          today: 'Azi',
          month: 'Lună',
          week: 'Săptămână',
          day: 'Zi',
          list: 'Listă',
        }}
        allDayText="Toată ziua"
      />
    </div>
  );
};

export default ReservationCalendar;
