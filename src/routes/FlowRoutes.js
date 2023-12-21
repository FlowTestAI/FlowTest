import { Outlet } from "react-router";
import Flow from "../flow";

const FlowRoutes = {
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

export default FlowRoutes;