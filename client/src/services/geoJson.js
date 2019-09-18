/* eslint-disable prefer-template */
import KalmanFilter from 'kalmanjs';

const _ = require('lodash');

export const LINE_SHAPE = 'LineString';
export const POINT_SHAPE = 'MultiPoint';

const getGeoJsonTemplate = (color, shape) => {
    return ({
        type: "FeatureCollection",
        color,
        features: [
            {
                type: "Feature",
                geometry: {
                    type: shape,
                    coordinates: []
                }
            }
        ]
    })
}

const filterDataWithKalman = (rawDataWithColors) => {
    const kfLong = new KalmanFilter();
    const kfLat = new KalmanFilter();
    const result = rawDataWithColors.map((point) => {
        const pointCoords = point.coords;
        const filteredLong = kfLong.filter(parseFloat(pointCoords[0]));
        const filteredLat = kfLat.filter(parseFloat(pointCoords[1]));

        return {
            ...point,
            coords: [filteredLong, filteredLat]
        };
    });

    return result;
}

const getGeoJsonResult = (filteredDataWithColors, shape) => {
    return filteredDataWithColors.reduce((geoJson, point) => {
        const pointColor = point.color;
        const nextKeyNumber = geoJson.keyNumber + 1;
        const long = parseFloat(point.coords[0]);
        const lat = parseFloat(point.coords[1]);
        const pointCoords = [long, lat];
        const nextPoint = filteredDataWithColors[nextKeyNumber];
        let nextPointCoords;

        if (!nextPoint) {
            nextPointCoords = [long, lat];
        } else {
            nextPointCoords = [parseFloat(nextPoint.coords[0]), parseFloat(nextPoint.coords[1])];
        }

        if (shape === POINT_SHAPE) {
            const pointsWithSameColorsIndex = geoJson.data.findIndex((elem, index) => elem.color === pointColor && index !== geoJson.keyNumber)

            if (pointsWithSameColorsIndex !== -1) {
                geoJson.data[pointsWithSameColorsIndex].features[0].geometry.coordinates.push([...pointCoords]);

                return { data: geoJson.data };
            }

            const newGeoJson = getGeoJsonTemplate(pointColor, shape);
            newGeoJson.features[0].geometry.coordinates.push([...pointCoords]);
            geoJson.data.push(newGeoJson);

            return { data: geoJson.data, keyNumber: geoJson.keyNumber + 1 };
        }

        const newGeoJson = getGeoJsonTemplate(pointColor, shape);

        newGeoJson.features[0].geometry.coordinates.push(pointCoords, nextPointCoords);

        const newData = geoJson.data;

        newData.push(newGeoJson);

        return { data: newData, keyNumber: nextKeyNumber };

    }, { keyNumber: 0, data: [] })
}

const getMaxMinValues = (data) => {
    const firstObjectValue = data[Object.keys(data)[0]];

    return Object.keys(data).reduce((accum, objectKey) => {
        const maxValue = data[objectKey] > accum.maxValue ? data[objectKey] : accum.maxValue;
        const minValue = data[objectKey] < accum.minValue ? data[objectKey] : accum.minValue;

        return { maxValue, minValue };
    }, { maxValue: 0, minValue: firstObjectValue })
}

const rgbToHex = (r, g, b) => {
    let red = r.toString(16);
    let green = g.toString(16);
    let blue = b.toString(16);

    if (red.length === 1)
        red = "0" + red;
    if (green.length === 1)
        green = "0" + green;
    if (blue.length === 1)
        blue = "0" + blue;

    return "#" + red + green + blue;
}

const setColors = (maxValue, minValue, rawData) => {
    return Object.keys(rawData).map((key) => {
        const point = rawData[key];
        let weight = ((point - minValue) / (maxValue - minValue));

        if (minValue === maxValue) {
            weight = 0.5;
        }

        const red = Math.ceil(255 * weight);
        const green = Math.ceil(255 - red);

        return {
            coords: key.split(','),
            color: rgbToHex(red, green, 0),
            weight
        };
    })
}

const startAlgoritm = (rawData) => {
    const data = _.cloneDeep(rawData);

    const result = Object.keys(data).reduce((acum, currentKey) => {
        const currentSegment = data[currentKey];
        const startCoords = currentSegment.startCoords.coords;
        const endCoords = currentSegment.endCoords.coords;

        currentSegment.accelerometerData = currentSegment.accelerometerData.map((accelerometerInfo) => {
            const { x, y, z } = accelerometerInfo;

            return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        });

        const { summValue } = currentSegment.accelerometerData.reduce((accum, acceleromValue) => {
            return { summValue: accum.summValue + acceleromValue };
        }, { summValue: 0 })

        const propertyKey = `${startCoords.longitude},${startCoords.latitude}`;
        const finalObject = { [propertyKey]: summValue }

        return {
            ...acum,
            ...finalObject
        }
    }, {});

    return result;
}

const convertRawDataToGeoJson = (rawData, shape = LINE_SHAPE) => {
    if (rawData && Object.keys(rawData).length) {
        const data = startAlgoritm(rawData);
        const { maxValue, minValue } = getMaxMinValues(data);
        const rawDataWithColors = setColors(maxValue, minValue, data);
        const filteredDataWithColors = filterDataWithKalman(rawDataWithColors);
        const finalResult = getGeoJsonResult(filteredDataWithColors, shape);

        return ({ coords: [...finalResult.data], shape });
    } else {
        return ({ coords: [], shape });
    }
}

export default convertRawDataToGeoJson;