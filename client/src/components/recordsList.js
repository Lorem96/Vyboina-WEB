import React, { Component } from 'react';
import { Container, List, Divider } from 'semantic-ui-react'
import RecordCard from './recordCard';
import { connect } from "react-redux";
import * as mapActions from "../actions/map";

class RecordsList extends Component {
    render() {
        const { currentData, calculateData } = this.props;
        const renderCards = () => (currentData.map((record) => <RecordCard key={record._id} {...record} calculateData={() => calculateData(record._id)} />));
        const listStyle = { position: 'absolute', top: 20, right: 35, backgroundColor: 'white', width: '15%', height: '15%', overflow: 'auto' };

        return (
            <Container>
                <List divided relaxed style={listStyle}>
                    {currentData ? renderCards() : 'No records'}
                </List>
            </Container>
        )
    }
}


const mapStateToProps = ({ map }) => ({
    ...map
});

const mapDispatchToProps = dispatch => {
    return {
        calculateData: (id) => dispatch(mapActions.calculateData(id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordsList);