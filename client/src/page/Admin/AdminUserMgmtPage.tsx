import { useNavigate } from "../../../../node_modules/react-router-dom/dist/index";
import { AdminSidebar } from "../../component/Admin/AdminSidebar";
import UserList from "../../component/Admin/UserMgmt/UserList";
import { Container } from "./AdminUserMgmtPage.css";

export const AdminUserMgmtPage = () => {
    const navigate = useNavigate();

    return (
        <div >
            <div className={Container}>
                <AdminSidebar navigate={navigate} />
            </div>

            <h3>사용자 관리 페이지</h3>
            <UserList />
        </div>
    )
}