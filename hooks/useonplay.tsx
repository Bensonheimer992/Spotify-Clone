import { Song } from "@/types";

import usePlayer from "./useplayer";
import useAuthModal from "./useauthmodal";
import { useUser } from "./useuser";
import useSubscribeModal from "./usesubscribemodal";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const { subscription, user } = useUser();
  const subscribe = useSubscribeModal();

  const onPlay = (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  }

  return onPlay;
};

export default useOnPlay;