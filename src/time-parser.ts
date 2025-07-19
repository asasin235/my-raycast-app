type TimeMatch = {
  original: string;
  date: Date;
};

function parseRelativeTime(text: string): Date | null {
  const now = new Date();
  const lowerText = text.toLowerCase();
  
  // Match "tomorrow", "today", "next week", etc.
  if (lowerText.includes("tomorrow")) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Handle "tomorrow night/evening"
    if (lowerText.includes("night") || lowerText.includes("evening")) {
      tomorrow.setHours(20, 0, 0, 0);
    }
    // Handle "tomorrow morning"
    else if (lowerText.includes("morning")) {
      tomorrow.setHours(9, 0, 0, 0);
    }
    // Handle "tomorrow afternoon"
    else if (lowerText.includes("afternoon")) {
      tomorrow.setHours(14, 0, 0, 0);
    }
    return tomorrow;
  }

  if (lowerText.includes("tonight")) {
    const tonight = new Date(now);
    tonight.setHours(20, 0, 0, 0);
    if (tonight < now) {
      tonight.setDate(tonight.getDate() + 1);
    }
    return tonight;
  }

  if (lowerText.includes("day after tomorrow")) {
    const dayAfter = new Date(now);
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter;
  }

  if (lowerText.includes("next week")) {
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  }

  if (lowerText.includes("this evening")) {
    const evening = new Date(now);
    evening.setHours(18, 0, 0, 0);
    if (evening < now) {
      evening.setDate(evening.getDate() + 1);
    }
    return evening;
  }
  
  return null;
}

function parseSpecificDate(text: string): Date | null {
  // Match dates like "on 25th Dec" or "on December 25" or "25 December"
  const dateMatch = text.match(/(?:on\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)/i);
  
  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    const monthText = dateMatch[2].toLowerCase();
    const months: { [key: string]: number } = {
      'jan': 0, 'january': 0,
      'feb': 1, 'february': 1,
      'mar': 2, 'march': 2,
      'apr': 3, 'april': 3,
      'may': 4,
      'jun': 5, 'june': 5,
      'jul': 6, 'july': 6,
      'aug': 7, 'august': 7,
      'sep': 8, 'september': 8,
      'oct': 9, 'october': 9,
      'nov': 10, 'november': 10,
      'dec': 11, 'december': 11
    };
    
    const month = Object.entries(months).find(([key]) => monthText.startsWith(key))?.[1] ?? -1;
    if (month !== -1) {
      const now = new Date();
      const date = new Date(now.getFullYear(), month, day);
      
      // If the date has already passed this year, set it for next year
      if (date < now) {
        date.setFullYear(date.getFullYear() + 1);
      }
      
      return date;
    }
  }

  // Match dates like "on 25/12" or "25/12" or "25-12"
  const shortDateMatch = text.match(/(?:on\s+)?(\d{1,2})[-/](\d{1,2})/);
  if (shortDateMatch) {
    const day = parseInt(shortDateMatch[1]);
    const month = parseInt(shortDateMatch[2]) - 1;
    const now = new Date();
    const date = new Date(now.getFullYear(), month, day);
    
    // If the date has already passed this year, set it for next year
    if (date < now) {
      date.setFullYear(date.getFullYear() + 1);
    }
    
    return date;
  }
  
  return null;
}

function parseTimeOfDay(text: string): Date | null {
  const now = new Date();
  const lowerText = text.toLowerCase();
  
  // Handle natural language time expressions
  if (lowerText.includes("morning")) {
    const date = new Date(now);
    date.setHours(9, 0, 0, 0);
    if (date < now) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }
  
  if (lowerText.includes("afternoon")) {
    const date = new Date(now);
    date.setHours(14, 0, 0, 0);
    if (date < now) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }
  
  if (lowerText.includes("evening")) {
    const date = new Date(now);
    date.setHours(18, 0, 0, 0);
    if (date < now) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }
  
  if (lowerText.includes("night")) {
    const date = new Date(now);
    date.setHours(20, 0, 0, 0);
    if (date < now) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }
  
  // Match "at HH:MM" or "at H:MM" or "at H PM/AM"
  const timeMatch = text.match(/at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();
    
    let adjustedHours = hours;
    if (meridiem === "pm" && hours < 12) {
      adjustedHours += 12;
    } else if (meridiem === "am" && hours === 12) {
      adjustedHours = 0;
    }
    
    const date = new Date(now);
    date.setHours(adjustedHours, minutes, 0, 0);
    
    // If the time is already past for today, set it for tomorrow
    if (date < now) {
      date.setDate(date.getDate() + 1);
    }
    
    return date;
  }
  
  return null;
}

export function parseTimeContext(text: string): TimeMatch | null {
  // Try to find time expressions in the text
  const lowerText = text.toLowerCase();
  
  // First check for relative dates
  const relativeDate = parseRelativeTime(lowerText);
  if (relativeDate) {
    // If there's also a specific time mentioned, combine them
    const timeOfDay = parseTimeOfDay(lowerText);
    if (timeOfDay) {
      relativeDate.setHours(timeOfDay.getHours(), timeOfDay.getMinutes());
    }
    return {
      original: text,
      date: relativeDate
    };
  }
  
  // Then check for specific dates
  const specificDate = parseSpecificDate(lowerText);
  if (specificDate) {
    // If there's also a specific time mentioned, combine them
    const timeOfDay = parseTimeOfDay(lowerText);
    if (timeOfDay) {
      specificDate.setHours(timeOfDay.getHours(), timeOfDay.getMinutes());
    }
    return {
      original: text,
      date: specificDate
    };
  }
  
  // Finally check for just time of day
  const timeOfDay = parseTimeOfDay(lowerText);
  if (timeOfDay) {
    return {
      original: text,
      date: timeOfDay
    };
  }
  
  return null;
}

export function formatReminderTime(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

// Example usage:
// parseTimeContext("Buy groceries at 3pm") -> { date: Date object for today at 3 PM }
// parseTimeContext("Call mom tomorrow night") -> { date: Date object for tomorrow at 8 PM }
// parseTimeContext("Meeting on 25th Dec at 2:30 pm") -> { date: Date object for Dec 25 at 2:30 PM }
// parseTimeContext("Dinner tomorrow evening") -> { date: Date object for tomorrow at 6 PM }
// parseTimeContext("Party on 31/12 at 8pm") -> { date: Date object for Dec 31 at 8 PM } 