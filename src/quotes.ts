const quotes = [
  `> "The best way to get started is to quit talking and begin doing."\n> \- Walt Disney`,
  `> "Success is not the key to happiness. Happiness is the key to success."\n> \- Albert Schweitzer`,
  `> "Your time is limited, so don't waste it living someone else's life."\n> \- Steve Jobs`,
  `> "The only way to do great work is to love what you do."\n> \- Steve Jobs`,
  `> "Believe you can and you're halfway there."\n> \- Theodore Roosevelt`,
  `> "Start where you are. Use what you have. Do what you can."\n> \- Arthur Ashe`,
];

export function getRandomQuote(): string {
  return quotes[Math.floor(Math.random() * quotes.length)];
} 