import * as React from 'react';
import { useUser } from '../../auth/user';
import TheState from '../../components/state';
import { Button } from '@mui/material';
import { API_URL, APP_ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import OfficeLayout from './layout';
import { useGet } from '../../hooks/get';

// function OfficeLayout(user) {

//     const navigate = useNavigate();
//     const signOut = () => {
//         localStorage.removeItem('token');
//         navigate(APP_ROUTES.SIGN_IN);
//     }
//     return (
//         <Grid container spacing={2}>
//             <Grid item xs={6} md={8}>
//                 <Item>xs=6 md=8</Item>
//             </Grid>
//             <Grid item xs={6} md={4}>
//                 <h1>{user.name}</h1>
//                 <Button onClick={signOut}>Sign out</Button>
//             </Grid>
//         </Grid>
//     );
// }
export default function Office(props) {
    const { user, authenticated } = useUser();
    const [loading, err, genInfo] = useGet({ url: `${API_URL}/genInfo` });
    
    
    if (!user || !authenticated || loading) {
        return <TheState state="loading" title="Checking Auth" />;
    } else {
        return (
            <OfficeLayout user={user} genInfo={genInfo} {...props}/>
        )
    }
}
