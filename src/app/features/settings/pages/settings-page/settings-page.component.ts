import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DemoStorageService } from '../../../../core/services/demo-storage.service';
import { EmailPreviewComponent } from '../../../../shared/components/email-preview/email-preview.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmailPreviewComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private demoStorage = inject(DemoStorageService);

  logoPreview = signal<string>('/images/logo.png');
  saveSuccess = signal<boolean>(false);
  showEmailPreview = signal<boolean>(false);

  settingsForm: FormGroup = this.fb.group({
    storeName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    // Endereço de origem — inicia vazio até o lojista configurar
    postalCode: [''],
    street: [''],
    number: [''],
    neighborhood: [''],
    city: [''],
    state: [''],
    // Taxas de frete
    pacBaseRate: [19.90, [Validators.required, Validators.min(0)]],
    sedexBaseRate: [32.90, [Validators.required, Validators.min(0)]],
    freeShippingMin: [299.00, [Validators.required, Validators.min(0)]],
  });

  get storeConfig() {
    return this.demoStorage.activeConfig();
  }

  ngOnInit(): void {
    const config = this.demoStorage.activeConfig();
    const custom = this.demoStorage.customBranding();

    this.logoPreview.set(config.logoUrl);
    this.settingsForm.patchValue({
      storeName: config.name,
      email: config.email || 'contato@loja.com.br',
      phone: config.whatsappFormatted || config.whatsappNumber,
      // Endereço inicia vazio se não tiver sido configurado
      postalCode: custom.postalCode || '',
      street: custom.street || '',
      number: custom.number || '',
      neighborhood: custom.neighborhood || '',
      city: custom.city || '',
      state: custom.state || '',
      pacBaseRate: custom.pacBaseRate !== undefined ? custom.pacBaseRate : 19.90,
      sedexBaseRate: custom.sedexBaseRate !== undefined ? custom.sedexBaseRate : 32.90,
      freeShippingMin: custom.freeShippingMin !== undefined ? custom.freeShippingMin : 299.00,
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview.set(e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    const val = this.settingsForm.value;
    const cleanPhone = val.phone.replace(/[^0-9]/g, '');

    this.demoStorage.updateCustomBranding({
      name: val.storeName,
      email: val.email,
      whatsappNumber: cleanPhone || val.phone,
      whatsappFormatted: val.phone,
      logoUrl: this.logoPreview(),
      postalCode: val.postalCode,
      street: val.street,
      number: val.number,
      neighborhood: val.neighborhood,
      city: val.city,
      state: val.state ? val.state.toUpperCase() : '',
      pacBaseRate: Number(val.pacBaseRate),
      sedexBaseRate: Number(val.sedexBaseRate),
      freeShippingMin: Number(val.freeShippingMin),
    });

    this.saveSuccess.set(true);
    setTimeout(() => {
      this.saveSuccess.set(false);
    }, 3000);
  }
}
