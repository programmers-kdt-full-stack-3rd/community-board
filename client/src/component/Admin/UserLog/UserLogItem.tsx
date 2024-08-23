import React from 'react';
import { IUserLog } from 'shared';
import { LogListDetail } from './UserLog.css';
import { dateToStr } from '../../../utils/date-to-str';

interface Props {
    log: IUserLog;
}

const AdminUserLogItem: React.FC<Props> = ({ log }) => {
    return (
        <div className={LogListDetail}>
            <div>{log.title}</div>
            <div>{log.category}</div>
            <div>{dateToStr(new Date(log.createdAt), true)}</div>
        </div>
    );
};

export default AdminUserLogItem;
