## API Endpoints

### Authentication
#### 1. Register User
**POST** `http://localhost:5000/api/auth/register`  
Registers a new user.

#### 2. Login User
**POST** `http://localhost:5000/api/auth/login`  
Authenticates a user and returns a token.

#### 3. Forgot Password
**POST** `http://localhost:5000/api/auth/forgot-password`  
Sends a password reset link to the registered email.

#### 4. Reset Password
**POST** `http://localhost:5000/api/auth/reset-password/:token`  
Resets the user's password using a valid token.

---

### Locations
#### 5. Get All States
**GET** `http://localhost:5000/api/location/states`  
Fetches all the Indian states for dropdown selection.

#### 6. Get All Cities for a State
**GET** `http://localhost:5000/api/location/cities/:stateName`  
Fetches all the cities of a specific state.

---

### Dashboard
#### 7. User Dashboard
**GET** `http://localhost:5000/api/dashboard/user`  
Fetches dashboard data for a logged-in user.

#### 8. Admin Dashboard
**GET** `http://localhost:5000/api/dashboard/admin`  
Fetches dashboard data for admin users.
