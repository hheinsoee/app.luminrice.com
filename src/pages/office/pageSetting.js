import React from 'react';
import { API_URL } from '../../utils/constants';
import { AttachMoney, Category, Event, Group, Person, Sailing, Sell, } from '@mui/icons-material';
import DateTime from '../../components';
import { Chip, MenuItem, Select, TextField } from '@mui/material';
import moment from 'moment';
import { useGet } from '../../hooks/get';

export function pages(props) {
  return [

    {
      label: 'ဘောက်ချာစာရင်း',
      icon: <Sell />,
      to: '/vouchers',
      getApi: `${API_URL}/vouchers`,
      postApi: `${API_URL}/voucher`,
      theParams: [
        {
          field: 'id',
          headerName: 'အမှတ်',
          width: 100,
          type: 'number',
          form: false,
          renderCell: (params) => <Chip label={`#${params.row.id.toString().padStart(5, 0)}`}
          />
        },
        {
          field: 'create_time',
          headerName: 'စာရင်းသွင်းချိန်',
          type: 'datetime-local',
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
          field: 'customers_id',
          headerName: 'ဖောက်သည် အမည်',
          width: 160,
          sortable: false,
          renderCell: (params) => <><Person />&nbsp;{params.row.customer_name}</>
        },
        {
          field: 'users_id',
          headerName: 'စာရင်းသွင်းသူ',
          width: 150,
          sortable: false,
          renderCell: (params) => <><Person />&nbsp;{params.row.user_name}</>
        },
        {
          field: 'note',
          headerName: 'မှတ်ချက်',
          width: 150,
          sortable: false,
        }
      ]
    },
    {
      label: 'ငွေဝင်မှတ်တမ်း',
      icon: <AttachMoney />,
      to: '/payments',
      getApi: `${API_URL}/payments`,
      postApi: `${API_URL}/payment`,
      theParams: [
        {
          headerName: 'ID',
          field: 'id',
          type: 'number',
          width: 60,
          table: true, editable: false,
          form: false, required: false
        },
        {
          headerName: 'အချိန်',
          field: 'pay_date',
          type: 'datetime-local',
          table: true, editable: false,
          form: true, required: true,
          renderCell: (params) => <DateTime date={params.row.pay_date} />,
        },
        {
          headerName: 'အကြောင်းအရာ',
          field: 'payment_method',
          type: 'text',
          valueGetter: (params) => params.row.vouchers_id ? params.row.vouchers_id : params.row.payment_method,
          renderCell: (params) => params.row.vouchers_id ? <span>{params.row.vouchers_id}</span> : <span>{params.row.payment_method} (bank)</span>,
          table: true, editable: false,
          form: true, required: true
        },
        {
          headerName: 'ငွေ',
          field: 'amount',
          type: 'number',
          table: true, editable: false,
          form: true, required: true
        },
        {
          headerName: 'ဖောက်သည်',
          field: 'customers_id',
          type: 'number',
          table: true, editable: false,
          form: true, required: true,
          valueGetter: (params) => params.row.customers_name,
        },
        {
          headerName: 'မှတ်ချက်',
          field: 'note',
          type: 'text',
          table: true, editable: false,
          form: true, required: true
        },
      ]
    },
    {
      label: 'ဖောက်သည်',
      icon: <Group />,
      to: '/customers',
      getApi: `${API_URL}/customers`,
      postApi: `${API_URL}/customer`,
      theParams: [
        {
          headerName: 'ID',
          field: 'id',
          headerName: 'ID',
          width: 40,
          form: false
        },
        {
          headerName: 'အမည်',
          field: 'name',
          headerName: 'အမည်',
          width: 150,
          sortable: false,
          editable: true
        },
        {
          field: 'phone',
          headerName: 'ဖုန်းနံပါတ်',
          width: 150,
          sortable: false,
          editable: true
        },
        {
          field: 'buy_amount',
          headerName: 'ရောင်းပြီး',
          type: 'number',
          width: 110,
          editable: false,
          form: false
        },
        {
          field: 'pay_amount',
          headerName: 'ရပြီး',
          type: 'number',
          width: 110,
          editable: false,
          form: false
        },
        {
          field: 'different',
          headerName: 'ရရန်အကြွေး',
          description: '(ရောင်းပြီး) - (ရပြီး)',
          type: 'number',
          width: 110,
          editable: false,
          form: false,
          valueGetter: (params) => params.row.buy_amount - params.row.pay_amount,
        },
        {
          field: 'address',
          headerName: 'လိပ်စာ',
          description: 'နေရပ်လိပ်စာ',
          sortable: false,
          width: 160,
        }
      ]
    },
    {
      label: 'ကုန်ဝယ်စာရင်း',
      icon: <Event />,
      to: '/purchase',
      getApi: `${API_URL}/purchase`,
      postApi: `${API_URL}/purchase`,
      theParams: [
        {
          field: 'purchase_date',
          headerName: 'ရက်စွဲ',
          type: 'datetime-local',
          width: 120,
          sortable: true,
          editable: true,
          valueGetter: (params) => new Date(params.row.purchase_date),
          renderCell: (params) => <DateTime date={params.row.purchase_date} />,
          renderEditCell: (params) => (
            <TextField
              type="datetime-local"
              value={moment(params.row.purchase_date).format('yyyy-MM-DD[T]hh:mm')}
              onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
            />
          ),
        },
        {
          field: 'items_id',
          headerName: 'အမျိုးအမည်',
          width: 160,
          type: 'text',
          sortable: false,
          editable: true,
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
          )
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
                      ${siz ? siz.size : ''}
                      ${siz ? siz.unit : ''}
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
          field: 'price',
          headerName: 'နှုန်း',
          width: 100,
          type: 'number',
          form: false,
          valueGetter: (params) => {
            return Math.round(params.row.cost / params.row.quantity)
          }
        },
        {
          field: 'quantity',
          headerName: 'ခုရေ',
          width: 100,
          type: 'number',
          editable: true
        },
        {
          field: 'cost',
          headerName: 'ပေါင်း ကုန်ကျငွေ',
          width: 100,
          type: 'number',
          editable: true
        },
        {
          field: 'note',
          headerName: 'မှတ်ချက်',
          width: 150,
          sortable: false,
          editable: true
        }
      ]
    },
    {
      label: 'ကုန်ပစ္စည်း',
      icon: <Category />,
      to: '/items',
      getApi: `${API_URL}/items`,
      postApi: `${API_URL}/item`,
      theParams: [
        { field: 'id', headerName: 'ID', width: 30, form: false },
        {
          field: 'color',
          headerName: 'အရောင်',
          width: 50,
          type: 'color',
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
                )} />
          ),
        },
        {
          field: 'name',
          headerName: 'ဆန် အမျိုးအမည်',
          width: 150,
          editable: true,
          sortable: false
        },
        // sizes Cols is controled by master/index.js
        { field: 'sizes_cols_of_items', form: false },
        {
          field: 'description',
          headerName: 'description',
          width: 150,
          editable: true,
          sortable: false,
        }
      ]
    }
  ];
}