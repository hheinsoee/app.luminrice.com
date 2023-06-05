import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellEditStopParams, MuiEvent, GridCellEditStopReasons } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { CustomerAdd } from './component';
import { API_URL } from '../../../utils/constants';
import { getTokenFromLocalStorage } from '../../../auth/auth';
import axios from 'axios';
import UserAction from '../commons/userAction';



export default function Customers(props) {

  props.setRouteName('ဖောက်သည်များ')
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [freshCustomer, setFreshCustomer] = React.useState(null);

  const [editRow, setEditRow] = React.useState([]);

  const columns = React.useMemo(
    () => [

      {
        field: 'save',
        headerName: '',
        type: 'save',
        width: 70,
        renderCell: params => <UserAction {...{ params, editRow, setEditRow, apiPath: 'customer' }} />
      },
      { field: 'id', headerName: 'ID', width: 40 },
      {
        field: 'name',
        headerName: 'အမည်',
        width: 150,
        editable: true,
        sortable: false,
      },
      {
        field: 'phone',
        headerName: 'ဖုန်းနံပါတ်',
        width: 150,
        editable: true,
        sortable: false,
      },
      {
        field: 'sell',
        headerName: 'ရောင်းပြီး',
        type: 'number',
        width: 110,
        editable: false,
      },
      {
        field: 'pay',
        headerName: 'ရပြီး',
        type: 'number',
        width: 110,
        editable: false,
      },
      {
        field: 'different',
        headerName: 'ရရန်အကြွေး',
        description: '(ရောင်းပြီး) - (ရပြီး)',
        type: 'number',
        width: 110,
        editable: false,
        valueGetter: (params: GridValueGetterParams) => params.row.sell - params.row.pay,
      },
      {
        field: 'address',
        headerName: 'လိပ်စာ',
        description: 'နေရပ်လိပ်စာ',
        sortable: false,
        width: 160,
        editable: true,
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
    url: `${API_URL}/customers`,
    data: {},
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };
  // console.log(o)

  React.useEffect(() => {
    props.setModal('customer စာရင်းရယူနေပါသည်! စောင့်ပီးပါ')
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
    if (freshCustomer) {
      if (rows.length > 0) {
        const index = rows.findIndex((item) => item.id === freshCustomer.id);
        if (index !== -1) {
          // update existing object
          const newData = [...rows];
          newData[index] = freshCustomer;
          setRows(newData);
        } else {
          // add new object
          setRows([freshCustomer, ...rows]);
        }
      } else {
        setRows([freshCustomer, ...rows]);
      }
    }
  }, [freshCustomer])
  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 110px)' }}>
      <CustomerAdd open={open} setOpen={setOpen} {...props} setFreshCustomer={setFreshCustomer} />
      <Button onClick={handleClickOpen}>Customer သစ်ထည့်ရန်</Button>
      <DataGrid
        sx={{borderRadius:0}}
        rows={rows}
        // editMode="row"
        columns={columns}
        onCellEditStop={params => setEditRow([...editRow, params.id])}
      // initialState={{
      //   pagination: {
      //     paginationModel: {
      //       pageSize: 50,
      //     },
      //   },
      // }}
      // pageSizeOptions={[5]}
      // checkboxSelection
      // disableRowSelectionOnClick
      />
    </Box>
  );
}
