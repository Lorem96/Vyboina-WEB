import * as actionTypes from './actionTypes';
import convertRawDataToGeoJson from '../services/geoJson';
import _ from 'lodash';

export const getRecords = (id) => {
    return {
        type: actionTypes.FETCH_MAP_DATA,
        payload: id
    };
}

export const calculateData = (selectedId) => {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.CALCULATE_DATA });

        const { calculatedData, currentData } = getState().map;
        const selectedRawData = currentData.find((rawRecord) => rawRecord._id === selectedId);
        const geoJsonData = convertRawDataToGeoJson(JSON.parse(selectedRawData.data));

        if (!_.isEqual(calculatedData, geoJsonData)) {
            dispatch({ type: actionTypes.CALCULATE_DATA_SUCCESS, payload: { ...geoJsonData } });
        } else {
            dispatch({ type: actionTypes.CALCULATE_DATA_IS_EQUAL });
        }
    }
}