import { Outlet, useRoutes } from "react-router";
import HomeLayout from "../home";
import SavedFlows from "../home/SavedFlows";

const MainRoutes = {
    path: '/',
    element: <HomeLayout/>,
    children: [
        {
            path: '/flowtest',
            element: <SavedFlows />
        }
    ] 
}

export default MainRoutes;