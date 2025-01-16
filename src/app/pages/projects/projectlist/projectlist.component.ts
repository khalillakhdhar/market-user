import { Component, OnInit } from '@angular/core';

import { Project } from '../project.model';

import { projectData } from '../projectdata';
import { Category } from 'src/app/core/models/category.interface';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})

/**
 * Projects-list component
 */
export class ProjectlistComponent implements OnInit {
  categories: Category[] = [];
  breadCrumbItems: Array<{}>;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Categories' }, { label: 'Category List', active: true }];
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
