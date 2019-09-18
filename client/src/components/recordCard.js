import React from 'react'
import { List, Segment } from 'semantic-ui-react'

const itemStyle = {
    cursor: 'pointer'
};

export default (props) => {
    const { created, calculateData } = props;

    return (
        <Segment style={itemStyle} onClick={calculateData} compact> {created} </Segment>
    )
}