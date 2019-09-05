import {
    call,
    put,
    all,
    takeLatest
} from "redux-saga/effects";
import * as actionTypes from '../actions/actionTypes';
import api from "../services/api";

export default function* mapSaga() {
    function* getMapData(action) {
        try {
            const response = yield call(
                api.sendRequest,
                `/record/${action.payload}`,
                "get"
            );
            const { data } = response;

            yield put({
                type: actionTypes.FETCH_MAP_DATA_SUCCESS,
                payload: data
            });
        } catch (err) {
            console.log(err);

            yield put({
                type: actionTypes.FETCH_MAP_DATA_ERROR,
                payload: err
            });
        }
    }

    yield all([
        takeLatest(actionTypes.FETCH_MAP_DATA, getMapData)
    ]);
}
