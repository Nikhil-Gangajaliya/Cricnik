import { api } from "../api/api";

const addBall = async (data) => {
    try {
        const response = await api.post('/scores/add-ball', data);
        return response.data;
    } catch (error) {
        console.error('Error adding ball:', error);
        throw error;
    }
};

const changeBowler = async (data) => {
    try {
        const response = await api.post('/scores/change-bowler', data);
        return response.data;
    } catch (error) {
        console.error('Error changing bowler:', error);
        throw error;
    }
};

const getScorecard = async (matchId) => {
    try {
        const response = await api.get(`/scorecards/scorecard/${matchId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching scorecard:', error);
        throw error;
    };
};

export {
    addBall,
    changeBowler,
    getScorecard
}