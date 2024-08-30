// This component is responsible for managing and displaying the albums of a specific user.

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, Row, Col, Button, Pagination, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// GraphQL query to fetch the albums of a specific user by userId
const GET_USER_ALBUMS = gql`
  query GetUserAlbums($userId: ID!) {
    user(id: $userId) {
      name
      albums {
        id
        title
        photos {
          id
          title
          url
        }
      }
    }
  }
`;

// GraphQL mutation to add a new album for the user
const ADD_ALBUM = gql`
  mutation AddAlbum($userId: ID!, $title: String!) {
    addAlbum(userId: $userId, title: $title) {
      id
      title
      userId
    }
  }
`;

// GraphQL mutation to edit the title of an existing album
const EDIT_ALBUM = gql`
  mutation EditAlbum($albumId: ID!, $title: String!, $userId: ID!) {
    editAlbum(id: $albumId, title: $title, userId: $userId) {
      id
      title
      userId
    }
  }
`;

// GraphQL mutation to delete an album by its ID
const DELETE_ALBUM = gql`
  mutation DeleteAlbum($albumId: ID!, $userId: ID!) {
    deleteAlbum(id: $albumId, userId: $userId) {
      id
    }
  }
`;

const UserAlbums = () => {
  const { userId } = useParams();  // Extracting userId from the URL parameters
  const { loading, error, data } = useQuery(GET_USER_ALBUMS, {
    variables: { userId },
  });
  const [currentPage, setCurrentPage] = useState(1);  // State to manage the current page for pagination
  const [showModal, setShowModal] = useState(false);  // State to manage the visibility of the modal
  const [editAlbumId, setEditAlbumId] = useState(null);  // State to track the album being edited
  const [albumTitle, setAlbumTitle] = useState('');  // State to manage the album title input
  const albumsPerPage = 10;  // Number of albums to display per page
  const { t } = useTranslation();  // Hook for handling translations

  // Mutation hook to add a new album
  const [addAlbum] = useMutation(ADD_ALBUM, {
    refetchQueries: [{ query: GET_USER_ALBUMS, variables: { userId } }],
  });

  // Mutation hook to edit an existing album
  const [editAlbum] = useMutation(EDIT_ALBUM, {
    refetchQueries: [{ query: GET_USER_ALBUMS, variables: { userId } }],
  });

  // Mutation hook to delete an album
  const [deleteAlbum] = useMutation(DELETE_ALBUM, {
    refetchQueries: [{ query: GET_USER_ALBUMS, variables: { userId } }],
  });

  if (loading) return <p>{t('loading')}</p>;  // Display loading text while fetching data
  if (error) return <p>{t('error')}: {error.message}</p>;  // Display error message if query fails

  const user = data.user;  // Access the user data from the query response

  // Logic for handling pagination
  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = user.albums.slice(indexOfFirstAlbum, indexOfLastAlbum);
  const totalPages = Math.ceil(user.albums.length / albumsPerPage);

  const handlePageChange = (pageNumber) => {  // Handle pagination page change
    setCurrentPage(pageNumber);
  };

  const handleAddAlbum = () => {  // Handle the addition of a new album
    addAlbum({ variables: { userId, title: albumTitle } });
    setAlbumTitle('');  // Reset the album title input
    setShowModal(false);  // Close the modal
  };

  const handleEditAlbum = (albumId, title) => {  // Open the modal to edit the selected album
    setEditAlbumId(albumId);  // Set the ID of the album being edited
    setAlbumTitle(title);  // Set the current title of the album in the input
    setShowModal(true);  // Show the modal
  };

  const handleSaveEdit = () => {  // Save the edited album title
    editAlbum({ variables: { albumId: editAlbumId, title: albumTitle, userId } });
    setAlbumTitle('');  // Reset the album title input
    setEditAlbumId(null);  // Clear the edit album ID
    setShowModal(false);  // Close the modal
  };

  const handleDeleteAlbum = (albumId) => {  // Handle the deletion of an album
    deleteAlbum({ variables: { albumId, userId } });
  };

  return (
    <div className="user-albums">
      <h2 className="text-center">{user.name}'s {t('albums')}</h2>
      <Button variant="success" onClick={() => setShowModal(true)}>{t('add_album')}</Button>
      <Row>
        {currentAlbums.map((album) => (
          <Col xs={12} sm={6} md={4} lg={2} key={album.id} className="mb-4">
            <Card className="album-card">
              <Card.Body>
                <Card.Title>
                  <Link 
                    to={`/album-photos/${album.id}`} 
                    className="text-decoration-none"
                    onClick={(e) => {
                      if (e.target.tagName.toLowerCase() === 'button') {
                        e.preventDefault();  // Prevent navigation if a button is clicked
                      }
                    }}
                  >
                    {album.title}
                  </Link>
                </Card.Title>
                <Card.Text>{t('total_photos')}: {album.photos.length}</Card.Text>
                <Button 
                  variant="primary" 
                  onClick={(e) => {
                    e.stopPropagation();  // Stop event propagation to prevent navigation
                    handleEditAlbum(album.id, album.title);  // Handle the edit action
                  }}
                >
                  {t('edit')}
                </Button>
                <Button 
                  variant="danger" 
                  onClick={(e) => {
                    e.stopPropagation();  // Stop event propagation to prevent navigation
                    handleDeleteAlbum(album.id);  // Handle the delete action
                  }}
                >
                  {t('delete')}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination>
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}  // Change the current page
          >
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      <Button variant="primary" as={Link} to="/">
        {t('back_to_users')}  // Link back to the Users Overview
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editAlbumId ? t('edit_album') : t('add_album')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAlbumTitle">
              <Form.Label>{t('album_title')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('enter_album_title')}
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}  // Handle title input change
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('close')}
          </Button>
          <Button variant="primary" onClick={editAlbumId ? handleSaveEdit : handleAddAlbum}>
            {t('save_changes')}  // Save the changes or add the album
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserAlbums;
