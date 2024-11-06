import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  private apiUrl = 'http://localhost:5001/api/users';  // Adjust this URL based on your backend configuration

  constructor(private http: HttpClient,private router:Router) {}  // Inject HttpClient for making HTTP requests



 
  registerUser(user: User): Observable<User> {

    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  loginUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
  }

   // Get user profile by email
  getUserProfile(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${email}`);
  }

  // Update user profile by email
  updateUserProfile(email: string, userDetails: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${email}`, userDetails);
  }
  getUserByEmail(email: string): Observable<User | null> {
    return this.http.get<User | null>(`${this.apiUrl}/${email}`);
  }

  // Get all orders by user ID
  getUserOrders(userId: string): Observable<any[]> {  // Replace 'any[]' with your order model if available
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/orders`);
  }

  // Get all users (for admin purposes, etc.)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/id/${id}`);
  }

  // Delete user by email
  deleteUser(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${email}`);
  }
  signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/landing']);
  }
}

