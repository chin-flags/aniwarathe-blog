export default {
    name: 'comment',
    title: 'Comment',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        name: 'approved',
        title: 'Approved',
        type: 'boolean',
      },
      {
        name: 'comment',
        title: 'Comment',
        type: 'text',
      },
      {
        name: 'post',
        title: 'Categories',
        type: 'reference',
        to: [{ type: 'post'}]
      }
    ]
  }
  