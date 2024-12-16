import React from 'react';
import dayjs from 'dayjs';

const Calendar = ({ currentDate, onPrevMonth, onNextMonth, onDayClick }) => {
    const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const firstDayOfMonth = dayjs(currentDate).startOf('month');
    const lastDayOfMonth = dayjs(currentDate).endOf('month');
    const startDate = firstDayOfMonth.startOf('week');
    const endDate = lastDayOfMonth.endOf('week');
    
    const calendarDays = [];
    let day = startDate;

    while (day.isBefore(endDate, 'day')) {
        calendarDays.push(day);
        day = day.add(1, 'day');
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
                <button onClick={onPrevMonth} className="text-blue-500">&lt; Prev</button>
                <h2 className="text-lg font-semibold">
                    {dayjs(currentDate).format('MMMM YYYY')}
                </h2>
                <button onClick={onNextMonth} className="text-blue-500">Next &gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {daysInWeek.map((day, index) => (
                    <div key={index} className="text-center font-semibold">
                        {day}
                    </div>
                ))}
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        className={`text-center p-2 rounded cursor-pointer ${
                            day.isSame(dayjs(), 'day') ? 'bg-blue-500 text-white' : ''
                        } ${day.isSame(currentDate, 'month') ? '' : 'text-gray-400'}`}
                        onClick={() => onDayClick(day.date())}
                    >
                        {day.date()}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
