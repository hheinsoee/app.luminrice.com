import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellEditStopParams, MuiEvent, GridCellEditStopReasons } from '@mui/x-data-grid';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { PurchaseAdd } from './component';
import { API_URL } from '../../../utils/constants';
import { getTokenFromLocalStorage } from '../../../auth/auth';
import axios from 'axios';
import UserAction from '../commons/userAction';
import DateTime from '../../../components';
import moment from 'moment';
import { useGenInfo } from '../../../hooks/genInfo';


export default function Sales(props) {

  props.setRouteName('ပစ္စည်း အရောင်း စာရင်း')
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [freshData, setFreshData] = React.useState(null);

  const [editRow, setEditRow] = React.useState([]);
  const columns = React.useMemo(
    () => [
      {
        field: 'save',
        headerName: '',
        type: 'action',
        width: 70,
        sortable:false,
        renderCell: params => <UserAction {...{ params, editRow, setEditRow, apiPath: 'sale' }} />
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
        field: 'items_id',
        headerName: 'အမျိုးအမည်',
        width: 160,
        sortable: false,
        editable: true,
        valueGetter: (params) => params.row.items_id,
        renderCell: (params) => {
          const foundItem = props.genInfo.items.find((item) => item.id === params.row.items_id);
          return <>
            <span style={{ backgroundColor: foundItem ? foundItem.color : null, height: '1rem', width: '1rem' }}>
            </span>&nbsp;{foundItem ? foundItem.name : null}
          </>
        },
        renderEditCell: (params) => (
          <Select fullWidth
            defaultValue={params.row.items_id}
            onChange={
              (e) => params.api.setEditCellValue(
                {
                  id: params.id,
                  field: params.field,
                  value: e.target.value
                }
              )}>
            {
              props.genInfo.items.map((it, i) => {
                return <MenuItem value={it.id} key={i}>
                  <span style={{ backgroundColor: it.color, height: '1rem', width: '1rem' }}>
                  </span>&nbsp;{it.name}
                </MenuItem>
              })
            }
          </Select>
        ),
      },
      {
        field: 'sizes_id',
        headerName: 'အရွယ်အစား',
        width: 100,
        type: 'number',
        sortable: false,
        editable: true,
        renderCell: (params) => {
          const siz = props.genInfo.sizes.find((s) => s.id === params.row.sizes_id);
          return `
          ${siz?siz.size:''}
          ${siz?siz.unit:''}
          `
        },
        renderEditCell: (params) => (
          <Select fullWidth
            defaultValue={params.row.sizes_id}
            onChange={
              (e) => params.api.setEditCellValue(
                {
                  id: params.id,
                  field: params.field,
                  value: e.target.value
                }
              )}>
            {
              props.genInfo.sizes.map((s, i) => {
                return <MenuItem value={s.id} key={i}>
                  {s.size} {s.unit}
                </MenuItem>
              })
            }
          </Select>
        ),
      },
      {
        field: 'sell_price',
        headerName: 'ရောင်းဈေး',
        width: 100,
        type: 'number',
        editable: true
      },
      {
        field: 'quentity',
        headerName: 'ခုရေ',
        width: 100,
        type: 'number',
        editable: true
      },
      {
        field: 'cost',
        headerName: 'သင့်ငွေ',
        width: 100,
        type: 'number',
        valueGetter: (params) => {
          return Math.round(params.row.sell_price * params.row.quentity)
        }
      },
      {
        field: 'customer_name',
        headerName: 'ဖောက်သည်',
        width: 150,
        sortable: false,
        editable: false
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
    url: `${API_URL}/sales`,
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
      <PurchaseAdd open={open} setOpen={setOpen} {...props} setFreshData={setFreshData} />
      <Button onClick={handleClickOpen}>အရောင်း စာရင်းသစ်ထည့်ရန်</Button>
      <DataGrid
        sx={{borderRadius:0}}
        rows={rows}
        // editMode="row"
        columns={columns}
        onCellEditStop={params => setEditRow([...editRow, params.id])}
      />
    </Box>
  );
}
