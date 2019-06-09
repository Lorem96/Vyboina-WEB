import React, { Component } from "react";
import ReactMapGL from "react-map-gl";
import * as mapActions from "../actions/map";
import { connect } from "react-redux";

class MapViewScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                width: 800,
                height: 800,
                latitude: 37.7577,
                longitude: -122.4376,
                zoom: 8
            }
        };
    }

    componentWillMount() {
        const { getPropertyInfoById } = this.props;

        getPropertyInfoById(13);
    }

    render() {
        const { currentData } = this.props;
        return (
            <div>
                <ReactMapGL
                    width="100%"
                    height="100%"
                    {...this.state.viewport}
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
        getPropertyInfoById: (id) => dispatch(mapActions.getPropertyInfoById(id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapViewScreen);
