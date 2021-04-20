// SPA: useEffect (não indexa)
// SSR: getServerSideProps (executa toda vez que a página é acessada)
// SSG: getStaticProps (só funciona em produção)

import { useEffect } from "react";

export default function Home(props) {

  console.log(props.episodes);
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data));
  // }, []);

  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60*60*8 //tempo em segundos para que uma nova requisição seja feita.
  }
}

