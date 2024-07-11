import { Request, Response, NextFunction } from 'express';

export const doTest = (req : Request, res : Response, next : NextFunction) => {
    res.status(200).json({msg : "서버 연결 테스트 성공"});
};

export const doTest2 = (req : Request, res : Response, next : NextFunction) => {
    const {user_id , title} = req.body;
    const msg = `${user_id}님의 게시글은 "${title}" 입니다.`;
    res.status(200).json({msg});
};