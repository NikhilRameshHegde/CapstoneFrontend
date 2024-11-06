import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5003/api/categories'; // Change the URL to your backend base URL

  constructor(private http: HttpClient) {}

  // POST: Create a new category
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}`, category);
  }

  // GET: Get category by ID
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // GET: Get all categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }

  // PUT: Update category by ID
  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  // DELETE: Delete category by ID
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET: Get products by category ID
  getProductsByCategoryId(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${id}/products`);
  }
}
