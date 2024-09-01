import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import UsersOverview from './components/UsersOverview';
import UserAlbums from './components/UserAlbums';
import AlbumPhotos from './components/AlbumPhotos';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from 'react-i18next'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/App.css';

// Initialisation du client Apollo
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

function App() {
  const { t } = useTranslation(); 

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand href="/">Photo Album App</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/">{t('home')}</Nav.Link> {}
                </Nav>
                <LanguageSelector />
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<UsersOverview />} />
              <Route path="/user-albums/:userId" element={<UserAlbums />} />
              <Route path="/album-photos/:albumId" element={<AlbumPhotos />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
