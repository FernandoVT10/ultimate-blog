import { Router } from "express";

import tagRoutes from "./tags";

const router = Router();

/**
* @swagger
*
* tags:
*   - name: pet
*     description: pets
* 
* /api:
*   get:
*     tags:
*       - pet
*     description: Welcome to swagger-jsdoc!
*     responses:
*       200:
*         description: Returns a mysterious string.
*/
router.get("/", (_, res) => {
  res.send("holi");
});

router.use("/", tagRoutes);

export default router;
