import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, Button, Pagination, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const GET_USER_ALBUMS = gql`
  query GetUserAlbums($userId: ID!) {
    user(id: $userId) {
      id
      name
      albums {
        id
        title
        photos {
          id
        }
      }
    }
  }
`;

const ADD_ALBUM = gql`
  mutation AddAlbum($userId: ID!, $title: String!) {
    addAlbum(userId: $userId, title: $title) {
      id
      title
      userId
    }
  }
`;

const EDIT_ALBUM = gql`
  mutation EditAlbum($id: ID!, $title: String!, $userId: ID!) {
    editAlbum(id: $id, title: $title, userId: $userId) {
      id
      title
    }
  }
`;

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id) {
      id
    }
  }
`;

const UserAlbums = () => {
  const { userId } = useParams();
  const { loading, error, data } = useQuery(GET_USER_ALBUMS, { variables: { userId } });
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editAlbumId, setEditAlbumId] = useState(null);
  const [albumTitle, setAlbumTitle] = useState('');
  const albumsPerPage = 10;
  const { t } = useTranslation();

  const [addAlbum] = useMutation(ADD_ALBUM, {
    refetchQueries: [{ query: GET_USER_ALBUMS, variables: { userId } }],
  });

  const [editAlbum] = useMutation(EDIT_ALBUM, {
    refetchQueries: [{ query: GET_USER_ALBUMS, variables: { userId } }],
  });

  const [deleteAlbum] = useMutation(DELETE_ALBUM, {
    refetchQueries: [{ query: GET_USER_ALBUMS, variables: { userId } }],
  });

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{t('error')}: {error.message}</p>;

  const user = data.user;
  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = user.albums.slice(indexOfFirstAlbum, indexOfLastAlbum);
  const totalPages = Math.ceil(user.albums.length / albumsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddAlbum = () => {
    addAlbum({ variables: { userId, title: albumTitle } })
      .then(() => {
        setAlbumTitle('');
        setShowModal(false);
      })
      .catch(error => console.error('Error adding album:', error));
  };

  const handleEditAlbum = (albumId, title) => {
    setEditAlbumId(albumId);
    setAlbumTitle(title);
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    editAlbum({ variables: { id: editAlbumId, title: albumTitle, userId } })
      .then(() => {
        setAlbumTitle('');
        setEditAlbumId(null);
        setShowModal(false);
      })
      .catch(error => console.error('Error editing album:', error));
  };

  const handleDeleteAlbum = (albumId) => {
    if (window.confirm(t('confirm_delete_album'))) {
      deleteAlbum({ variables: { id: albumId } })
        .then(() => console.log('Album deleted successfully'))
        .catch(error => console.error('Error deleting album:', error));
    }
  };

  return (
    <div className="user-albums">
      <h2 className="text-center mb-4">{user.name}'s {t('albums')}</h2>
      <Button variant="success" className="mb-3" onClick={() => setShowModal(true)}>{t('add_album')}</Button>
      <div className="card-container">
        {currentAlbums.map((album) => (
          <Card key={album.id}>
            <Card.Body>
              <Card.Title>
                <Link to={`/album-photos/${album.id}`} className="text-decoration-none">
                  {album.title}
                </Link>
              </Card.Title>
              <Card.Text>{t('total_photos')}: {album.photos.length}</Card.Text>
              <Button variant="primary" size="sm" className="me-2" onClick={() => handleEditAlbum(album.id, album.title)}>
                {t('edit')}
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDeleteAlbum(album.id)}>
                {t('delete')}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      <Pagination className="justify-content-center mt-4">
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
      <Button variant="primary" as={Link} to="/" className="mt-3">
        {t('back_to_users')}
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
                onChange={(e) => setAlbumTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('close')}
          </Button>
          <Button variant="primary" onClick={editAlbumId ? handleSaveEdit : handleAddAlbum}>
            {t('save_changes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserAlbums;
