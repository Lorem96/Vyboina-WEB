import * as types from '../actions/actionTypes';

const initialState = {
    currentData: null,
    calculatedData: null,
    dataFetching: false,
    dataFetchingError: {}
};

const map = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.FETCH_MAP_DATA: {
            return {
                ...state,
                dataFetching: true
            }
        }
        case types.FETCH_MAP_DATA_SUCCESS: {
            return {
                ...state,
                dataFetching: false,
                currentData: [...action.payload]
            }
        }
        case types.FETCH_MAP_DATA_ERROR: {
            return {
                ...state,
                dataFetching: false,
                currentData: {},
                dataFetchingError: action.payload
            }
        }
        case types.CALCULATE_DATA_SUCCESS: {
            return {
                ...state,
                calculatedData: action.payload
            }
        }
        default:
            return state;
    }
}

export default map;