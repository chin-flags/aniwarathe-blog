interface Post {
  _id: string
  slug: {
    current: string
  }
  title: string
  author: {
    name: string
  }
  comments: Comment[]
  mainImage: string
  body: string
}

interface Comment {
  _id: string
  name: string
  comment: string
  post: {
    _ref: string
    _type: string
  }
  _createdAt: string
  _updatedAt: string
}
