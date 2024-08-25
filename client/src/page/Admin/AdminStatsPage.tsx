import { useNavigate } from "../../../../node_modules/react-router-dom/dist/index";
import { AdminSidebar } from "../../component/Admin/AdminSidebar";
import { AdminGraph } from "../../component/Admin/Stats/AdminGraph";
import { Container } from "./AdminUserMgmtPage.css";

export const AdminStatsPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className={Container}>
                <AdminSidebar navigate={navigate} />
            </div>
            <AdminGraph />
        </div>
    )
}