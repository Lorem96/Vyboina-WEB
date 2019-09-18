import React, { Component } from "react";
import ReactMapGL from "react-map-gl";
import * as mapActions from "../actions/map";
import { connect } from "react-redux";
import MAP_STYLE from './map-style-basic-v8.json';
// import MAP_STYLE from 'mapbox://styles/mapbox/streets-v11';

class MapViewScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                zoom: 8,
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        this.showData = this.showData.bind(this);
    }

    componentWillMount() {
        const { getRecords } = this.props;

        getRecords();
        this.locateUser();
    }

    locateUser() {
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({
                ...this.state,
                viewport: {
                    ...this.state.viewport,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    zoom: 10
                }
            }
            );
        });
    }

    showData() {
        const { calculatedData } = this.props;
        if (!calculatedData) {
            return { ...MAP_STYLE };
        }

        const coords = calculatedData.coords;

        const { sources: newSources, layers: newLayers } = coords.reduce((accumulator, currentObj) => {
            const { id, sources, layers } = accumulator;
            const { color } = currentObj;
            const newSources = [
                ...sources,
                {
                    type: 'geojson',
                    data: { ...currentObj }
                }
            ];
            const newLayers = [
                ...layers,
                {
                    id: '' + id,
                    type: 'line',
                    source: '' + id,
                    paint: {
                        'line-color': color,
                        // 'line-cap': 'round',
                        // 'line-join': 'round',
                        'line-width': 10
                    }
                }

            ];
            const newId = id + 1;

            return {
                sources: newSources,
                layers: newLayers,
                id: newId
            }
        }, {
            sources: [],
            layers: [],
            id: 0
        });

        const { layers, sources } = MAP_STYLE;

        return ({
            ...MAP_STYLE,
            layers: [
                ...layers,
                ...newLayers
            ],
            sources: {
                ...sources,
                ...newSources
            }

        });
    }

    render() {
        const { viewport } = this.state;

        return (
            <div>
                <ReactMapGL
                    width="100%"
                    height="100%"
                    {...viewport}
                    mapStyle={this.showData()}
                    onViewportChange={(viewport) => this.setState({ viewport })}
                />
            </div>
        )
    }
}

const mapStateToProps = ({ map }) => ({
    ...map
});

const mapDispatchToProps = dispatch => {
    return {
        getRecords: (id) => dispatch(mapActions.getRecords(id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapViewScreen);
