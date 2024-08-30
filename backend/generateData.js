const fs = require('fs');

function generateUsers(count) {
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: i,
      name: `User ${i}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      address: {
        street: `Street ${i}`,
        suite: `Apt. ${i}`,
        city: `City ${i}`,
        zipcode: `0000${i}`,
        geo: {
          lat: `${i}.0000`,
          lng: `${i}.0000`
        }
      },
      phone: `000-000-000${i}`,
      website: `user${i}.org`,
      company: {
        name: `Company ${i}`,
        catchPhrase: `Innovative company ${i}`,
        bs: `Innovate at scale ${i}`
      }
    });
  }
  return users;
}

function generateAlbums(userId, count) {
  const albums = [];
  for (let i = 1; i <= count; i++) {
    albums.push({
      userId: userId,
      id: i,
      title: `Album ${i} of User ${userId}`
    });
  }
  return albums;
}

function generatePhotos(albumId, count) {
  const photos = [];
  for (let i = 1; i <= count; i++) {
    photos.push({
      albumId: albumId,
      id: i,
      title: `Photo ${i} of Album ${albumId}`,
      url: `https://via.placeholder.com/600/${i}`,
      thumbnailUrl: `https://via.placeholder.com/150/${i}`
    });
  }
  return photos;
}

const users = generateUsers(10);
const albums = [];
const photos = [];

users.forEach(user => {
  const userAlbums = generateAlbums(user.id, 10);
  albums.push(...userAlbums);
  userAlbums.forEach(album => {
    const albumPhotos = generatePhotos(album.id, 20);
    photos.push(...albumPhotos);
  });
});

fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
fs.writeFileSync('albums.json', JSON.stringify(albums, null, 2));
fs.writeFileSync('photos.json', JSON.stringify(photos, null, 2));

console.log('Data generated successfully!');
