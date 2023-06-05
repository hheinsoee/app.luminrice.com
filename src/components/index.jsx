import { Typography } from '@mui/material';
import moment from 'moment/moment';
import React from 'react';

export default function DateTime(props) {
    return (
        <div>
            <div>
                {moment(props.date).format('D/M/yyy')}
            </div>
            <Typography variant='caption'>
                {moment(props.date).format('hh:mm a')}
            </Typography>
        </div>
    );
}