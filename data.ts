export const data = {
  type: "complex",
  books: [
    {
      type: "book",
      title: "Lord of the rings",
      isbn: "123456789",
      category: "drama"
    },
    {
      type: "book",
      title: "Godfather",
      isbn: "092843847",
      category: "comedy"
    }
  ],
  films: [
    {
      type: "film",
      title: "Star Wars",
      cast: [
        {
          type: "cast",
          actor: {
            type: "person",
            name: "Harrison Ford"
          },
          as: "Han Solo"
        },
        {
          type: "cast",
          actor: {
            type: "person",
            name: "Carrie Fisher"
          },
          as: "Leia Organa"
        }
      ]      
    }
  ]
};

