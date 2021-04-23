import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Image from 'next/image';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';


export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    //ref substitui o document.getElementById
    
    const [progress, setProgress] = useState(0);
    //progresso não precisa estar no contexto porque somente o Player usa no slider;

    const { 
        episodeList, 
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
    } = usePlayer();

    useEffect(() => {
        if(!audioRef.current) {
            return;
        }
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Playing now</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            )
            : (
                <div className={styles.emptyPlayer}>
                    <strong>Select a podcast to hear</strong>
                </div>
            )}
            <footer className={!episode ? styles.empty : ""}>
                <div className={styles.progress}>
                <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                                trackStyle={{ backgroundColor: '#04D361' }}
                                railStyle={{ backgroundColor: '#9F75FF' }}
                                handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>                    
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        loop={isLooping}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button 
                        type='button'
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Shuffle"/>
                    </button>
                    <button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Play Previous"/>
                    </button>
                    <button 
                        type='button'
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        { isPlaying ? (
                            <img src="/pause.svg" alt="Pause"/>
                        ) : (
                            <img src="/play.svg" alt="Play"/>
                        )}
                    </button>
                    <button type='button' onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Play Next"/>
                    </button>
                    <button
                        type='button'
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repeat"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}