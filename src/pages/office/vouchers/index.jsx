import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellEditStopParams, MuiEvent, GridCellEditStopReasons } from '@mui/x-data-grid';
import { Button, Chip, MenuItem, Select, TextField } from '@mui/material';
import { PurchaseAdd, VoucherDetail } from './component';
import { API_URL } from '../../../utils/constants';
import { getTokenFromLocalStorage } from '../../../auth/auth';
import axios from 'axios';
import UserAction from '../commons/userAction';
import DateTime from '../../../components';
import moment from 'moment';
import { Info, Person } from '@mui/icons-material';


export default function Sales(props) {

  props.setRouteName('ဘောက်ချာ စာရင်း')
  const [open, setOpen] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [freshData, setFreshData] = React.useState(null);

  const [editRow, setEditRow] = React.useState([]);
  const columns = React.useMemo(
    () => [
      {
        field: 'id',
        headerName: 'အမှတ်',
        width: 100,
        type: 'number',
        renderCell: (params) => <Chip label={`#${params.row.id.toString().padStart(5,0)}`} onClick={()=>setOpenDetail(params.row)}/>
      },
      {
        field: 'create_time',
        headerName: 'စာရင်းသွင်းချိန်',
        // type: 'dateTime',
        width: 120,
        sortable: true,
        valueGetter: (params) => new Date(params.row.create_time),
        renderCell: (params) => <DateTime date={params.row.create_time} />
      },
      {
        field: 'total_cost',
        headerName: 'သင့်ငွေစုစုပေါင်း',
        width: 160,
        type: 'number'
      },
      {
        field: 'customer_name',
        headerName: 'ဖောက်သည် အမည်',
        width: 160,
        sortable: false,
        renderCell: (params) => <><Person/>&nbsp;{params.row.customer_name}</>
      },
      {
        field: 'user_name',
        headerName: 'စာရင်းသွင်းသူ',
        width: 150,
        sortable: false,
        renderCell: (params) => <><Person/>&nbsp;{params.row.user_name}</>
      },
      {
        field: 'note',
        headerName: 'မှတ်ချက်',
        width: 150,
        sortable: false,
      }
    ],
    [editRow]
  );

  const handleClickOpen = () => {
    setOpen(true);
  };
  const token = getTokenFromLocalStorage();
  var option = {
    method: 'GET',
    url: `${API_URL}/vouchers`,
    data: {},
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };
  // console.log(o)

  React.useEffect(() => {
    props.setModal('အရောင်း စာရင်းရယူနေပါသည်! စောင့်ပီးပါ')
    axios.request(option)
      .then(function (response) {
        setRows(response.data);
      })
      .catch(function (error) {
        console.log(error)
      })
      .finally(() => { props.setModal(false) });
  }, [])

  //update or add 
  React.useEffect(() => {
    if (freshData) {
      if (rows.length > 0) {
        const index = rows.findIndex((item) => item.id === freshData.id);
        if (index !== -1) {
          // update existing object
          const newData = [...rows];
          newData[index] = freshData;
          setRows(newData);
        } else {
          // add new object
          setRows([freshData, ...rows]);
        }
      } else {
        setRows([freshData, ...rows]);
      }
    }

  }, [freshData])
  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 110px)' }}>
      <VoucherDetail open={openDetail} setOpen={setOpenDetail} {...props} setFreshData={setFreshData} />
      <PurchaseAdd open={open} setOpen={setOpen} {...props} setFreshData={setFreshData} />
      <Button onClick={handleClickOpen}>အရောင်း စာရင်းသစ်ထည့်ရန်</Button>
      <DataGrid
        sx={{ borderRadius: 0 }}
        rows={rows}
        // editMode="row"
        columns={columns}
        onCellEditStop={params => setEditRow([...editRow, params.id])}
      />
    </Box>
  );
}
