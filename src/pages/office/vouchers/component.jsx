import { Card, CardActionArea, CardContent, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextareaAutosize, Typography } from '@mui/material';

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
import { getTokenFromLocalStorage } from '../../../auth/auth'
import moment from 'moment';
import { DataGrid } from '@mui/x-data-grid';
import DateTime from '../../../components';
import { nFormat } from '../../../helpers/function';
export function PurchaseAdd(props) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState(null);
    const genInfo = props.genInfo;

    const token = getTokenFromLocalStorage();


    const handleClose = () => {
        setOpen(false);
        props.setOpen(false);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var option = {
            method: 'post',
            url: `${API_URL}/purchase`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            data: {
                'purchase_date': data.get('purchase_date'),
                'items_id': data.get('items_id'),
                'sizes_id': data.get('sizes_id'),
                'quantity': data.get('quantity'),
                'cost': data.get('cost'),
                'note': data.get('note'),
            },
            validateStatus: false //to get error status
        };
        // console.log(o)

        props.setAlert(false)
        if (
            option.data.purchase_date == '' ||
            option.data.items_id == '' ||
            option.data.sizes_id == '' ||
            option.data.quantity == '' ||
            option.data.cost == ''
        ) {
            props.setAlert({
                message: "ပြည်ြစုံစွာရေးပါ",
                status: 'warning'
            })
            return;
        }
        // console.log(option);
        props.setModal('loading...');
        await axios.request(option)
            .then(function (response) {
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
                props.setModal('err')
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
                <DialogTitle id="scroll-dialog-title">အဝင်စာရင်းသစ်ထည့်ရန်</DialogTitle>
                <DialogContent >
                    <DialogContentText
                        sx={{ '& .MuiTextField-root': { my: 1 }, '&>*': { my: 2 } }}
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="purchase_date">ဝယ်ယူသည့်အချိန်</label><br />
                            <input type="datetime-local" name="purchase_date" id="purchase_date" value={moment().format('yyy-MM-DD[T]hh:mm')} />
                        </div>

                        <FormControl fullWidth
                            variant="standard"
                            sx={{ my: 2 }}>
                            <InputLabel id='item'>ဆန်အမျိုးအစား</InputLabel>
                            <Select labelId='item' name="items_id">
                                {
                                    genInfo.items.map((item, i) =>
                                        <MenuItem value={item.id} key={i}><span style={{ backgroundColor: item.color, height: '1rem', width: '1rem' }}></span>&nbsp;{item.name}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth
                            sx={{ my: 2 }}
                            variant="standard">
                            <InputLabel id='weight'>တစ်ခုချင်း အလေးချိန်</InputLabel>
                            <Select labelId='weight' name="sizes_id">
                                {
                                    genInfo.sizes.map((size, i) =>
                                        <MenuItem value={size.id} key={i}>{size.size} {size.unit}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                        <TextField fullWidth autoFocus
                            id="quantity"
                            name="quantity"
                            label="အရေအတွက်"
                            type="number"
                            variant="standard"
                            required
                        />
                        <TextField fullWidth autoFocus
                            id="cost"
                            name="cost"
                            label="ကုန်ကျငွေ"
                            type="number"
                            variant="standard"
                            // onChange={()=>setCost()}
                            required
                        />

                        {message && <div>{message}</div>}
                        <TextareaAutosize
                            style={{ width: '100%', padding: 10 }}
                            minRows={3}
                            id="note"
                            name="note"
                            label="note"
                            type="textarea"
                            placeholder="Note"
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
export function VoucherDetail(props) {
    const [open, setOpen] = React.useState(false);
    const [voucher, setVoucher] = React.useState(null);
    const handleClose = () => {
        setOpen(false);
        props.setOpen(false)
    }
    const loadVoucher = async () => {
        const token = getTokenFromLocalStorage();
        var option = {
            method: 'get',
            url: `${API_URL}/voucher/${props.open.id}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            validateStatus: false //to get error status
        };

        props.setModal('loading...');
        await axios.request(option)
            .then(function (response) {
                if (response.status == 200) {
                    setVoucher(response.data)
                    setOpen(true)
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
                props.setModal('err')
            });

    }
    React.useEffect(() => {
        if (props.open) {
            loadVoucher()
        }
    }, [props.open])


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={'body'}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title" sx={{ p: 4 }}>Invoice</DialogTitle>

            {
                voucher &&

                <DialogContent >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                        <div>
                            <Box sx={{ color: 'text.disabled', fontSize: 12 }}>ဖောက်သည် အမည်</Box>
                            {voucher.customer_name}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <i>#{props.open.id}</i>
                            <DateTime date={voucher.create_time} />
                        </div>

                    </Box>

                    <TableContainer>
                        <Table sx={{ width: 540 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">စဉ်</TableCell>
                                    <TableCell >အမျိုးအမည်</TableCell>
                                    <TableCell align="right">အရွယ်စား</TableCell>
                                    <TableCell align="right">ဈေးနှုန်း</TableCell>
                                    <TableCell align="right">အရေတွက်</TableCell>
                                    <TableCell align="right">သင့်ငွေ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {voucher.sale_items.map((row, i) => (
                                    <TableRow
                                        key={i}
                                    >
                                        <TableCell align="right">{i + 1}</TableCell>
                                        <TableCell>{row.item_name}</TableCell>
                                        <TableCell align="right">{row.size} {row.unit}</TableCell>
                                        <TableCell align="right">{nFormat(row.sell_price)}</TableCell>
                                        <TableCell align="right">{nFormat(row.quantity)}</TableCell>
                                        <TableCell align="right">{nFormat(row.quantity * row.sell_price)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="right">စုစုပေါင်း</TableCell>
                                    <TableCell align="right">{nFormat(voucher.total_cost)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{p:1}}>
                        <Box sx={{ color: 'text.disabled', fontSize: 12 }}>မှတ်ချက်</Box>
                        {voucher.note}
                    </Box>
                    <Box sx={{ textAlign: 'right', p: 1 }}>
                        <Box sx={{ color: 'text.disabled', fontSize: 12 }}>ဘောက်ချာဖြတ်သူ</Box>
                        {voucher.user_name}<br />
                        <small>{voucher.users_id}</small>
                    </Box>
                </DialogContent>
            }
        </Dialog>
    )
}

