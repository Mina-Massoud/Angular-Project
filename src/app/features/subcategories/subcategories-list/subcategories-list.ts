// Owner: Noura — feature: subcategories/list
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subcategories-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './subcategories-list.html',
  styleUrl: './subcategories-list.css',
})
export class SubcategoriesList {
  // TODO: Noura — list all subcategories; support ?category= filter
}
