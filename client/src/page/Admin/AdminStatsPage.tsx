import { useNavigate } from "../../../../node_modules/react-router-dom/dist/index";
import { AdminSidebar } from "../../component/Admin/AdminSidebar";
import { Container } from "./AdminUserMgmtPage.css";

export const AdminStatsPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className={Container}>
                <AdminSidebar navigate={navigate} />
            </div>
            <div>통계 페이지</div>
        </div>
    )
}