import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemoStorageService } from '../../../../core/services/demo-storage.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private demoStorage = inject(DemoStorageService);

  logoPreview = signal<string>('/images/oliveira-icon.png');
  saveSuccess = signal<boolean>(false);

  settingsForm: FormGroup = this.fb.group({
    storeName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['Av. Paulista, 1000 - Bela Vista, São Paulo - SP', Validators.required]
  });

  ngOnInit(): void {
    const config = this.demoStorage.activeConfig();
    this.logoPreview.set(config.logoUrl);
    this.settingsForm.patchValue({
      storeName: config.name,
      email: config.email || 'contato@loja.com.br',
      phone: config.whatsappFormatted || config.whatsappNumber,
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP'
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
      whatsappNumber: cleanPhone || val.phone,
      whatsappFormatted: val.phone,
      logoUrl: this.logoPreview()
    });

    this.saveSuccess.set(true);
    setTimeout(() => {
      this.saveSuccess.set(false);
    }, 3000);
  }
}
