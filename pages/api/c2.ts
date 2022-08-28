// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { c2 } from "../../data";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    res.status(200).json({ c2 });
  } else {
    res.status(501).json({ error: "Unsupported method!" });
  }
}
