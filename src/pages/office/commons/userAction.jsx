import { Check, Save } from '@mui/icons-material';
import { Box, CircularProgress, Fab } from '@mui/material';
import { blue, green } from '@mui/material/colors';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getTokenFromLocalStorage } from '../../../auth/auth';
import { API_URL } from '../../../utils/constants';
import { remove } from '../../../helpers/function';

function UserAction({ params, editRow, setEditRow, apiPath }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    // const [, set] = useState(false);
    useEffect(() => {
        setSuccess(false)
    }, [editRow])
    const handleSubmit = () => {
        setLoading(true);
        setEditRow(remove(editRow, params.row.id))
        // setEditRow(editRow)
        const token = getTokenFromLocalStorage();
        var option = {
            method: 'PUT',
            url: `${API_URL}/${apiPath}/${params.row.id}`,
            data: params.row,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };
        // console.log(o)

        axios.request(option)
            .then(function (response) {
                setSuccess(true)
            })
            .catch(function (error) {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            });
    }
    return (
        <Box sx={{ position: 'relative', m: 1 }}>
            {
                success ? (
                    <Fab
                        color='primary'
                        sx={{
                            width: 40, height: 40,
                            bgcolor: blue[500],
                            '&:hover': {
                                bgcolor: blue[700]
                            }
                        }}
                    >
                        <Check />
                    </Fab>
                ) : (
                    <Fab
                        color='primary'
                        sx={{
                            width: 40, height: 40,
                        }}
                        disabled={!editRow.includes(params.row.id) || loading}
                        onClick={handleSubmit}
                    >
                        <Save />
                    </Fab>
                )
            }
            {
                loading && (
                    <CircularProgress size={52} sx={{ color: blue[500], position: 'absolute', top: -6, left: -6, zIndex: 1 }} />
                )
            }
        </Box>
    );
}

export default UserAction;