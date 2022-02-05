import Head from 'next/head'
import { sanityClient } from '../sanity'

interface Props {
  posts: Post[]
}

export default function Home({ posts }: Props) {
  console.log('posts', posts)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>aniwarathe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        {posts.map((post) => (
          <div>
            <p key={post._id}>{post.title}</p>
            {/* <p>By {post.author.name}</p> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author -> {
      name
    },
    body,
  }`
  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts,
    },
  }
}
