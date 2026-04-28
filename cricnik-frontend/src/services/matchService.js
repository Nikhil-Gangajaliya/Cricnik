import { api } from "../api/api.js";

// /matches/create-match
// /matches/all-matches
// /matches/matches/:id
// /start-match/startmatch/:id
// /scores/start-second-innings

const createMatch = async (data) => {
    try {
        const response = await api.post('/matches/create-match', data);
        return response.data;
    } catch (error) {
        console.error('Error creating match:', error);
        throw error;
    }
};

const deleteMatch = async (id) => {
    try {
        const response = await api.delete(`/matches/delete-match/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting match with id ${id}:`, error.response?.data || error);
        throw error;
    }
};

const allMatches = async () => {
    try {
        const response = await api.get('/matches/all-matches');
        return response.data;
    } catch (error) {
        console.error('Error fetching all matches:', error);
        throw error;
    }
};

const matchById = async (id) => {
    try {
        const response = await api.get(`/matches/matches/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching match with id ${id}:`, error);
        throw error;
    }
};

const startMatch = async (id, data) => {
    try {
        console.log(`Starting match with id ${id}:`, data);
        const response = await api.post(`/start-match/startmatch/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error starting match with id ${id}:`, error.response?.data || error);
        throw error;
    }
};

const startSecondInnings = async (data) => {
    try {
        const response = await api.post('/scores/start-second-innings', data);
        return response.data;
    } catch (error) {
        console.error('Error starting second innings:', error);
        throw error;
    }
};

export {
    createMatch,
    deleteMatch,
    allMatches,
    matchById,
    startMatch,
    startSecondInnings
};
