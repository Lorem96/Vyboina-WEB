import { all, fork } from "redux-saga/effects";
import mapSaga from "./map";

export default function* rootSaga() {
    yield all([fork(mapSaga)]);
}