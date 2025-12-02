import express from "express";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors())

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({ errors: data.error });
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: data.data.username,
        name: data.data.name,
        password: data.data.password,
      },
    });
    res.status(201).json({ userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signin", async (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({ errors: data.error });
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: data.data.username,
        password: data.data.password,
      },
    });
    if(!user){
      res.status(403).json({ error: "Not authorized" });
      return;
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/room",authMiddleware, async (req,res)=>{
  console.log(req.body);
  const data = CreateRoomSchema.safeParse(req.body);
  if(!data.success){
    return res.status(400).json({errors: data.error});
  }

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: data.data.name,
        adminId: req.userId as string,
      },
    });
    res.status(201).json({ roomId: room.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
})

app.get("/shapes/:roomId",authMiddleware, async (req,res)=>{
  try {
    const roomId = Number(req.params.roomId);
    const shapes = await prismaClient.shape.findMany({
      where: {
        roomId: roomId,
      },
      orderBy:{
        id: "desc",
      },
      take:100,
    })
    res.status(200).json({ shapes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error",shapes: [] });
  }
})

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
      where: {
          slug
      }
  });

  res.json({
      room
  })
})

app.listen(PORT);
