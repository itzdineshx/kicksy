// ML Service API configuration
const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:5000';

export const mlApi = {
    // Get demand forecast for events
    async getDemandForecast(eventData) {
        try {
            const response = await fetch(`${ML_SERVICE_URL}/api/demand-forecast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching demand forecast:', error);
            throw error;
        }
    },

    // Get customer segmentation
    async getCustomerSegments(customerData) {
        try {
            const response = await fetch(`${ML_SERVICE_URL}/api/customer-segments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching customer segments:', error);
            throw error;
        }
    },

    // Get price recommendations
    async getPriceRecommendations(pricingData) {
        try {
            const response = await fetch(`${ML_SERVICE_URL}/api/price-recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pricingData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching price recommendations:', error);
            throw error;
        }
    },

    // Get revenue analytics
    async getRevenueAnalytics(analyticsData) {
        try {
            const response = await fetch(`${ML_SERVICE_URL}/api/revenue-analytics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(analyticsData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching revenue analytics:', error);
            throw error;
        }
    }
};


