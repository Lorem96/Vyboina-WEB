import React from 'react'
import { List } from 'semantic-ui-react'

const itemStyle = {
    marginTop: '2px',
    cursor: 'pointer',
    backgroundColor: '#def05b'
};

export default (props) => {
    const { created, calculateData } = props;

    return (
        <List.Item style={itemStyle} onClick={calculateData}>
            <List.Content>
                <List.Item as='a'>{created}</List.Item>
            </List.Content>
        </List.Item >
    )
}