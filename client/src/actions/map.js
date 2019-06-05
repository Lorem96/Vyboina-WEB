import * as types from './actionTypes';

export const clearCalculatedData = () => {
    return (dispatch) => {
        dispatch({ type: types.FETCH_MAP_DATA });
    }
}