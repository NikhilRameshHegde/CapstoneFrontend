import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VendorService } from '../vendor.service'; // Update service to VendorService
import { CommonModule } from '@angular/common';
import { Product } from '../product';
import { Vendor } from '../vendor'; // Update import to Vendor
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css'] // Fixed typo: styleUrls
})
export class VendorListComponent implements OnInit {
  products: Product[] = [];
  vendors: Vendor[] = []; // Changed from Category[] to Vendor[]
  selectedPriceRange: string = '';
  filteredProducts: Product[] = [];
  searchQuery: string = ''; // Property for the search query


  constructor(
    private route: ActivatedRoute,
    private vendorService: VendorService, // Updated to VendorService
    private router: Router,
    private cdr: ChangeDetectorRef,
    private productService:ProductService
  ) {}

  ngOnInit(): void {
    this.loadVendors(); // Load vendors
    this.route.params.subscribe(params => {
      const vendorId = params['vendorId'];
      this.loadProducts(vendorId);
    });
  }

  loadProducts(vendorId: string): void {
    this.productService.getProductsByVendorId(vendorId).subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        this.applyPriceFilter();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  loadVendors(): void {
    this.vendorService.listVendors().subscribe(
      vendors => {
        this.vendors = vendors;
      },
      error => {
        console.error('Error fetching vendors:', error);
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
    console.log('Filtered Products:', this.filteredProducts);
    this.cdr.detectChanges();
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
