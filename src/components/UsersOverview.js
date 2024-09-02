import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

const UsersOverview = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();
  const usersPerPage = 10;

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{t('error')}: {error.message}</p>;

  const users = data.users;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="users-overview">
      <h2 className="text-center mb-4">{t('users_overview')}</h2>
      <div className="card-container">
        {currentUsers.map((user) => (
          <Card key={user.id} as={Link} to={`/user-albums/${user.id}`}>
            <Card.Body>
              <Card.Title>{user.name}</Card.Title>
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
    </div>
  );
};

export default UsersOverview;
