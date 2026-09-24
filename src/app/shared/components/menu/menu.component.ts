import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() isCollapsed: boolean = false;

  // Visible menu items for Lume Showcase Demo
  menuItems = [
    { label: 'Produtos', route: '/admin/products', icon: 'products' },
    { label: 'Categorias', route: '/admin/categories', icon: 'categories' },
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Pedidos', route: '/admin/orders', icon: 'orders' },
    { label: 'Clientes', route: '/admin/customers', icon: 'customers' },
    { label: 'Configurações', route: '/admin/settings', icon: 'settings' }
  ];
}
