import * as actionTypes from './actionTypes';
import convertRawDataToGeoJson from '../services/geoJson';
import _ from 'lodash';

export const getPropertyInfoById = (id) => {
    return {
        type: actionTypes.FETCH_MAP_DATA,
        payload: id
    };
}

export const calculateData = () => {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.CALCULATE_DATA });

        const { calculatedData, selectedRawData } = getState().map;
        const geoJsonData = convertRawDataToGeoJson(selectedRawData);

        if (!_.isEqual(calculatedData, geoJsonData)) {
            dispatch({ type: actionTypes.CALCULATE_DATA_SUCCESS, payload: { ...geoJsonData } });
        } else {
            dispatch({ type: actionTypes.CALCULATE_DATA_IS_EQUAL });
        }
    }
}