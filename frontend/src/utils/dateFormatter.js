// Utility function to format dates in "12th July 2025" format
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Get day with ordinal suffix
  const day = date.getDate();
  const dayWithSuffix = getDayWithSuffix(day);
  
  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[date.getMonth()];
  
  // Get year
  const year = date.getFullYear();
  
  return `${dayWithSuffix} ${month} ${year}`;
};

// Helper function to add ordinal suffix to day
const getDayWithSuffix = (day) => {
  if (day >= 11 && day <= 13) {
    return day + 'th';
  }
  
  switch (day % 10) {
    case 1:
      return day + 'st';
    case 2:
      return day + 'nd';
    case 3:
      return day + 'rd';
    default:
      return day + 'th';
  }
}; 