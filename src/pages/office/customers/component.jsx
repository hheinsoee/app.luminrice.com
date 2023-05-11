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
export function CustomerAdd(props) {
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
            url: `${API_URL}/customer`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            data: {
                'name': data.get('name'),
                'phone': data.get('phone'),
                'address': data.get('address'),
            },
            validateStatus: false //to get error status
        };
        // console.log(o)

        props.setAlert(false)
        if (
            option.data.name == '' ||
            option.data.phone == '' ||
            option.data.address == ''
        ) {
            props.setAlert({
                message: "အချက်အလက်ပြည့်စုံစွာထည့်ပါ",
                status: 'warning'
            })
            return;
        }
        props.setModal('loading...');
        await axios.request(option).then(function (response) {
            if (response.status == 200) {
                props.setAlert({
                    message: `customer "${response.data.name}" ကိုမှတ်ပြီး`
                })
                props.setFreshCustomer(response.data);
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
                <DialogTitle id="scroll-dialog-title">New Customer</DialogTitle>
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
                        /><TextField fullWidth
                            id="phone"
                            name="phone"
                            label="Phone Number"
                            type="text"
                            variant="standard"
                            required
                        /><TextField fullWidth
                            id="address"
                            name="address"
                            label="Address"
                            type="text"
                            variant="standard"
                            required
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