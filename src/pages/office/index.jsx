import * as React from 'react';
import { useUser } from '../../auth/user';
import TheState from '../../components/state';
import { Button } from '@mui/material';
import { API_URL, APP_ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import OfficeLayout from './layout';
import { useGet } from '../../hooks/get';

export default function Office(props) {
    const { user, authenticated } = useUser();
    const [loading, err, genInfo] = useGet({ url: `${API_URL}/genInfo` });

    const [items, setItems] =React.useState(null);
    const [customers, setCustomer] =React.useState(null);

    const [loadingCustomer, errCustomer, thecustomers] = useGet({ url: `${API_URL}/customers` });
    React.useEffect(()=>{
        setCustomer(thecustomers)
    },[thecustomers])

    if (!user || !authenticated || loading || loadingCustomer) {
        return <TheState state="loading" title="Checking Auth" />;
    } else {
        return (
            <OfficeLayout 
            user={user} 
            genInfo={genInfo} 
            {...props} 
            customers={customers}
             />
        )
    }
}
