const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');

// Load data from JSON files
const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
const albums = JSON.parse(fs.readFileSync('albums.json', 'utf-8'));
const photos = JSON.parse(fs.readFileSync('photos.json', 'utf-8'));

// GraphQL schema definition
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    username: String
    address: Address
    phone: String
    website: String
    company: Company
    albums: [Album]
  }

  type Address {
    street: String
    suite: String
    city: String
    zipcode: String
    geo: Geo
  }

  type Geo {
    lat: String
    lng: String
  }

  type Company {
    name: String
    catchPhrase: String
    bs: String
  }

  type Album {
    id: ID!
    title: String!
    userId: ID!
    photos: [Photo]
  }

  type Photo {
    id: ID!
    title: String!
    url: String!
    thumbnailUrl: String!
    albumId: ID!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    albums(userId: ID!): [Album]
    album(id: ID!): Album
    photos(albumId: ID!): [Photo]
    photo(id: ID!): Photo
  }

  type Mutation {
    addAlbum(userId: ID!, title: String!): Album
    editAlbum(id: ID!, title: String!, userId: ID!): Album
    deleteAlbum(id: ID!, userId: ID!): Album
    deletePhoto(id: ID!): Photo
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    // Resolver to get all users
    users: () => users,
    // Resolver to get a specific user by ID
    user: (parent, args) => users.find(user => user.id === parseInt(args.id)),
    // Resolver to get all albums for a specific user
    albums: (parent, args) => albums.filter(album => album.userId === parseInt(args.userId)),
    // Resolver to get a specific album by ID
    album: (parent, args) => albums.find(album => album.id === parseInt(args.id)),
    // Resolver to get all photos for a specific album
    photos: (parent, args) => photos.filter(photo => photo.albumId === parseInt(args.albumId)),
    // Resolver to get a specific photo by ID
    photo: (parent, args) => photos.find(photo => photo.id === parseInt(args.id)),
  },

  Mutation: {
    // Mutation to add a new album
    addAlbum: (parent, args) => {
      const newAlbum = {
        id: String(albums.length + 1),
        title: args.title,
        userId: parseInt(args.userId),
        photos: []
      };
      albums.push(newAlbum);
      return newAlbum;
    },

    // Mutation to edit an existing album
    editAlbum: (parent, args) => {
      const album = albums.find(album => album.id === parseInt(args.id) && album.userId === parseInt(args.userId));
      if (album) {
        album.title = args.title;
      }
      return album;
    },

    // Mutation to delete an album
    deleteAlbum: (parent, args) => {
      const albumIndex = albums.findIndex(album => album.id === parseInt(args.id) && album.userId === parseInt(args.userId));
      if (albumIndex !== -1) {
        const deletedAlbum = albums.splice(albumIndex, 1);
        return deletedAlbum[0];
      }
      return null;
    },

    // Mutation to delete a photo
    deletePhoto: (parent, args) => {
      const photoIndex = photos.findIndex(photo => photo.id === parseInt(args.id));
      if (photoIndex !== -1) {
        const deletedPhoto = photos.splice(photoIndex, 1);
        return deletedPhoto[0];
      }
      return null;
    }
  },

  // Resolver for User type to get albums associated with a user
  User: {
    albums: (parent) => albums.filter(album => album.userId === parent.id),
  },

  // Resolver for Album type to get photos associated with an album
  Album: {
    photos: (parent) => photos.filter(photo => photo.albumId === parent.id),
  }
};

// Start the Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
