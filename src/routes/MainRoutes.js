import { Outlet, useRoutes } from "react-router";
import HomeLayout from "../home";
import SavedFlows from "../home/SavedFlows";
import Collections from "../home/Collections";
import AuthKeys from "../home/AuthKeys";
import FlowTestAI from "../home/FlowTestAI";

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
        },
        {
            path: '/collection/:id',
            element: <Collections />
        },
        {
            path: '/authkeys',
            element: <AuthKeys />
        },
        {
            path: '/flowtest/ai',
            element: <FlowTestAI />
        }
    ] 
}

export default MainRoutes;