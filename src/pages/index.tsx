import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'

import styles from '../styles/Home.module.css'
interface HomePageProps {
  csrfToken?: string
  uaString?: string
}

const Home: NextPage<HomePageProps> = ({ uaString }) => {
  const { data, status } = useSession()

  return (
    <div className={styles.container}>
      HOME: {status}
      <p>
        <code>{JSON.stringify(data)}</code>
      </p>
      <p>{uaString}</p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({ req }) => {
  return {
    props: {
      uaString: req.headers['user-agent']
    }
  }
}

export default Home
