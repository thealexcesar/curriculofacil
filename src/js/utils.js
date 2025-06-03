/**
 * Formats a date string into a more readable format
 * @param {string} dateString - Date string in ISO format (YYYY-MM)
 * @returns {string} - Formatted date string (e.g., "Jan 2023")
 */
export function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}