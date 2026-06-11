const now = new Date('2026-05-10T12:25:00Z');
const hijriDate = new Date(now);
// If we want the date to be 1 day ahead, we should adjust the offset.
hijriDate.setDate(hijriDate.getDate() - 1);
const formatter = new Intl.DateTimeFormat('en-US', {
  calendar: 'islamic-umalqura',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric'
});
const hijriParts = formatter.formatToParts(hijriDate);
console.log("With -1: ", hijriParts);

hijriDate.setDate(hijriDate.getDate() + 1); // Now 0 offset
console.log("With 0: ", formatter.formatToParts(hijriDate));
