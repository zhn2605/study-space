import type { CreateRoomRequest, CreateRoomResponse, ListRoomsResponse } from "@study-space/shared";
import { Router, type Request, type Response } from "express";
import { registry } from "../rooms/registryInstance";
import { matchMaker } from "colyseus";

export const roomsRouter = Router();

roomsRouter.get("/", (_req: Request, res: Response<ListRoomsResponse>) => {
    res.json({ rooms: registry.listPublic() });
});

roomsRouter.post("/", async (req: Request, res: Response<CreateRoomResponse | { error: string }>) => {
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

        // precreate colyseus room
        const room = await matchMaker.createRoom("study_room", { roomId: id });
        registry.bindMatchMakerId(id, room.roomId);
        res.json({ id });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

roomsRouter.get("/:id/resolve", (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ error: "id required" });
        return;
    }
    const mmId = registry.getMatchMakerId(id);
    if (!mmId) {
        res.status(404).json({ error: "not found" });
        return;
    }

    res.json({ mmId });
})