import React, { Component } from 'react';
import { Container, List, Divider, Segment, Card } from 'semantic-ui-react'
import RecordCard from './recordCard';
import { connect } from "react-redux";
import * as mapActions from "../actions/map";

class RecordsList extends Component {
    render() {
        const { currentData, calculateData } = this.props;
        const renderCards = () => (currentData.map((record) => {
            return (
                <RecordCard
                    key={record._id}
                    {...record}
                    calculateData={() => calculateData(record._id)}
                />
            )
        }));
        const listStyle = {
            position: 'absolute',
            top: 20, right: 35,
            // backgroundColor: 'white',
            width: '30vh',
            // height: '15%',
            maxHeight: '30vh',
            overflow: 'auto'
        };

        return (
            <Container>
                <Segment style={listStyle}>
                    <Segment.Group>
                        {currentData ? renderCards() : 'No records'}
                    </Segment.Group>
                </Segment>
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