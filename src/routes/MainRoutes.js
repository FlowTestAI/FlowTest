import { Outlet, useRoutes } from "react-router";
import HomeLayout from "../home";
import SavedFlows from "../home/SavedFlows";
import Collections from "../home/Collections";

const MainRoutes = {
    path: '/',
    element: <HomeLayout/>,
    children: [
        {
            path: '/flowtest',
            element: <SavedFlows />
        },
        {
            path: '/collection',
            element: <Collections />
        }
    ] 
}

export default MainRoutes;