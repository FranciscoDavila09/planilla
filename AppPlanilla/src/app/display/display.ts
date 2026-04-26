import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KeyValuePipe } from '@angular/common';

interface DisplayData {
  titulo: string;
  volver: string;
  datos: Record<string, string | number | null>;
}

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [RouterLink, KeyValuePipe],
  templateUrl: './display.html',
  styleUrl: './display.css',
})
export class DisplayComponent implements OnInit {
  protected readonly savedData = signal<DisplayData | null>(null);

  ngOnInit(): void {
    this.loadFromLocalStorage();
  }

  protected loadFromLocalStorage(): void {
    const data = localStorage.getItem('displayData');

    if (data) {
      this.savedData.set(JSON.parse(data));
    } else {
      this.savedData.set(null);
    }
  }

  protected clearStorage(): void {
    localStorage.removeItem('displayData');
    this.savedData.set(null);
  }
}