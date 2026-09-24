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

  // Form model for live client customization (Nome + 4 Cores + WhatsApp + Slogan)
  brandName = signal<string>('');
  primaryColor = signal<string>('#0DF5A4');
  secondaryColor = signal<string>('#FFFFFF');
  backgroundColor = signal<string>('#080809');
  sectionBg = signal<string>('#080809');
  whatsappNumber = signal<string>('');
  tagline = signal<string>('');

  constructor() {
    this.syncFormWithConfig();
  }

  private syncFormWithConfig(): void {
    const config = this.activeConfig();
    this.brandName.set(config.name);
    this.primaryColor.set(config.primaryColor);
    this.secondaryColor.set(config.secondaryColor);
    this.backgroundColor.set(config.backgroundColor);
    this.sectionBg.set(config.sectionBg || config.backgroundColor);
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
    this.demoStorage.switchTheme(themeId, true);
    this.syncFormWithConfig();
    const config = this.demoStorage.activeConfig();
    this.notify(`Tema ${config.name} e catálogo de fotos exclusivos aplicados!`);
  }

  /**
   * Aplica personalização completa com 4 cores: Primária, Secundária, Fundo Geral e Fundo das Seções
   */
  applyCustomization(): void {
    this.demoStorage.updateCustomBranding({
      name: this.brandName().trim() || undefined,
      primaryColor: this.primaryColor().trim() || undefined,
      secondaryColor: this.secondaryColor().trim() || undefined,
      backgroundColor: this.backgroundColor().trim() || undefined,
      sectionBg: this.sectionBg().trim() || undefined,
      whatsappNumber: this.whatsappNumber().trim() || undefined,
      tagline: this.tagline().trim() || undefined
    });
    this.notify('Personalização de cores e marca aplicada em tempo real!');
  }

  /**
   * Atalhos de paletas prontas para demonstração rápida
   */
  applyColorPreset(primary: string, secondary: string, background: string, sectionBg?: string): void {
    this.primaryColor.set(primary);
    this.secondaryColor.set(secondary);
    this.backgroundColor.set(background);
    this.sectionBg.set(sectionBg || background);
    this.applyCustomization();
  }

  resetDefaults(): void {
    if (confirm('Deseja realmente restaurar todos os dados e o catálogo para o padrão original da demonstração?')) {
      this.demoStorage.resetToDefaults();
      this.syncFormWithConfig();
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
