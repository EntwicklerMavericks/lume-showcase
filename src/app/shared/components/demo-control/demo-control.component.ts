import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DemoStorageService } from '../../../core/services/demo-storage.service';
import { DEMO_THEMES } from '../../../core/config/demo-themes';

@Component({
  selector: 'app-demo-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demo-control.component.html',
  styleUrl: './demo-control.component.scss'
})
export class DemoControlComponent {
  private demoStorage = inject(DemoStorageService);
  private router = inject(Router);

  isOpen = signal<boolean>(false);
  isMinimized = signal<boolean>(false);
  replaceCatalogOnSwitch = signal<boolean>(true);
  copiedNotification = signal<string | null>(null);

  themesList = Object.values(DEMO_THEMES);
  currentThemeId = this.demoStorage.currentThemeId;
  activeConfig = this.demoStorage.activeConfig;

  // Form model for live client customization
  brandName = signal<string>('');
  primaryColor = signal<string>('#CCA45E');
  whatsappNumber = signal<string>('');
  tagline = signal<string>('');

  constructor() {
    // Sincroniza campos locais quando a configuração ativa mudar
    const config = this.activeConfig();
    this.brandName.set(config.name);
    this.primaryColor.set(config.primaryColor);
    this.whatsappNumber.set(config.whatsappNumber);
    this.tagline.set(config.tagline);
  }

  toggleOpen(): void {
    if (this.isMinimized()) {
      this.isMinimized.set(false);
      this.isOpen.set(true);
      return;
    }
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  minimize(): void {
    this.isOpen.set(false);
    this.isMinimized.set(true);
  }

  restoreMinimized(): void {
    this.isMinimized.set(false);
    this.isOpen.set(true);
  }

  selectTheme(themeId: string): void {
    this.demoStorage.switchTheme(themeId, this.replaceCatalogOnSwitch());
    const config = this.demoStorage.activeConfig();
    this.brandName.set(config.name);
    this.primaryColor.set(config.primaryColor);
    this.whatsappNumber.set(config.whatsappNumber);
    this.tagline.set(config.tagline);
    this.notify(`Tema ${config.name} aplicado com sucesso!`);
  }

  applyCustomization(): void {
    this.demoStorage.updateCustomBranding({
      name: this.brandName().trim() || undefined,
      primaryColor: this.primaryColor().trim() || undefined,
      whatsappNumber: this.whatsappNumber().trim() || undefined,
      tagline: this.tagline().trim() || undefined
    });
    this.notify('Personalização aplicada em tempo real!');
  }

  resetDefaults(): void {
    if (confirm('Deseja realmente restaurar todos os dados e o catálogo para o padrão original da demonstração?')) {
      this.demoStorage.resetToDefaults();
      const config = this.demoStorage.activeConfig();
      this.brandName.set(config.name);
      this.primaryColor.set(config.primaryColor);
      this.whatsappNumber.set(config.whatsappNumber);
      this.tagline.set(config.tagline);
      this.notify('Demonstração restaurada com sucesso!');
    }
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
    this.isOpen.set(false);
  }

  private notify(msg: string): void {
    this.copiedNotification.set(msg);
    setTimeout(() => {
      this.copiedNotification.set(null);
    }, 2800);
  }
}
