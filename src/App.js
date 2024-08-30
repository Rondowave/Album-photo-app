import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UsersOverview from './components/UsersOverview';
import UserAlbums from './components/UserAlbums';
import AlbumPhotos from './components/AlbumPhotos';
import LanguageSelector from './components/LanguageSelector';
import 'bootstrap/dist/css/bootstrap.min.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <LanguageSelector />
          <Routes>
            <Route path="/" element={<UsersOverview />} />
            <Route path="/user-albums/:userId" element={<UserAlbums />} />
            <Route path="/album-photos/:albumId" element={<AlbumPhotos />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
