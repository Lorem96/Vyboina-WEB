import React, { Component } from "react";
import * as mapActions from '../actions/map';
import { connect } from "react-redux";

class MapViewScreen extends Component {

    componentWillMount() {
        const { getPropertyInfoById } = this.props;

        getPropertyInfoById(13);
    }

    render() {
        const { currentData } = this.props;
        return (
            <div>
                {JSON.stringify(currentData)}
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
