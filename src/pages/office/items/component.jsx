import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

import { Link } from 'react-router-dom';

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Box, TextField } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../../../utils/constants';
import { getTokenFromLocalStorage } from './../../../auth/auth'
export function ItemAdd(props) {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
        props.setOpen(false);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const token = getTokenFromLocalStorage();
        var option = {
            method: 'post',
            url: `${API_URL}/item`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            data: {
                'name': data.get('name'),
                'color': data.get('color'),
                'description': data.get('description')
            },
            validateStatus: false //to get error status
        };
        // console.log(o)

        props.setAlert(false)
        if (
            option.data.name == ''
        ) {
            props.setAlert({
                message: "ဆန်အမည်ရေးပါ",
                status: 'warning'
            })
            return;
        }
        props.setModal('loading...');
        await axios.request(option).then(function (response) {
            if (response.status == 200) {
                props.setAlert({
                    message: `ဆန် "${response.data.name}" ကိုမှတ်ပြီး`
                })
                props.setFreshData(response.data);
                handleClose()
            } else {
                props.setAlert({
                    message: response.data.message,
                    status: 'warning'
                })
                console.log(response.data.message);
            }
            props.setModal(false)
        }).catch(function (error) {
            console.log(error)
            props.setModal(false)
        });
    }

    React.useEffect(() => {
        setOpen(props.open)
    }, [props.open]);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={'body'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">ဆန် အမျိုးအမည်သစ်</DialogTitle>
                <DialogContent >

                    <DialogContentText
                        sx={{ '& .MuiTextField-root': { my: 1 } }}
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}>
                        <TextField fullWidth autoFocus
                            id="name"
                            name="name"
                            label="Name"
                            type="text"
                            variant="standard"
                            required
                        />
                        <TextField fullWidth autoFocus
                            id="color"
                            name="color"
                            label="color"
                            type="color"
                            variant="standard"
                            required
                        />
                        <TextField fullWidth
                            id="description"
                            name="description"
                            label="description"
                            type="text"
                            variant="standard"
                            // required
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}>Save</Button>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div >
    );
}



const sample = [
    { kg: 48, qty: 2089 },
    { kg: 24, qty: 2489 },
    { kg: 12, qty: 34522 },
    { kg: 6, qty: 209 }
]
function ItemsCard(props) {
    var total = 0;
    return (
        <Card>
            <CardActionArea component={Link} to={`/items/id`}>
                <CardContent>
                    <Typography variant='big' className='big'>
                        ဆန် အမည်
                    </Typography>
                    <table className='smallDashboard' cellspacing="0">
                        {
                            sample.map((r, i) => {
                                total = total + (r.kg * r.qty);
                                return (
                                    <tr className='_count' key={i}>
                                        <td className='_size'>{r.kg} kg</td>
                                        <td className='_amount rtl'>{r.qty.toLocaleString()} pac</td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                    <Typography variant='h6'>
                        <center>{total.toLocaleString()} kg</center>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default ItemsCard;