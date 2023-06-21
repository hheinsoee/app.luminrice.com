import { AppBar, Autocomplete, Card, CardActionArea, CardContent, Chip, Fab, Fade, FormControl, IconButton, Input, InputLabel, MenuItem, Paper, Popper, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextareaAutosize, Toolbar, Typography } from '@mui/material';

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
import { Add, Close } from '@mui/icons-material';
import { useGet } from '../../../hooks/get';


export function VoucherAdd(props) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState(null);
    const defaultVoucherInfo = {
        note: '',
        customers_id: null,
        new_customer: false,
        pay_amount: 0
    }
    const [voucher, setVoucher] = React.useState(defaultVoucherInfo);
    const [saleItem, setSaleItem] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const token = getTokenFromLocalStorage();


    const handleClose = () => {
        setOpen(false);
        props.setOpen(false);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            ...voucher,
            items: saleItem
        };
        var option = {
            method: 'post',
            url: `${API_URL}/voucher`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            data: data,
            validateStatus: false //to get error status
        };
        // console.log(o)

        props.setAlert(false)
        // console.log(option);
        props.setModal('ဘောက်ချာမှတ်နေပါသည် စောင့်ပီးပါ');
        await axios.request(option)
            .then(function (response) {
                if (response.status == 200) {
                    props.setAlert({
                        message: `ဘောက်ချာနံပါတ် "${response.data.id}" ကိုမှတ်ပြီး`
                    })
                    props.setFreshData(response.data);
                    setVoucher(defaultVoucherInfo)
                    setSaleItem([])
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
    React.useEffect(() => {
        var t = 0;
        saleItem.map((s) => {
            t = t + (s.sell_price * s.quantity == NaN ? 0 : s.sell_price * s.quantity)
        })
        setTotal(t);
    }, [saleItem])
    const [loadingCustomer, errCustomer, customers] = useGet({ url: `${API_URL}/customers` });
    return (
        <div>
            <Dialog
                open={open}
                // fullScreen
                fullWidth
                maxWidth="md"
                onClose={handleClose}
                scroll={'body'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <Close />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            ဘောက်ချာ
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleSubmit}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                        {
                            loadingCustomer
                                ? "loading customer"
                                : <div style={{ display: 'flex' }} >
                                    <Autocomplete
                                        freeSolo
                                        disablePortal
                                        id="combo-box-demo"
                                        options={customers && customers.map((c) => ({ id: c.id, label: c.name }))}
                                        onChange={(e, customer) => setVoucher({ ...voucher, customers_id: customer ? customer.id : null })}
                                        // new_customer
                                        onInputChange={(e, customer_name) => {
                                            var old_customer = customers.find(c => c.name == customer_name)
                                            setVoucher({ ...voucher, new_customer: customer_name, customers_id: old_customer ? old_customer.id : null })
                                        }}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField
                                            variant='standard' {...params} label="ဖောက်သည် အမည်" helperText={voucher.customers_id && `${customers.find(c => c.id == voucher.customers_id).address} အကြွေး ${nFormat(customers.find(c => c.id == voucher.customers_id).buy_amount - customers.find(c => c.id == voucher.customers_id).pay_amount)}`} />
                                        }
                                    />
                                    {(voucher.new_customer && voucher.new_customer !== '' && !voucher.customers_id) && `(new Customer)`}
                                </div>
                        }
                        <div style={{ textAlign: 'right' }}>
                            <i>#new???</i>
                            <DateTime />
                        </div>

                    </Box>

                    <TableContainer>
                        <Table aria-label="simple table" dense table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right" sx={{ width: 20 }}>စဉ်</TableCell>
                                    <TableCell >အမျိုးအမည်</TableCell>
                                    <TableCell align="right" sx={{ width: 130 }}>အရွယ်စား</TableCell>
                                    <TableCell align="right" sx={{ width: 130 }}>ဈေးနှုန်း</TableCell>
                                    <TableCell align="right" sx={{ width: 100 }}>အရေတွက်</TableCell>
                                    <TableCell align="right" sx={{ width: 130 }}>သင့်ငွေ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[...Array(saleItem.length + 1)].map((s, i) => {
                                    var t = typeof saleItem[i] !== 'undefined' ? saleItem[i].quantity * saleItem[i].sell_price : 0;
                                    return <TableRow key={i}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>
                                            <Select
                                                size="small"
                                                variant="standard"
                                                defaultValue={saleItem[i] && saleItem[i].items_id}
                                                fullWidth
                                                onChange={(e) => {
                                                    const updatedItem = { ...saleItem[i], items_id: e.target.value };
                                                    setSaleItem(prevItems => {
                                                        const updatedItems = [...prevItems];
                                                        updatedItems[i] = updatedItem;
                                                        return updatedItems;
                                                    });
                                                }}>
                                                {
                                                    props.genInfo.items.map((it, i) => {
                                                        return <MenuItem value={it.id} key={i}>
                                                            <span style={{ backgroundColor: it.color, height: '1rem', width: '1rem' }}>
                                                            </span>&nbsp;{it.name}
                                                        </MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Select
                                                size="small"
                                                variant="standard"
                                                fullWidth
                                                defaultValue={saleItem[i] && saleItem[i].sizes_id}
                                                onChange={(e) => {
                                                    const updatedItem = { ...saleItem[i], sizes_id: e.target.value };
                                                    setSaleItem(prevItems => {
                                                        const updatedItems = [...prevItems];
                                                        updatedItems[i] = updatedItem;
                                                        return updatedItems;
                                                    });
                                                }}>
                                                {
                                                    props.genInfo.sizes.map((s, i) => {
                                                        return <MenuItem value={s.id} key={i}>
                                                            {s.size} {s.unit}
                                                        </MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </TableCell>
                                        <TableCell><Input type='number' defaultValue={saleItem[i] && saleItem[i].sell_price} inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                            onChange={(e) => {
                                                const updatedItem = { ...saleItem[i], sell_price: e.target.value };
                                                setSaleItem(prevItems => {
                                                    const updatedItems = [...prevItems];
                                                    updatedItems[i] = updatedItem;
                                                    return updatedItems;
                                                });
                                            }} /></TableCell>
                                        <TableCell><Input type='number' defaultValue={saleItem[i] && saleItem[i].quantity} inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                            onChange={(e) => {
                                                const updatedItem = { ...saleItem[i], quantity: e.target.value };
                                                setSaleItem(prevItems => {
                                                    const updatedItems = [...prevItems];
                                                    updatedItems[i] = updatedItem;
                                                    return updatedItems;
                                                });
                                            }} /></TableCell>
                                        <TableCell align="right">{nFormat(t)}</TableCell>
                                    </TableRow>
                                }
                                )}
                                <TableRow sx={{ '& td, & th': { border: 0 } }}>
                                    <TableCell align="right" colSpan={5}>စုစုပေါင်း</TableCell>
                                    <TableCell align="right">{nFormat(total)}</TableCell>
                                </TableRow>
                                <TableRow sx={{ '& td, & th': { border: 0 } }}>
                                    <TableCell align="right" colSpan={5}>ယခင်ပေးရန် ကျန်ငွေ</TableCell>
                                    <TableCell align="right">{nFormat(
                                        voucher.customers_id
                                            ? customers.find(c => c.id == voucher.customers_id).buy_amount - customers.find(c => c.id == voucher.customers_id).pay_amount
                                            : 0
                                    )}
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{ '& td, & th': { border: 0 } }}>
                                    <TableCell align="right" colSpan={5}>ယခု ပေးငွေ</TableCell>
                                    <TableCell align="right">
                                        <TextField type='number' defaultValue={defaultVoucherInfo.pay_amount} inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                            onChange={(e) => setVoucher({ ...voucher, pay_amount: e.target.value })} />
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="right" colSpan={5}>ကျန်ငွေ</TableCell>
                                    <TableCell align="right">
                                        {nFormat((voucher.customers_id
                                            ? customers.find(c => c.id == voucher.customers_id).buy_amount - customers.find(c => c.id == voucher.customers_id).pay_amount
                                            : 0) - voucher.pay_amount + total)}
                                    </TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ p: 1 }}>
                        <Box sx={{ color: 'text.disabled', fontSize: 12 }}>မှတ်ချက်</Box>
                        <Input fullWidth value={voucher.note} onChange={(e) => setVoucher({ ...voucher, note: e.target.value })} />
                    </Box>
                    <Box sx={{ textAlign: 'right', p: 1 }}>
                        <Box sx={{ color: 'text.disabled', fontSize: 12 }}>ဘောက်ချာဖြတ်သူ</Box>
                        {props.user.name}
                        <div>{props.user.role_name}</div>
                        <small><i>{props.user.id}</i></small>
                    </Box>
                </DialogContent>
            </Dialog>
        </div >
    );
}
export function VoucherDetail(props) {
    const [open, setOpen] = React.useState(false);
    const [voucher, setVoucher] = React.useState(null);
    const handleClose = () => {
        setVoucher(null)
        setOpen(false);
    }
    const loadVoucher = async () => {
        const token = getTokenFromLocalStorage();
        var option = {
            method: 'get',
            url: `${API_URL}/voucher/${props.id}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            validateStatus: false //to get error status
        };

        // props.setModal('loading...');
        await axios.request(option)
            .then(function (response) {
                if (response.status == 200) {
                    setVoucher(response.data)
                    setOpen(true)
                    
                    console.log(response.data);
                } else {
                    props.setAlert({
                        message: response.data.message,
                        status: 'warning'
                    })
                    console.log(response.data.message);
                }
                // props.setModal(false)
            }).catch(function (error) {
                console.log(error)
                // props.setModal('err')
            });
    }
    const handleOpen = async () => {
        console.log(props)
        setOpen(true);
        loadVoucher()
    }

    return (
        // handleOpen
        <React.Fragment>
            <Chip label={`#${props.id.toString().padStart(5, 0)}`} onClick={handleOpen} />
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
                                <i>#{props.id}</i>
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
                                        <TableCell align="right">{nFormat(voucher.total_cost || 0)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 1 }}>
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
        </React.Fragment>
    )
}

