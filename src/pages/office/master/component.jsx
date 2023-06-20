import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Autocomplete, Box, Slider, TextField } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../../../utils/constants';
import { getTokenFromLocalStorage } from '../../../auth/auth'
import { useGet } from '../../../hooks/get';
export function AddForm(props) {
    const [open, setOpen] = React.useState(false);
    const [val, setVal] = React.useState({});
    const handleClose = () => {
        setOpen(false);
        props.setOpen(false);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = getTokenFromLocalStorage();
        var option = {
            method: 'post',
            url: props.postApi,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            data: val,
            // validateStatus: false //to get error status
        };
        console.log(val)

        props.setAlert(false)
        var required = [];
        props.theParams.map((p) => {
            if (p.required && p.form) {
                if (p.field in val) {
                    if (val[p.field] == '') { required.push(p.field) }
                } else {
                    required.push(p.field);
                }
            }
        })
        if (required.length > 0) {
            props.setAlert({
                message: `အချက်အလက်ပြည့်စုံစွာထည့်ပါ ${required.join(', ')}`,
                status: 'warning'
            })
            return;
        } else {
            props.setModal('loading...');
            await axios.request(option).then((response) => {
                props.setAlert({
                    message: `${props.label} "${response.data.name}" has been saved`
                })
                props.setFreshData(response.data);
                handleClose()

            }).catch((error) => {
                console.log(error)
                props.setAlert({
                    message: error.response.data.message,
                    status: 'warning'
                })
            }).finally(() => {
                props.setModal(false)
            });
        }
    }

    React.useEffect(() => {
        setOpen(props.open)
    }, [props.open]);
console.log(props)
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={'body'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">New {props.label}</DialogTitle>
                <DialogContent >

                    <DialogContentText
                        sx={{ '& .MuiTextField-root': { my: 1 } }}
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}>
                        {
                            props.theParams.map((p, i) => {
                                if (p.form !== false) {
                                    switch (p.field) {
                                        case 'items_id':
                                            return <Autocomplete
                                                options={props.genInfo.items.map((c) => ({ id: c.id, label: c.name }))}
                                                onChange={(e, c) => { c && setVal({ ...val, [p.field]: c.id }); }}
                                                renderInput={(params) => {
                                                    return < TextField
                                                        variant='standard' {...params} label={[p.headerName]}
                                                    />
                                                }
                                                }
                                            />
                                            break;
                                        case 'sizes_id':
                                            return <Autocomplete
                                                options={props.genInfo.sizes.map((c) => ({ id: c.id, label: `${c.size} ${c.unit}` }))}
                                                onChange={(e, c) => { c && setVal({ ...val, [p.field]: c.id }); }}
                                                renderInput={(params) => {
                                                    return < TextField
                                                        variant='standard' {...params} label={[p.headerName]}
                                                    />
                                                }
                                                }
                                            />
                                            break;
                                        default:
                                            return <TextField key={i} fullWidth autoFocus={false}
                                                id={p.field}
                                                name={p.field}
                                                label={p.headerName}
                                                type={p.type}
                                                variant="standard"
                                                required={p.required}
                                                onChange={(e) => { setVal({ ...val, [p.field]: e.target.value }); }}
                                            />
                                            break;
                                    }
                                }
                            })
                        }
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