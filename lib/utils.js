// ...existing code...

// Add this function if it doesn't exist
export function sortByDate(items) {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    try {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } catch (e) {
      return 0;
    }
  });
}

// ...existing code...