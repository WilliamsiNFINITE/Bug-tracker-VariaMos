import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { InviteCode } from '../entity/InviteCode';

export const verifyInvitation = async (req: Request, res: Response) => {
    const inviteCode = req.body.code;

    const codes = await InviteCode.createQueryBuilder('code')
    .getMany();

    // array with codesHashes from database
    const codesHashArray = codes.map((c) => c.codeHash)

    for (let codeHash of codesHashArray) {

      const inviteCodeValid = await bcrypt.compare(inviteCode, codeHash);

      if (inviteCodeValid) {
        // remove code from database
        const codeToRemove = await InviteCode.findOne({ 
          where: { codeHash: codeHash}
        });
        codeToRemove?.remove();
        res.status(204).end();
      }
    }
    return res.status(400).end();

    }
