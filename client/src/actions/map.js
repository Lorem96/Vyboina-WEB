import * as actionTypes from './actionTypes';

export function getPropertyInfoById(id) {
    return {
        type: actionTypes.FETCH_MAP_DATA,
        payload: id
    };
}