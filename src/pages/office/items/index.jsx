import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellEditStopParams, MuiEvent, GridCellEditStopReasons } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { ItemAdd } from './component';
import { API_URL } from '../../../utils/constants';
import { getTokenFromLocalStorage } from '../../../auth/auth';
import axios from 'axios';
import UserAction from '../commons/userAction';



export default function Items(props) {

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [freshData, setFreshData] = React.useState(null);

  const [editRow, setEditRow] = React.useState([]);
  props.setRouteName('ဆန်အမျိုးအမည်များ')
  const columns = React.useMemo(
    () => [

      {
        field: 'action',
        headerName: '',
        width: 70,
        type: 'action',
        sortable: false,
        renderCell: params => <UserAction {...{ params, editRow, setEditRow, apiPath: 'item' }} />
      },
      { field: 'id', headerName: 'ID', width: 30 },
      {
        field: 'color',
        headerName: 'အရောင်',
        width: 50,
        editable: true,
        sortable: false,
        renderCell: (params) => {
          return <span style={{ backgroundColor: params.row.color, height: '1rem', width: '1rem' }}></span>
        },
        renderEditCell: (params) => (
          <input type='color' fullWidth
            defaultValue={params.row.color}
            onChange={
              (e) => params.api.setEditCellValue(
                {
                  id: params.id,
                  field: params.field,
                  value: e.target.value
                }
              )}/>
        ),
      },{
        field: 'name',
        headerName: 'ဆန်',
        width: 150,
        editable: true,
        sortable: false
      },
      {
        field: '48Kg',
        headerName: '48Kg',
        width: 100,
        type: 'number',
        editable: false,
        sortable: true,
        valueGetter: (params) => {
          return params.row.sizes.find(s => s.size == 48)
            ? params.row.sizes.find(s => s.size == 48).quantity
            : 0
        }
      },
      {
        field: '24Kg',
        headerName: '24Kg',
        width: 100,
        type: 'number',
        editable: false,
        sortable: true,
        valueGetter: (params) => {
          return params.row.sizes.find(s => s.size == 24)
            ? params.row.sizes.find(s => s.size == 24).quantity
            : 0
        }
      },
      {
        field: '12Kg',
        headerName: '12Kg',
        width: 100,
        type: 'number',
        editable: false,
        sortable: true,
        valueGetter: (params) => {
          return params.row.sizes.find(s => s.size == 12)
            ? params.row.sizes.find(s => s.size == 12).quantity
            : 0
        }
      },
      {
        field: '6Kg',
        headerName: '6Kg',
        width: 100,
        type: 'number',
        editable: false,
        sortable: true,
        valueGetter: (params) => {
          return params.row.sizes.find(s => s.size == 6)
            ? params.row.sizes.find(s => s.size == 6).quantity
            : 0
        }
      },
      {
        field: '3Kg',
        headerName: '3Kg',
        width: 100,
        type: 'number',
        editable: false,
        sortable: true,
        valueGetter: (params) => {
          return params.row.sizes.find(s => s.size == 3)
            ? params.row.sizes.find(s => s.size == 3).quantity
            : 0
        }
      },
      {
        field: 'description',
        headerName: 'description',
        width: 150,
        editable: true,
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
    url: `${API_URL}/items`,
    data: {},
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };
  // console.log(o)

  React.useEffect(() => {
    props.setModal('ဆန် စာရင်းရယူနေပါသည်! စောင့်ပီးပါ')
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
      }else{
        setRows([freshData, ...rows]);
      }
    }
  }, [freshData])
  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 110px)' }}>
      <ItemAdd open={open} setOpen={setOpen} {...props} setFreshData={setFreshData} />
      <Button onClick={handleClickOpen}>Item သစ်ထည့်ရန်</Button>
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
