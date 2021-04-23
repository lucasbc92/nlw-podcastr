import "../styles/global.scss";

import { Header } from "../components/Header";
import { Player } from "../components/Player";

import styles from "../styles/app.module.scss";
import { PlayerContext } from "../contexts/PlayerContext";
import { useState } from "react";


//componentes Player e Header estão em todas as páginas,
//logo podem estar aqui em _app.tsx

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  return (
    <div className={styles.wrapper}>
      <PlayerContext.Provider value={{episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState}}>
        <main>
          <Header /> 
          <Component {...pageProps} />
        </main>   
        <Player />
      </PlayerContext.Provider>      
    </div>
  )
}

export default MyApp
