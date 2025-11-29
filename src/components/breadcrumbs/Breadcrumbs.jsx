import {Breadcrumbs, Link, Typography} from '@mui/material';
import {Link as RouterLink, useLocation} from 'react-router-dom';

export default function RouteBreadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Map paths to readable labels
    const breadcrumbLabels = {
        '': 'Home',
    };

    const getBreadcrumbLabel = (path) => {
        return breadcrumbLabels[path] || path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <RouterLink to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                <Link underline="hover" color="inherit">
                    Home
                </Link>
            </RouterLink>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                return isLast ? (
                    <Typography key={routeTo}>
                        {getBreadcrumbLabel(name)}
                    </Typography>
                ) : (
                    <RouterLink
                        key={routeTo}
                        to={routeTo}
                        style={{textDecoration: 'none', color: 'inherit'}}
                    >
                        <Link underline="hover" color="inherit">
                            {getBreadcrumbLabel(name)}
                        </Link>
                    </RouterLink>
                );
            })}
        </Breadcrumbs>
    );
}