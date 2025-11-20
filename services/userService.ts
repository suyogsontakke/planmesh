import { User, SavedTrip, Itinerary } from '../types';

const USERS_KEY = 'planmesh_users';
const TRIPS_KEY = 'planmesh_trips';
const SESSION_KEY = 'planmesh_session';

export const userService = {
  // --- Auth ---
  signup: (email: string, password: string, name: string): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    
    if (users[email]) {
      throw new Error("User already exists");
    }

    const newUser: User = {
      email,
      password, // In a real app, hash this!
      name,
      profilePic: '', // Default empty
      bio: 'Just another traveler.',
      dob: ''
    };

    users[email] = newUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  login: (email: string, password: string): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const user = users[email];

    if (!user) {
       throw new Error("User not found");
    }

    if (user.password !== password) {
      throw new Error("Invalid password");
    }
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  updateProfile: (updatedUser: User): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    
    if (users[updatedUser.email]) {
      users[updatedUser.email] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw new Error("User not found");
  },

  // --- Database (Trips) ---
  saveTrip: (email: string, tripData: Itinerary): SavedTrip => {
    const allTrips = JSON.parse(localStorage.getItem(TRIPS_KEY) || '{}');
    const userTrips = allTrips[email] || [];
    
    const newTrip: SavedTrip = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      destination: tripData.destinationName,
      data: tripData
    };

    userTrips.unshift(newTrip); // Add to top
    allTrips[email] = userTrips;
    localStorage.setItem(TRIPS_KEY, JSON.stringify(allTrips));
    
    return newTrip;
  },

  getHistory: (email: string): SavedTrip[] => {
    const allTrips = JSON.parse(localStorage.getItem(TRIPS_KEY) || '{}');
    return allTrips[email] || [];
  }
};