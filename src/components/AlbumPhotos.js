import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, Button, Pagination } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const GET_ALBUM_PHOTOS = gql`
  query GetAlbumPhotos($albumId: ID!) {
    album(id: $albumId) {
      id
      title
      userId
      photos {
        id
        title
        url
      }
    }
  }
`;

const DELETE_PHOTO = gql`
  mutation DeletePhoto($id: ID!) {
    deletePhoto(id: $id) {
      id
    }
  }
`;

const AlbumPhotos = () => {
  const { albumId } = useParams();
  const { loading, error, data } = useQuery(GET_ALBUM_PHOTOS, { variables: { albumId } });
  const [deletePhoto] = useMutation(DELETE_PHOTO, {
    refetchQueries: [{ query: GET_ALBUM_PHOTOS, variables: { albumId } }],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 10;
  const { t } = useTranslation();

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{t('error')}: {error.message}</p>;

  const album = data.album;
  if (!album) return <p>{t('no_album_found')}</p>;

  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = album.photos.slice(indexOfFirstPhoto, indexOfLastPhoto);
  const totalPages = Math.ceil(album.photos.length / photosPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeletePhoto = (id) => {
    if (window.confirm(t('confirm_delete_photo'))) {
      deletePhoto({ variables: { id } });
    }
  };

  return (
    <div className="album-photos">
      <h2 className="text-center mb-4">{album.title}</h2>
      <div className="card-container">
        {currentPhotos.map((photo) => (
          <Card key={photo.id}>
            <Card.Img variant="top" src={photo.url} alt={photo.title} />
            <Card.Body>
              <Card.Title>{photo.title}</Card.Title>
              <Button variant="danger" size="sm" onClick={() => handleDeletePhoto(photo.id)}>
                {t('delete')}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {t('previous')}
        </Pagination.Prev>
        {[...Array(totalPages).keys()].slice(
          Math.max(0, currentPage - 3),
          Math.min(currentPage + 2, totalPages)
        ).map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {t('next')}
        </Pagination.Next>
      </Pagination>
      <Button variant="primary" as={Link} to={`/user-albums/${album.userId}`} className="mt-3">
        {t('back_to_albums')}
      </Button>
    </div>
  );
};

export default AlbumPhotos;
