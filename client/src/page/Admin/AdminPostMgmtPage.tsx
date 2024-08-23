import { useNavigate } from "../../../../node_modules/react-router-dom/dist/index";
import { AdminSidebar } from "../../component/Admin/AdminSidebar";
import PostMgmt from "../../component/Admin/PostMgmt/PostMgmt";
import { Container } from "./AdminUserMgmtPage.css";

export const AdminPostMgmtPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className={Container}>
                <AdminSidebar navigate={navigate} />
            </div>
            <PostMgmt />
        </div>
    )
}