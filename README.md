
# Photo Album Application

## Overview

This project is a photo album application built with React.js. It allows users to manage albums and photos. The application consists of three main views:
1. Manage Users: Display a list of users with pagination (10 users per page).
2. Manage Albums: Display a list of albums for each user with functionalities to add, edit, or delete albums.
3. Manage Photos: Show all photos associated with each album with options to delete specific photos.

The user interface supports English and French, allowing users to switch between languages.

## Technologies Used

- **Frontend:** React.js, Bootstrap 5, Apollo Client
- **Backend:** Node.js, Apollo Server, GraphQL
- **State Management:** React useState and useQuery hooks
- **Routing:** React Router DOM
- **Internalization:** i18next
- **Pagination:** Custom logic with React useState
- **Testing:** Manual testing

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/photo-album-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd photo-album-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
5. Start the frontend development server:
   ```bash
   npm start
   ```
6. The application will be available at `http://localhost:3000`.

## Usage

- **Managing Users:** Navigate to the homepage to see the list of users. Click on a user to manage their albums.
- **Managing Albums:** Inside a user's page, you can add a new album, edit existing albums, or delete them.
- **Managing Photos:** Click on an album to see its photos. You can delete photos individually and navigate through the album pages.

## Features

- **Internalization:** Supports English and French languages.
- **Responsive Design:** The application is fully responsive and adapts to different screen sizes.
- **Client-side Routing:** Uses React Router for navigation between different views.
- **Error Handling:** The application gracefully handles errors and displays user-friendly messages.

## Future Enhancements

- **Redux Integration:** Optionally, integrate Redux for more complex state management.
- **Deployment:** Deploy the application to a platform like Netlify or Vercel.

## Contribution

Feel free to fork the project and submit pull requests. All contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

