import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

interface Episode {
    id: string;
    title: string;
    members: string;
    publishedAt: string;
    thumbnail: string;
    duration: number;
    durationAsString: string;
    url: string;
    description: string;
}

interface EpisodeProps {
    episode: Episode;
}

export default function Episode({episode}: EpisodeProps) {
   
    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Go Back"/>
                    </button>
                </Link>

                <Image
                   width={700}
                   height={160}
                   src={episode.thumbnail}
                   objectFit="cover"
                />
                <button type="button">
                    <img src="/play.svg" alt="Play episode"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div 
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
            {/*para poder injetar tags HTML dentro da div */}


        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    //cachear somente os mais acessados (2 episódios);
    //Incremental Static Regeneration (ISR)
    const { data } = await api.get('episodes', {
        params: {
          _limit: 2,
          _sort: 'published_at',
          _order: 'desc',
        }
    });
    
    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }        
    })

    return {
        paths,
        fallback: 'blocking',
        //fallback: false - retorna 404 se a página não estiver nos paths
        //fallback: true - carrega a página pelo cliente
        //fallback: blocking - carrega a página pelo servidor
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params; //não pode usar hooks, tipo useRouter, dentro deste método;
    //usa-se o contexto para pegar o nome do slug.

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
      id: data.id,
      title: data.title,
      members: data.members,
      publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
      thumbnail: data.thumbnail,
      description: data.description,
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration)),
      url: data.file.url,
    }
    
    return {
        props: {
            episode
        },
        revalidate: 60*60*24 // 24 horas
    }
}