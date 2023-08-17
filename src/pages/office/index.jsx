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

    if (user && authenticated) {
        return (
            <OfficePage user={user} {...props}/>
        )
    } else {
        return <TheState state="loading" title="Checking Auth" />;
    }
}

function OfficePage(props) {
    const [items, setItems] = React.useState([]);
    const [customers, setCustomers] = React.useState([]);
    const [sizes, setSize] = React.useState([]);

    const [loading, err, genInfo] = useGet({ url: `${API_URL}/genInfo` });
    const [loadingCustomer, errCustomer, thecustomers] = useGet({ url: `${API_URL}/customers` });
    React.useEffect(() => {
        thecustomers && setCustomers(thecustomers)
    }, [thecustomers])
    React.useEffect(() => {
        if (genInfo) {
            genInfo.items && setItems(genInfo.items)
            genInfo.sizes && setSize(genInfo.sizes)
        }
    }, [genInfo])

    return (
        <>
            {
                loadingCustomer && loading
                    ? "loading"
                    :
                    <OfficeLayout
                        user={props.user}
                        {...props}

                        items={items}
                        setItems={setItems}

                        sizes={sizes}

                        customers={customers}
                        setCustomers={setCustomers}
                    />

            }
        </>
    )
}
