"use client"

interface CalendarProps {
  selectedDay: number
  month: number
  year: number
}

export function Calendar({ selectedDay, month, year }: CalendarProps) {
  const daysOfWeek = ["ԵԿ", "ԵՔ", "ՉՐ", "ՀԳ", "ՈՒ", "ՇԲ", "ԿԻ"]

  // Generate days for the month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month - 1, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  // Create calendar grid
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="max-w-[240px] mx-auto mt-4">
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-[10px] text-gray-400">
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div
            key={index}
            className={`h-6 w-6 flex items-center justify-center mx-auto text-[10px]
              ${day === selectedDay ? "relative" : day ? "text-gray-500" : ""}`}
          >
            {day === selectedDay ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center" >
                  <svg className="text-wedding-gold" transform="scale(1.5)" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="relative text-white z-10">{day}</span>
              </>
            ) : (
              day
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

