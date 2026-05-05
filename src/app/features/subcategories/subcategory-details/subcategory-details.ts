// Owner: Noura — feature: subcategories/details
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subcategory-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './subcategory-details.html',
  styleUrl: './subcategory-details.css',
})
export class SubcategoryDetails {
  // TODO: Noura — fetch + display single subcategory by route param :id
}
