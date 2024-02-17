import { useRoutes } from "react-router";
import FlowRoutes from "./FlowRoutes";
import MainRoutes from "./MainRoutes";

export default function Routes() {
    return useRoutes([MainRoutes, FlowRoutes]);
}