import React from 'react';
import { RingLoader } from 'react-spinners';
import { Box } from 'gestalt';
import 'gestalt/dist/gestalt.css';


const Loader = () => {
    return (
    <Box
    position="fixed"
    dangerouslySetInlineStyle={{
        __style: {
            botom: 300,
            left: '50%',
            transform: "translateX(-50%)",
            marginTop: '20%'
        }
    }}
    >
    <RingLoader 
    color="green"
    size = {200}
    margin = "3px"
    />
    </Box>
    );
}

export default Loader;