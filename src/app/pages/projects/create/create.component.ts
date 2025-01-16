import { Component, OnInit, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/core/services/category.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

/**
 * Projects-create component
 */
export class CreateComponent implements OnInit {
  categoryForm: FormGroup;
  breadCrumbItems: Array<{}>;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Categories' }, { label: 'Create Category', active: true }];
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe(() => {
        this.router.navigate(['./list']);
      });
    }
  }

}
