
// ContextAPI là API cs sẵn của React
'use client';

import { createContext, useContext, useState } from "react";

const TrackContext = createContext<ITrackContext | null>(null) // createContext: Tạo phạm vi/không gian để chia sẻ data

export const TrackContextProvider = ({ children }: { children: React.ReactNode }) => {

    const initValue = {
        "_id": '',
        "title": '',
        "description": '',
        "category": '',
        "imgUrl": '',
        "trackUrl": '',
        "countLike": 0,
        "countPlay": 0,
        "uploader": {
            "_id": '',
            "email": '',
            "name": '',
            "role": '',
            "type": '',
        },
        "isDeleted": false,
        "createdAt": '',
        "updatedAt": '',
        isPlaying: false
    }

    const [currentTrack, setCurrentTrack] = useState<IShareTrack>(initValue);

    return (
        <TrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
            {/* children sẽ được chia sẻ data của các 'value' */}
            {children}
        </TrackContext.Provider>
    )
};

export const useTrackContext = () => useContext(TrackContext); // useContext: sử dụng Context nào thì truyền tên Context đấy vào () -> (vì 1 app cs thể cs nhiều Context)