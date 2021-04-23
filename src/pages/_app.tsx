import "../styles/global.scss";

import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerContextProvider } from "../contexts/PlayerContext";
 

import styles from "../styles/app.module.scss";

//componentes Player e Header estão em todas as páginas,
//logo podem estar aqui em _app.tsx

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <PlayerContextProvider>
        <main>
          <Header /> 
          <Component {...pageProps} />
        </main>   
        <Player /> 
      </PlayerContextProvider>
    
    </div>
  )
}

export default MyApp
