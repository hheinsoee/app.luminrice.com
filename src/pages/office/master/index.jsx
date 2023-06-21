import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellEditStopParams, MuiEvent, GridCellEditStopReasons, GridToolbar } from '@mui/x-data-grid';
import { Button, Typography } from '@mui/material';
import { AddForm } from './component';
import UserAction from '../commons/userAction';
import { useGet } from '../../../hooks/get';
import DateTime from '../../../components';
import { nFormat } from '../../../helpers/function';
import { VoucherAdd, VoucherDetail } from '../vouchers/component';



export default function MasterTable(props) {
  props.setRouteName(props.label)
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [freshData, setFreshData] = React.useState(null);
  const [colsSetting, setColsSetting] = React.useState([])

  const [editRow, setEditRow] = React.useState({});
  const [loading, err, data] = useGet({ url: `${props.getApi}` });
  React.useEffect(() => {
    if (loading) {
      props.setModal(`${props.label} စာရင်းရယူနေပါသည်! စောင့်ပီးပါ`)
    } else {
      props.setModal(false);
      setRows(data)
    }
  }, [loading, data])
  const handleClickOpen = () => {
    setOpen(true);
  };
  const columns = React.useMemo(
    () => {
      var cols = [];
      var x = {};
      if (!props.to.includes('/vouchers', '/payments')) {
        cols.push({
          field: 'save',
          headerName: '',
          type: 'save',
          width: 70,
          sortable: false,
          renderCell: params => <UserAction {...{ params, editRow, setEditRow, postUrl: props.postApi }} />
        })
      }
      props.theParams.map((p) => {

        x[p.name] = p.table; //col setting hide or sho
        if (p.field == 'sizes_cols_of_items') { //loop and push
          props.genInfo.sizes.map((s) => {
            return cols.push({
              field: `${s.size}${s.unit}`,
              headerName: `${s.size} ${s.unit}`,
              width: 100,
              type: 'number',
              editable: false,
              sortable: true,
              valueGetter: (params) => {
                var theStock = params.row.stocks && params.row.stocks.find(stock => stock.sizes_id == s.id);
                return theStock
                  ? theStock.purchase_count - theStock.sales_count
                  : 0
              },
              renderCell: (params) => {
                var theStock = params.row.stocks && params.row.stocks.find(stock => stock.sizes_id == s.id);
                return theStock
                  ? <div style={{ lineHeight: '9pt', textAlign: 'right' }}>
                    {nFormat(theStock.purchase_count - theStock.sales_count)}<br />
                    <small style={{ opacity: 0.4 }}>{nFormat(theStock.purchase_count)}</small>
                  </div>
                  : 0
              }
            })
          })
        } else {
          return cols.push(p);
        }
      })
      setColsSetting(x)
      return [
        ...cols,
      ]
    },
    [editRow, rows, props]
  );


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
    setEditRow([])
  }, [freshData, props])
  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 110px)' }}>
      {props.to == '/vouchers'
        ? <React.Fragment>
          {/* <VoucherDetail open={openVoucher} setOpen={setOpenVoucher} {...props}/> */}
          <VoucherAdd open={open} setOpen={setOpen} {...props} setFreshData={setFreshData} />
        </React.Fragment>
        : <AddForm open={open} setOpen={setOpen} {...props} setFreshData={setFreshData} />
      }

      <Button onClick={handleClickOpen}>{props.label} သစ်</Button>
      {
        !loading &&
        <DataGrid
          sx={{ borderRadius: 0 }}
          rows={rows}
          columns={columns}
          onCellEditStop={params => setEditRow([...editRow, params.id])}
          rowSelection={false}
          initialState={{
            columns: {
              columnVisibilityModel: colsSetting,
            },
          }}
          slots={{
            toolbar: GridToolbar,
          }}
        />
      }
    </Box>
  );
}