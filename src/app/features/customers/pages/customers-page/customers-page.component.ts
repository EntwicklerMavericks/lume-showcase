import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoStorageService, DemoCustomer } from '../../../../core/services/demo-storage.service';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers-page.component.html',
  styleUrl: './customers-page.component.scss'
})
export class CustomersPageComponent {
  private demoStorage = inject(DemoStorageService);

  searchQuery = signal<string>('');

  /**
   * Lista reativa de clientes conectada ao DemoStorageService,
   * atualizada dinamicamente a cada compra realizada na loja.
   */
  customers = computed<DemoCustomer[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.demoStorage.customers();
    if (!query) return list;

    return list.filter(c =>
      (c.name && c.name.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.cpf && c.cpf.includes(query)) ||
      (c.phone && c.phone.includes(query)) ||
      (c.address && c.address.toLowerCase().includes(query))
    );
  });
}
