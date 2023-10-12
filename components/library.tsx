"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { useUser } from "@/hooks/useuser";
import useAuthModal from "@/hooks/useauthmodal";
import useUploadModal from "@/hooks/useuploadmodal";
import { Song } from "@/types";
import MediaItem from "./mediaitem";
import useOnPlay from "@/hooks/useonplay";
import useSubscribeModal from "@/hooks/usesubscribemodal";

interface LibraryProps {
    songs: Song[];
  }

const Library: React.FC<LibraryProps> = ({
    songs
}) => {

    const { user, subscription } = useUser();
    const authModal = useAuthModal();
    const uploadModal = useUploadModal();
    const subscribeModal = useSubscribeModal();
    const onPlay = useOnPlay(songs);

    const onClick = () => {
        if (!user) {
          return authModal.onOpen();
        }
        if (!subscription) {
            subscribeModal.onOpen();
        }
        return uploadModal.onOpen();
    }    

    return ( 
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="inline-flex items-center gap-x-2">
                    <TbPlaylist className="text-neutral-400" size={26}/>
                    <p className="text-neutral-400 font-medium text-md">
                        Your Library
                    </p>
                </div>
                <AiOutlinePlus className="text-neutral-400 cursor-pointer hover:text-white transition" onClick={onClick} size={20}/>
            </div>
            <div className="flex flex-col gap-y-2 mt-4 px-3">
            {songs.map((item) => (
                <MediaItem 
                onClick={(id: string) => onPlay(id)} 
                key={item.id} 
                data={item}
              />
            ))}
            </div>
        </div>
     );
}
 
export default Library;