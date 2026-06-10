import { MapSchema, Schema, type } from "@colyseus/schema";

export class Vec3Schema extends Schema {
    @type("number") x: number = 0;
    @type("number") y: number = 0;
    @type("number") z: number = 0;
}

export class TimerSchema extends Schema {
    @type("number") durationSec: number = 25 * 60;
    @type("number") startedAt: number = 0;
    @type("number") pausedRemainingSec: number = -1;
}

export class PlayerSchema extends Schema {
    @type("string") sessionId: string = "";
    @type("string") name: string = "";
    @type(Vec3Schema) position: Vec3Schema = new Vec3Schema();
    @type("number") rotationY: number = 0;
    @type("string") countryCode: string = "";
    @type("number") ping: number = 0;
    @type(TimerSchema) timer: TimerSchema = new TimerSchema();
}

export class RoomStateSchema extends Schema {
    @type("string") name: string = "";
    @type("boolean") isPublic: boolean = true;
    @type("string") password: string = "";
    @type({ map: PlayerSchema }) players: MapSchema<PlayerSchema> = new MapSchema();
}