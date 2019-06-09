import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

class Api {
    constructor() {
        this.adapter = axios.create({
            baseURL: API_URL
        });
    }

    sendRequest = (url, type, payload) => {
        return this.adapter.request({
            url: url,
            method: type.toUpperCase(),
            data: payload
        }).catch(this.handleApiError);
    }

    handleApiError(err) {
        if (err.response && err.response.data) {
            return Promise.reject(new Error(err.response.data));
        }

        return Promise.reject(new Error(err.message));
    }
}

export default new Api();