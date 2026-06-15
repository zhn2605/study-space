import type { CreateRoomRequest, CreateRoomResponse, ListRoomsResponse } from "@study-space/shared";
import { Router, type Request, type Response } from "express";
import { registry } from "../rooms/registryInstance";

export const roomsRouter = Router();

roomsRouter.get("/", (_req: Request, res: Response<ListRoomsResponse>) => {
    res.json({ rooms: registry.listPublic() });
});

roomsRouter.post("/", (req: Request, res: Response<CreateRoomResponse | { error: string }>) => {
    const body = req.body as Partial<CreateRoomRequest>;
    if (typeof body.name !== "string" || typeof body.isPublic !== "boolean") {
        res.status(400).json({ error: "bad body"});
        return;
    }
    try {
        const { id } = registry.create({
            name: body.name,
            isPublic: body.isPublic,
            passcode: body.passcode,
        });
        res.json({ id });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});