import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import RouteBreadcrumbs from '../breadcrumbs/Breadcrumbs';
import LogoutIcon from '@mui/icons-material/Logout';
import {logoutUser} from '../../redux/slices/userSlice';


const drawerWidth = 240;

export default function Shell({children}) {
    const {isAuthenticated} = useSelector(
        (state) => state.user
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login', { replace: true });
    };

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar>
                    <RouteBreadcrumbs />
                </Toolbar>
            </AppBar>
            {isAuthenticated &&
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
                    }}
                >
                    <Toolbar/>
                    <Box sx={{overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%'}}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/employee">
                                    <ListItemIcon>
                                        <InboxIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Employee"/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <Box sx={{flexGrow: 1}}/>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Logout"/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
            }
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Toolbar/>
                {children}
            </Box>
        </Box>
    );
}