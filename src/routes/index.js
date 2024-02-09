import { useRoutes } from "react-router";
import FlowRoutes from "./FlowRoutes";
import MainRoutes from "./MainRoutes";

export default function Routes(socket) {
    return useRoutes([MainRoutes(socket), FlowRoutes]);
}