export type RoomSummary = {
    id: string;
    name: string;
    playerCount: number;
};

export type ListRoomsResponse = { rooms: RoomSummary[] };

export type CreateRoomRequest = {
    name: string;
    isPublic: boolean;
    passcode?: string;
};

export type CreateRoomResponse = { id: string };