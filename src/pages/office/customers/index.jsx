import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellEditStopParams, MuiEvent, GridCellEditStopReasons } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { CustomerAdd } from './component';
import { API_URL } from '../../../utils/constants';
import { getTokenFromLocalStorage } from '../../../auth/auth';
import axios from 'axios';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
    sortable: false,
  },
  {
    field: 'phone',
    headerName: 'Phone',
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
    type: 'number',
    width: 110,
    editable: false,
    valueGetter: (params: GridValueGetterParams) => params.row.sell - params.row.pay,
  },
  {
    field: 'address',
    headerName: 'Address',
    description: 'နေရပ်လိပ်စာ',
    sortable: false,
    width: 160,
    editable: true,
  },
];

// const rows = [
//   { id: 1, name: 'Snow', phone: '006745635', sell: 35000, pay: 47 },
//   { id: 2, name: 'Lannister', phone: '006745635', sell: 42000, pay: 4700 },
//   { id: 3, name: 'Lannister', phone: '006745635', sell: 45000, pay: 4700 },
//   { id: 4, name: 'Stark', phone: '006745635', sell: 16000, pay: 4700 },
//   { id: 5, name: 'Targaryen', phone: '006745635', sell: 44000, pay: 4700 },
//   { id: 6, name: 'Melisandre', phone: '006745635', sell: 150000, pay: 4700 },
//   { id: 7, name: 'Clifford', phone: '006745635', sell: 44000, pay: 4700 },
//   { id: 8, name: 'Frances', phone: '006745635', sell: 36000, pay: 4700 },
//   { id: 9, name: 'Roxie', phone: '006745635', sell: 65000, pay: 4700 },
// ];

export default function Customers(props) {

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [freshCustomer, setFreshCustomer] = React.useState(null);

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
    }
  }, [freshCustomer])
  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 200px)' }}>
      <CustomerAdd open={open} setOpen={setOpen} {...props} setFreshCustomer={setFreshCustomer} />
      <Button onClick={handleClickOpen}>New Customer</Button>
      <DataGrid
        rows={rows}
        // editMode="row"
        columns={columns}
        onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
          // if (params.reason == GridCellEditStopReasons.enterKeyDown) {
            // event.defaultMuiPrevented = true;
            console.log(params.field, params.value)
          // }
        }}
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
