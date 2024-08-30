// Import necessary React and Apollo Client hooks, components, and libraries
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, Row, Col, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../Styles/components.css';
// Define a GraphQL query to fetch the list of users along with their albums and photos
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
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

const UsersOverview = () => {
  // Use Apollo Client's useQuery hook to execute the GET_USERS query and manage loading, error, and data states
  const { loading, error, data } = useQuery(GET_USERS);

  // State to manage the current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Hook for managing translations
  const { t } = useTranslation();

  // Define the number of users to display per page
  const usersPerPage = 10;

  // Display a loading message while the data is being fetched
  if (loading) return <p>{t('loading')}</p>;

  // Display an error message if there was an error fetching the data
  if (error) return <p>{t('error')}: {error.message}</p>;

  // Get the list of users from the fetched data
  const users = data.users;

  // Calculate the indexes for the first and last users on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Slice the users list to get the users for the current page
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate the total number of pages needed for pagination
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Function to handle the page change in pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="users-overview">
      {/* Display the title for the users overview section */}
      <h2 className="text-center">{t('users_overview')}</h2>

      {/* Display the list of users in a grid layout */}
      <Row>
        {currentUsers.map((user) => (
          <Col xs={12} sm={6} md={4} lg={2} key={user.id} className="mb-4">
            <Link to={`/user-albums/${user.id}`}>
              <Card className="user-card">
                <Card.Body>
                  <Card.Title>{user.name}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
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
    </div>
  );
};

export default UsersOverview;
