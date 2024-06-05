import { Request, Response } from 'express'

type ControllerFunction = (
    req: Request,
    res: Response
  ) => Promise<Response<Record<string, unknown>> | undefined>; 

export const errorHandler = (func:ControllerFunction) => {
    return async (req:Request,res:Response) => {
        try{
            return await func(req,res)
        }catch(err){
            console.log(err)
            return res.status(500).json({status:'error', message:'Internal Server Error'})
        }
    }
}