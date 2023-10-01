import { Outlet, useRoutes } from "react-router";
import Flow from "../flow";
import HomeLayout from "../home";

const MainRoutes = {
    path: '/',
    element: <HomeLayout/>,
    children: [
    ] 
}

export default MainRoutes;