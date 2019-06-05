import axios from "axios";
const apiAddress = 'http://127.0.0.1:9000/api'

class Api {
    constructor() {
        this.adapter = axios.create({
            baseURL: apiAddress
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