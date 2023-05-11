import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../utils/constants';
import { Group, Lock } from '@mui/icons-material';
import Customers from './customers';
import { Alert, Modal, Snackbar } from '@mui/material';

const drawerWidth = 240;

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

export default function OfficeLayout(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [modal, setModal] = React.useState(false);


    const alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(false);
    }
    React.useEffect(() => {
        if (alert == false) {
            alertClose();
        }
    }, [alert])
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const navigate = useNavigate();
    const signOut = () => {
        localStorage.removeItem('token');
        navigate(APP_ROUTES.SIGN_IN);
    }

    const drawer = (
        <div>
            <List>
                <ListItem>
                    <div>
                        <Typography variant='h5'>{props.user.name}</Typography>
                        <div>{props.user.role_name}</div>
                    </div>
                </ListItem>
            </List>
            <Divider />
            <List>
                {[
                    { label: 'customers', icon: <Group />, to: '/customers' },
                    { label: 'Starred', icon: <InboxIcon />, to: '/' },
                    { label: 'Send email', icon: <InboxIcon />, to: '/' },
                    { label: 'Drafts', icon: <InboxIcon />, to: '/' }
                ].map((r, index) => (
                    <ListItem key={r.label} disablePadding>
                        <ListItemButton component={Link} to={r.to}>
                            <ListItemIcon>
                                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                                {r.icon}
                            </ListItemIcon>
                            <ListItemText primary={r.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={signOut}>
                        <ListItemIcon>
                            <Lock />
                        </ListItemIcon>
                        <ListItemText primary="Sign out" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        Responsive drawer
                    </Typography>
                    <div>
                        <Typography variant='h6'>{props.user.name}</Typography>
                        <Typography variant='caption'>{props.user.role_name}</Typography>
                    </div>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Routes>
                    <Route path={`/`} element={<div>hello</div>} />
                    <Route path={`/customers`} element={<Customers alert={alert} setAlert={setAlert} modal={modal} setModal={setModal} />} />
                </Routes>
                <Snackbar open={alert !== false} autoHideDuration={6000} onClose={alertClose}>
                    <Alert onClose={alertClose} severity={alert.status ? alert.status : 'success'} sx={{ width: '100%' }}>
                        {alert.message}
                    </Alert>
                </Snackbar>
                <Modal
                    open={modal !== false}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#ffffff'
                    }}>
                        {modal}
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
}