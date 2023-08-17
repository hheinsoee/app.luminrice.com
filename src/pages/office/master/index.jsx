import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridToolbar, GridColumnVisibilityModel } from '@mui/x-data-grid';
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
  const [columnVisible, setColumnVisible] = React.useState({});

  const [editRow, setEditRow] = React.useState([]);
  const [loading, err, data] = useGet({ url: `${props.getApi}` });
  React.useEffect(() => {
    if (loading) {
      props.setModal(`${props.label} စာရင်းရယူနေပါသည်! စောင့်ပီးပါ`)
    } else {
      props.setModal(false);
      setRows(data)
      setFreshData(null)
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
          renderCell: params => <UserAction  {...{props, params, editRow, setEditRow, postUrl: props.postApi }} />
        })
      }
      // rows[0] ကို loop ပြီး  = rows[0].[key] == theParams.field မှာ ပါမပါစစ် ပြီး မပါကေ Default

      props.theParams.map((p) => {
        if (p.hide) { x[p.field] = !p.hide }; //col setting hide or sho
        if (p.field == 'sizes_cols_of_items') { //loop and push
          props.sizes.map((s) => {
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
          cols.push(p)
        }
      })
      if (rows.length > 0) {
        Object.keys(rows[0]).map((k) => {
          var setting = props.theParams.find(x => x.field === k);
          if (!setting) {
            cols.push({
              field: k,
              headerName: k,
              width: 150,
              editable: false
            })
            x[k] = false;
          }
        })
      }
      setColumnVisible(x)
      return cols;
    },
    [editRow, rows, props]
  );


  // update or add 
  React.useEffect(() => {
    if (freshData) {
      var UpdatedRows = null
      if (rows.length > 0) {
        const index = rows.findIndex((item) => item.id === freshData.id);
        if (index !== -1) {
          // update existing object
          const newData = [...rows];
          newData[index] = freshData;
          UpdatedRows = newData;
        } else {
          UpdatedRows = [freshData, ...rows];
        }
      } else {
        UpdatedRows = [freshData, ...rows];
      }
      setRows(UpdatedRows);
      if (props.to == '/customers') {//if customer
        props.setCustomers(UpdatedRows)
      }
      if (props.to == '/items') {
        props.setItems(UpdatedRows)
        console.log('items updated')
      }
      setFreshData(null);
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
        !loading && rows && columns &&
        <DataGrid
          sx={{ borderRadius: 0 }}
          rows={rows}
          columns={columns}
          onCellEditStop={params => setEditRow([...editRow, params.id])}
          rowSelection={false}
          columnVisibilityModel={columnVisible}
          onColumnVisibilityModelChange={(params, event, details) => {
            setColumnVisible(params)
          }}
          slots={{
            toolbar: GridToolbar,
          }}
        />
      }
    </Box>
  );
}