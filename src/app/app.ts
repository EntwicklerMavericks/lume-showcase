import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/services/theme.service';
import { DemoStorageService } from './core/services/demo-storage.service';
import { DemoControlComponent } from './shared/components/demo-control/demo-control.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DemoControlComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private seoService = inject(SeoService);
  private themeService = inject(ThemeService);
  private demoStorage = inject(DemoStorageService);

  ngOnInit(): void {
    this.demoStorage.applyActiveThemeStyles();
    this.seoService.setPageMeta();
  }
}

