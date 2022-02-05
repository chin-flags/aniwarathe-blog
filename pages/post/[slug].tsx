import { GetStaticPaths, GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'
import { sanityClient, urlFor } from '../../sanity'

interface Props {
  post: Post
}

interface IFormInput {
  _id: string
  name: string
  comment: string
}

const Post = ({ post }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await fetch('/api/createComment', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      console.log('resp', response)
    } catch (error) {
      console.log('err', error)
    }
  }

  return (
    <main>
      <img className="h-40 w-full object-cover" src={urlFor(post.mainImage)} />
      <article>{post.title}</article>
      <p>{post.author.name}</p>
      <div>
        <PortableText
          content={post.body}
          serializers={{
            h1: (props: any) => (
              <h1 className="text-2xl font-bold" {...props} />
            ),
            h2: (props: any) => <h1 className="text-xl font-bold" {...props} />,
            li: ({ children }: any) => (
              <li className="text-2xl font-bold">{children}</li>
            ),
            link: ({ href, children }: any) => (
              <a href={href} className="text-blue-500">
                {children}
              </a>
            ),
          }}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex max-w-2xl flex-col p-5"
      >
        <input {...register('_id')} name="_id" type="hidden" value={post._id} />
        <label className="mb-5 block">
          <span>Name</span>
          <input {...register('name')} placeholder="Name" type="text" />
        </label>
        <label className="mb-5 block">
          <span>Comment</span>
          <textarea
            {...register('comment', { required: true })}
            className="ring-yello-500 outline-none focus:ring"
            placeholder="Comment"
            rows={8}
          />
        </label>
        <div>{errors.comment && <p>Required</p>}</div>
        <input type="submit" />
      </form>
      <div>
        <h3>Comments</h3>
        {post.comments.map(({ name, comment }) => (
          <div>
            <p>{name}</p>
            <p>{comment}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Post

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug {
          current
        },
      }`

  const posts: Post[] = await sanityClient.fetch(query)

  const paths = posts.map((post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
          name,
          image
        },
        description,
        'comments': *[_type == "comment" &&
                    post._ref == ^._id ],
        mainImage,
        slug,
        body,
      }`

  const post = await sanityClient.fetch(query, { slug: params?.slug })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
