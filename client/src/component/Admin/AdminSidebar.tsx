import { FC, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { SidebarContainer } from "./AdminSidebar.css";

interface AdminSidebarProps {
    navigate: NavigateFunction;
}

export const AdminSidebar: FC<AdminSidebarProps> = ({ navigate }) => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const handleMouseEnter = () => {
        setSidebarVisible(true);
    };

    const handleMouseLeave = () => {
        setSidebarVisible(false);
    };

    const handleAdminUserMgmtClick = () => {
        navigate(`/admin/userMgmt`);
    };

    const handleAdminPostMgmtClick = () => {
        navigate(`/admin/postMgmt`);
    };

    const handleStatsClick = () => {
        navigate(`/admin/stats`);
    };

    return (
        <div
            className={SidebarContainer}
            style={{
                transform: isSidebarVisible ? "translateX(250px)" : "translateX(0)"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div onClick={handleAdminUserMgmtClick}>
                유저 관리
            </div>
            <div onClick={handleAdminPostMgmtClick}>
                게시글 관리
            </div>
            <div onClick={handleStatsClick}>
                통계
            </div>
        </div>
    );
};