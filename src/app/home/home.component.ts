import { Component, OnInit, HostListener, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { Review } from '../review';
import { VendorService } from '../vendor.service';
import { Vendor } from '../vendor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, RouterOutlet, RouterModule,CommonModule,RouterLink,FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  lastScrolledPos: number = 0;
  isBrowser: boolean;
  categories: Category[] = [];
  product: any;
  reviews:Review[]=[];
  showVendorsDropdown = false;  // Add this line to define the property

  showCategoriesDropdown = false;
  products: Product[]=[];
   totalAmount = localStorage.getItem('totalAmount');
   vendors: Vendor[] = [];
  filteredProducts: any;
  selectedPriceRange: any;
  searchQuery: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private productService: ProductService,private categoryService: CategoryService,private router: Router,private userService:UserService ,private route:ActivatedRoute,private vendorService:VendorService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  chatbotVisible: boolean = false;

  toggleChatbot(): void {
    this.chatbotVisible = !this.chatbotVisible;
  }


  toggleCategoriesDropdown(show: boolean): void {
    this.showCategoriesDropdown = show;
  }
  toggleVendorsDropdown(show: boolean): void {
    this.showVendorsDropdown = show;
  }

  ngOnInit(): void {
    this.totalAmount = localStorage.getItem('totalAmount') || '0'; // Default to '0' if not found

    
    this.loadCategories();
    this.loadProducts();
    this.loadVendors();  // Load vendors


    if (this.isBrowser) {
      this.addEventListeners();
      this.scrollReveal(); // Initial call
    }
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  loadVendors(): void {
    this.vendorService.listVendors().subscribe(
      (data: Vendor[]) => {
        this.vendors = data;
      }
    );
  }
  onCategorySelect(event: Event) {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    console.log('Selected Category ID:', selectedCategoryId);
    // You can add additional logic here based on the selected category
  }
  

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
     
    );
  }
 


  addEventListeners(): void {
    const navTogglers = document.querySelectorAll("[data-nav-toggler]");
    const navbar = document.querySelector("[data-navbar]");
    const navbarLinks = document.querySelectorAll("[data-nav-link]");
    const overlay = document.querySelector("[data-overlay]");

    if (navbar && overlay) {
      this.addEventOnElem(navTogglers, 'click', () => this.toggleNavbar(navbar, overlay));
      this.addEventOnElem(navbarLinks, 'click', () => this.closeNavbar(navbar, overlay));
    }
  }

  
  addEventOnElem(elem: NodeListOf<Element>, type: string, callback: EventListener): void {
    elem.forEach(element => {
      element.addEventListener(type, callback);
    });
  }

  toggleNavbar(navbar: Element, overlay: Element): void {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  closeNavbar(navbar: Element, overlay: Element): void {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isBrowser) {
      this.headerActive();
      this.headerSticky();
      this.scrollReveal();
    }
  }

  headerActive(): void {
    const header = document.querySelector("[data-header]");
    const backTopBtn = document.querySelector("[data-back-top-btn]");
    if (header && backTopBtn) {
      if (window.scrollY > 150) {
        header.classList.add("active");
        backTopBtn.classList.add("active");
      } else {
        header.classList.remove("active");
        backTopBtn.classList.remove("active");
      }
    }
  }

  headerSticky(): void {
    const header = document.querySelector("[data-header]");
    if (header) {
      if (this.lastScrolledPos >= window.scrollY) {
        header.classList.remove("header-hide");
      } else {
        header.classList.add("header-hide");
      }
    }
    this.lastScrolledPos = window.scrollY;
  }
  

  scrollReveal(): void {
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight / 2) {
        section.classList.add("active");
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (products: Product[]) => {
        products.forEach(product => {
          this.calculateAverageRating(product.id).then(average => {
            product.averageRating = average;
          });
        });
        this.products = products;
      },
      error => console.error('Failed to load products:', error)
    );
  }
  
  async calculateAverageRating(productId: string): Promise<number> {
    const reviews = await this.productService.getReviewsByProductId(productId).toPromise();
    if (reviews && reviews.length > 0) {
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      return total / reviews.length;
    }
    return 0;
  }
  
  signOut(){
    this.userService.signOut();


  }
  addToCart(): void {
    // Retrieve the current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
    // Check if the product is already in the cart
    const existingItemIndex = cart.findIndex((item: any) => item.productId === this.product.id);
  
    if (existingItemIndex >= 0) {
      // If the product already exists, update its quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // If the product does not exist, add it to the cart
      const orderItem = {
        id: '', // id will be generated by the backend
        orderId: '', // orderId will be associated when creating the order
        productId: this.product.id,
        productName: this.product.name,
        price: this.product.price,
        quantity: 1,
        productImage: this.product.imageUrl
      };
      cart.push(orderItem);
    }
  
    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    alert("Item added to cart");
    // Optionally, you can show a success message
    console.log('Item added to cart');
  }
  
  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    // Filter by price range
    let filteredByPrice = this.products;
    if (this.selectedPriceRange) {
      const [minPrice, maxPrice] = this.selectedPriceRange.split('-').map((price: string) => parseFloat(price));
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

  }
 
}
