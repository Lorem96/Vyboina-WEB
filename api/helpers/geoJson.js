/* eslint-disable prefer-template */
// import rawDataTest from './testData';
// import rawDataTestBig from './testDataBig';

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

const getGeoJsonResult = (rawDataWithColors, shape) => {
    return rawDataWithColors.reduce((geoJson, point) => {
        const pointColor = point.color;
        const nextKeyNumber = geoJson.keyNumber + 1;
        const long = parseFloat(point.coords[0]);
        const lat = parseFloat(point.coords[1]);
        const pointCoords = [long, lat];
        const nextPoint = rawDataWithColors[nextKeyNumber];
        let nextPointCoords;

        if (!nextPoint) {
            nextPointCoords = [long, lat];
        } else {
            nextPointCoords = [parseFloat(nextPoint.coords[0]), parseFloat(nextPoint.coords[1])];
        }

        if (shape === POINT_SHAPE) {
            const pointsWithSameColorsIndex = geoJson.data.findIndex((elem, index) => elem.color === pointColor && index != geoJson.keyNumber)

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

const getMaxMinValues = (data, selector) => {
    const firstObjectValue = data[Object.keys(data)[0]][selector];

    return Object.keys(data).reduce((accum, objectKey) => {
        const maxValue = data[objectKey][selector] > accum.maxValue ? data[objectKey][selector] : accum.maxValue;
        const minValue = data[objectKey][selector] < accum.minValue ? data[objectKey][selector] : accum.minValue;

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

const setColors = (maxValue, minValue, rawData, selector) => {
    return Object.keys(rawData).map((key) => {
        const point = _.cloneDeep(rawData[key]);
        let weight = ((point[selector] - minValue) / (maxValue - minValue));

        if (weight < 0) {
            weight = 0;
        }

        if (minValue === maxValue) {
            weight = 0.5;
        }

        const red = Math.ceil(255 * weight);
        const green = Math.ceil(255 - red);

        point.coords = key.split(',');
        point.color = rgbToHex(red, green, 0);
        point.weight = weight;

        return point;
    })
}

const convertRawDataToGeoJson = (rawData, selector = 'z', shape = LINE_SHAPE, cb) => {
    if (rawData && Object.keys(rawData).length) {
        const { maxValue, minValue } = getMaxMinValues(rawData, selector);
        const rawDataWithColors = setColors(maxValue, minValue, rawData, selector);
        const finalResult = getGeoJsonResult(rawDataWithColors, shape);

        cb({ coords: [...finalResult.data], shape });
    } else {
        cb({ coords: [], shape });
    }
}

export default convertRawDataToGeoJson;