const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');

const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
const albums = JSON.parse(fs.readFileSync('albums.json', 'utf-8'));
const photos = JSON.parse(fs.readFileSync('photos.json', 'utf-8'));

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

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find(user => user.id === parseInt(args.id)),
    albums: (parent, args) => albums.filter(album => album.userId === parseInt(args.userId)),
    album: (parent, args) => albums.find(album => album.id === parseInt(args.id)),
    photos: (parent, args) => photos.filter(photo => photo.albumId === parseInt(args.albumId)),
    photo: (parent, args) => photos.find(photo => photo.id === parseInt(args.id)),
  },

  Mutation: {
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
    editAlbum: (parent, args) => {
      const album = albums.find(album => album.id === parseInt(args.id) && album.userId === parseInt(args.userId));
      if (album) {
        album.title = args.title;
      }
      return album;
    },
    deleteAlbum: (parent, args) => {
      const albumIndex = albums.findIndex(album => album.id === parseInt(args.id) && album.userId === parseInt(args.userId));
      if (albumIndex !== -1) {
        const deletedAlbum = albums.splice(albumIndex, 1);
        return deletedAlbum[0];
      }
      return null;
    },
    deletePhoto: (parent, args) => {
      const photoIndex = photos.findIndex(photo => photo.id === parseInt(args.id));
      if (photoIndex !== -1) {
        const deletedPhoto = photos.splice(photoIndex, 1);
        return deletedPhoto[0];
      }
      return null;
    }
  },

  User: {
    albums: (parent) => albums.filter(album => album.userId === parent.id),
  },

  Album: {
    photos: (parent) => photos.filter(photo => photo.albumId === parent.id),
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
