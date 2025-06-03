/**
 * Manages local storage operations for saving and retrieving resume data
 */
const StorageManager = {
    STORAGE_KEY: 'resume_builder_data',

    /**
     * Saves data to localStorage and shows a notification
     * @param {Object} data - The resume data to save
     * @returns {boolean} - Success status
     */
    save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            this.showNotification();
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    },

    /**
     * Loads data from localStorage
     * @returns {Object|null} - The retrieved data or null if not found
     */
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    },

    /**
     * Clears all stored data
     */
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    /**
     * Shows a temporary notification when data is saved
     */
    showNotification() {
        const notification = document.getElementById('autosave-notification');
        notification.classList.remove('translate-y-20', 'opacity-0');
        notification.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
            notification.classList.add('translate-y-20', 'opacity-0');
            notification.classList.remove('translate-y-0', 'opacity-100');
        }, 2000);
    }
};

export default StorageManager;