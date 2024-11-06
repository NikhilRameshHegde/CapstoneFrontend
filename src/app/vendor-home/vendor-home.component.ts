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
import { OrderItem } from '../order-item';
import { OrderItemService } from '../order-item.service';

@Component({
  selector: 'app-vendor-home',
  standalone: true,
  imports: [IonicModule, RouterOutlet, RouterModule,CommonModule,RouterLink,FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vendor-home.component.html',
  styleUrls: ['./vendor-home.component.css']
})
export class VendorHomeComponent implements OnInit {

  lastScrolledPos: number = 0;
  isBrowser: boolean;
  categories: Category[] = [];
  product: any;
  reviews:Review[]=[];
  showVendorsDropdown = false;  // Add this line to define the property
  orderItems: OrderItem[] = []; // Store fetched order items
  showOrderModal: boolean = false; // Control modal visibility
  vendorId=localStorage.getItem('vendorId');

  showCategoriesDropdown = false;
  products: Product[]=[];
   vendors: Vendor[] = [];
  filteredProducts: any;
  selectedPriceRange: any;
  searchQuery: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private productService: ProductService,private categoryService: CategoryService,private router: Router,private userService:UserService ,private route:ActivatedRoute,private vendorService:VendorService,private orderItemService:OrderItemService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  chatbotVisible: boolean = false;

  toggleChatbot(): void {
    this.chatbotVisible = !this.chatbotVisible;
  }


  ngOnInit(): void {

    console.log(this.vendorId);

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

  viewOrders(): void {
    if (!this.vendorId) {
      alert('Vendor ID is missing!');
      return;
    }

    this.orderItemService.getOrderItemsByVendorId(this.vendorId).subscribe(
      (data: OrderItem[]) => {
        this.orderItems = data;
        this.showOrderModal = true; // Show modal after fetching data
      },
      (error) => {
        console.error('Failed to load order items:', error);
        alert('Failed to load order items');
      }
    );
  }

  closeOrderModal(): void {
    this.showOrderModal = false; // Close modal
  }

  
  signOut(){
    this.userService.signOut();


  }
 
 
}
