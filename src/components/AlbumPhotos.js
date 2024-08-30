// Import necessary React and Apollo Client hooks, components, and libraries
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, Row, Col, Button, Pagination } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Define a GraphQL query to fetch the photos for a specific album by its ID
const GET_ALBUM_PHOTOS = gql`
  query GetAlbumPhotos($albumId: ID!) {
    album(id: $albumId) {
      title
      photos {
        id
        title
        url
      }
    }
  }
`;

// Define a GraphQL mutation to delete a specific photo by its ID
const DELETE_PHOTO = gql`
  mutation DeletePhoto($id: ID!) {
    deletePhoto(id: $id) {
      id
    }
  }
`;

const AlbumPhotos = () => {
  // Get the albumId from the URL parameters
  const { albumId } = useParams();

  // Use Apollo Client's useQuery hook to fetch the photos for the specified album
  const { loading, error, data } = useQuery(GET_ALBUM_PHOTOS, {
    variables: { albumId },
  });

  // Use Apollo Client's useMutation hook to define the deletePhoto mutation
  const [deletePhoto] = useMutation(DELETE_PHOTO, {
    refetchQueries: [{ query: GET_ALBUM_PHOTOS, variables: { albumId } }],
  });

  // State to manage the current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Define the number of photos to display per page
  const photosPerPage = 10;

  // Hook for managing translations
  const { t } = useTranslation();

  // Display a loading message while the data is being fetched
  if (loading) return <p>{t('loading')}</p>;

  // Display an error message if there was an error fetching the data
  if (error) return <p>{t('error')}: {error.message}</p>;

  // Get the album data from the fetched results
  const album = data?.album;

  // Display a message if no album is found
  if (!album) {
    return <p>{t('no_album_found')}</p>;
  }

  // Calculate the indexes for the first and last photos on the current page
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;

  // Slice the photos list to get the photos for the current page
  const currentPhotos = album.photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  // Calculate the total number of pages needed for pagination
  const totalPages = Math.ceil(album.photos.length / photosPerPage);

  // Function to handle the page change in pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle the deletion of a photo
  const handleDeletePhoto = (id) => {
    deletePhoto({ variables: { id } });
  };

  return (
    <div className="album-photos">
      {/* Display the album title */}
      <h2 className="text-center">{album.title}</h2>

      {/* Display the list of photos in a grid layout */}
      <Row>
        {currentPhotos.map((photo) => (
          <Col xs={12} sm={6} md={4} lg={2} key={photo.id} className="mb-4">
            <Card className="photo-card">
              <Card.Img variant="top" src={photo.url} />
              <Card.Body>
                <Card.Title>{photo.title}</Card.Title>
                {/* Button to delete a photo */}
                <Button variant="danger" onClick={() => handleDeletePhoto(photo.id)}>{t('delete')}</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Render the pagination controls */}
      <Pagination>
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Button to navigate back to the list of albums */}
      <Button variant="primary" as={Link} to={`/user-albums/${albumId}`}>
        {t('back_to_albums')}
      </Button>
    </div>
  );
};

export default AlbumPhotos;
