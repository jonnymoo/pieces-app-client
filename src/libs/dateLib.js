export function isToday(date) {
  // Get today's date
  var todaysDate = new Date();

  // call setHours to take the time out of the comparison
  return date.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0);
}
