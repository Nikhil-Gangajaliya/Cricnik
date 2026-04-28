import { api } from "../api/api.js";

// /teams/createteam
// /teams/getteams
// /players/create-player
// /players/get-players-by-team/:id

const createTeam = async (data) => {
    try {
        const response = await api.post('/teams/createteam', data);
        return response.data;
    } catch (error) {
        console.error('Error creating team:', error);
        throw error;
    }
};

// UPDATE TEAM
const updateTeam = async (id, data) => {
    try {
        const response = await api.put(`/teams/updateteam/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating team:", error);
        throw error;
    }
};

// DELETE TEAM
const deleteTeam = async (id) => {
    try {
        const response = await api.delete(`/teams/deleteteam/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting team:", error);
        throw error;
    }
};

const getTeams = async () => {
    try {
        const response = await api.get('/teams/getteams');

        // ✅ return only actual array
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching teams:', error);
        return []; // ✅ no crash
    }
};

const createPlayer = async (data) => {
    try {
        const response = await api.post('/players/create-player', data);
        return response.data;
    } catch (error) {
        console.error('Error creating player:', error);
        throw error;
    }
};

// UPDATE PLAYER
const updatePlayer = async (id, data) => {
    try {
        const response = await api.put(`/players/update-player/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating player:", error);
        throw error;
    }
};

// DELETE PLAYER
const deletePlayer = async (id) => {
    try {
        const response = await api.delete(`/players/delete-player/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting player:", error);
        throw error;
    }
};

const getPlayersByTeam = async (teamId) => {
    try {
        const response = await api.get(`/players/get-players-by-team/${teamId}`);

        // ✅ return only array
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching players by team:', error);
        return [];
    }
};

export {
    createTeam,
    updateTeam,
    deleteTeam,
    getTeams,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getPlayersByTeam
}