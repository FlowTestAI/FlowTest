import { Outlet, useRoutes } from "react-router";
import Flow from "../flow";

const Routes = {
    path: '/',
    element: <Outlet/>,
    children: [
        {
            path: '/flow',
            element: <Flow />
        },
        {
            path: '/flow/:id',
            element: <Flow />
        }
    ] 
}

export default function FlowRoutes() {
    return useRoutes([Routes]);
}