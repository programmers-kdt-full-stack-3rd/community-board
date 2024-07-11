import { Request, Response, NextFunction } from 'express';

export const doTest = (req : Request, res : Response, next : NextFunction) => {
    res.status(200).json({msg : "서버 연결 테스트 성공"});
}