import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../category.service';
import { CommonModule } from '@angular/common';
import { Product } from '../product';
import { Category } from '../category';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedPriceRange: string = '';
  filteredProducts: Product[] = [];
  searchQuery: any;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.route.params.subscribe(params => {
      const categoryId = params['categoryId'];
      this.loadProducts(categoryId);
    });
  }
  
  loadProducts(categoryId: string): void {
    this.categoryService.getProductsByCategoryId(categoryId).subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...this.products]; // Initialize filteredProducts with all products
        this.applyPriceFilter(); // Apply the filter after loading the products
        this.cdr.detectChanges(); // Force change detection

      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }
  
  onCategorySelect(categoryId: string): void {
    this.router.navigate(['/products', categoryId]);
  }
 
  
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      categories => {
        this.categories = categories;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  onPriceRangeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedPriceRange = target.value;
    this.applyPriceFilter();
  }

  applyPriceFilter(): void {
    if (this.selectedPriceRange) {
      const [minPrice, maxPrice] = this.selectedPriceRange.split('-').map(price => parseFloat(price));
      this.filteredProducts = this.products.filter(product => product.price >= minPrice && product.price <= maxPrice);
    } else {
      this.filteredProducts = this.products;
    }
    console.log('Filtered Products:', this.filteredProducts); // Log filtered products
    this.cdr.detectChanges(); // Force change detection
  }
  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    // Filter by price range
    let filteredByPrice = this.products;
    if (this.selectedPriceRange) {
      const [minPrice, maxPrice] = this.selectedPriceRange.split('-').map(price => parseFloat(price));
      filteredByPrice = filteredByPrice.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = filteredByPrice.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    } else {
      this.filteredProducts = filteredByPrice;
    }

    console.log('Filtered Products:', this.filteredProducts); // Log filtered products
    this.cdr.detectChanges(); // Force change detection
  }
  
}
