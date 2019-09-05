import React, { Component } from "react";
import ReactMapGL from "react-map-gl";
import * as mapActions from "../actions/map";
import { connect } from "react-redux";
import MAP_STYLE from './map-style-basic-v8.json';

class MapViewScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                width: 800,
                height: 800,
                zoom: 8
            },
            mapStyle: { ...MAP_STYLE }
        };

        this.showData = this.showData.bind(this);
    }

    componentWillMount() {
        const { getPropertyInfoById } = this.props;

        getPropertyInfoById(6);
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

        const { layers, sources } = this.state.mapStyle;

        this.setState({
            ...this.state,
            mapStyle: {
                ...this.state.mapStyle,
                layers: [
                    ...layers,
                    ...newLayers
                ],
                sources: {
                    ...sources,
                    ...newSources
                }
            }
        });
    }

    render() {
        const { viewport, mapStyle } = this.state;

        return (
            <div>
                <ReactMapGL
                    width="100%"
                    height="100%"
                    {...viewport}
                    mapStyle={mapStyle}
                    onViewportChange={(viewport) => this.setState({ viewport })}
                />
                <button onClick={this.showData} className="ui button">Click Here</button>
                <button onClick={() => console.log(this.state.mapStyle)} className="ui button">Show</button>
            </div>
        )
    }
}

const mapStateToProps = ({ map }) => ({
    ...map
});

const mapDispatchToProps = dispatch => {
    return {
        getPropertyInfoById: (id) => dispatch(mapActions.getPropertyInfoById(id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapViewScreen);
