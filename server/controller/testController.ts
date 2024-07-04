import { Request, Response, NextFunction } from 'express';

export const doTest = (req : Request, res : Response, next : NextFunction) => {
    res.send("서버 연결 테스트");
}