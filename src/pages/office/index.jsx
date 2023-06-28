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

    const [items, setItems] = React.useState(null);
    const [customers, setCustomers] = React.useState(null);
    const [sizes, setSize] = React.useState(null);

    const [loading, err, genInfo] = useGet({ url: `${API_URL}/genInfo` });
    const [loadingCustomer, errCustomer, thecustomers] = useGet({ url: `${API_URL}/customers` });
    React.useEffect(() => {
        setCustomers(thecustomers)
    }, [thecustomers])
    React.useEffect(() => {
        if (genInfo) {
            setItems(genInfo.items)
            setSize(genInfo.sizes)
        }
    }, [genInfo])

    if (user && authenticated && items && customers && sizes) {
        return (
            <OfficeLayout
                user={user}
                {...props}

                items={items}
                setItems={setItems}

                sizes={sizes}

                customers={customers}
                setCustomers={setCustomers}
            />
        )
    } else {
        return <TheState state="loading" title="Checking Auth" />;
    }
}
