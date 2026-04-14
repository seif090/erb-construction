import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, ArrowRight, CheckCircle2, ListTodo, Plus } from 'lucide-angular';
import { CreateProjectStageDto, Project, ProjectService, ProjectStage } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-stages-board',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './project-stages-board.component.html',
  styleUrl: './project-stages-board.component.scss'
})
export class ProjectStagesBoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  readonly ArrowRight = ArrowRight;
  readonly CheckCircle2 = CheckCircle2;
  readonly ListTodo = ListTodo;
  readonly Plus = Plus;

  project = signal<Project | null>(null);
  stages = signal<ProjectStage[]>([]);
  viewMode = signal<'LIST' | 'KANBAN'>('LIST');
  statusFilter = signal<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  isLoading = signal(true);
  isSubmittingStage = signal(false);

  stageForm = this.fb.group({
    name: ['', [Validators.required]],
    order: [1, [Validators.required, Validators.min(1)]],
    description: [''],
    budget: [null as number | null],
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const projectId = params.get('id');
      if (!projectId) {
        return;
      }
      this.loadProject(projectId);
    });
  }

  loadProject(projectId: string) {
    this.isLoading.set(true);
    this.projectService.getProjectById(projectId).subscribe({
      next: (res) => {
        if (res.success) {
          this.project.set(res.data);
          const orderedStages = [...(res.data.stages || [])].sort((a, b) => a.order - b.order);
          this.stages.set(orderedStages);
          this.stageForm.patchValue({ order: orderedStages.length + 1 });
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading project stages board:', err);
        this.isLoading.set(false);
      },
    });
  }

  addStage() {
    const currentProject = this.project();
    if (!currentProject?.id || this.stageForm.invalid) {
      this.stageForm.markAllAsTouched();
      return;
    }

    this.isSubmittingStage.set(true);
    const payload = this.stageForm.value as CreateProjectStageDto;

    this.projectService.addProjectStage(currentProject.id, payload).subscribe({
      next: (res) => {
        if (res.success) {
          const nextStages = [...this.stages(), res.data].sort((a, b) => a.order - b.order);
          this.stages.set(nextStages);
          this.stageForm.reset({ name: '', order: nextStages.length + 1, description: '', budget: null });
        }
        this.isSubmittingStage.set(false);
      },
      error: (err) => {
        console.error('Error adding stage:', err);
        this.isSubmittingStage.set(false);
      }
    });
  }

  updateProgress(stage: ProjectStage, progressValue: number) {
    const currentProject = this.project();
    if (!currentProject?.id) {
      return;
    }

    const safeProgress = Math.max(0, Math.min(100, Number(progressValue) || 0));
    this.projectService.updateProjectStage(currentProject.id, stage.id, {
      progress: safeProgress,
      isCompleted: safeProgress === 100,
    }).subscribe({
      next: () => {
        this.stages.set(this.stages().map((item) =>
          item.id === stage.id
            ? { ...item, progress: safeProgress, isCompleted: safeProgress === 100 }
            : item
        ));
      },
      error: (err) => {
        console.error('Error updating stage progress:', err);
      }
    });
  }

  toggleCompletion(stage: ProjectStage) {
    this.updateProgress(stage, stage.isCompleted ? 0 : 100);
  }

  getStageStatus(stage: ProjectStage): 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' {
    if (stage.isCompleted || stage.progress >= 100) {
      return 'COMPLETED';
    }
    if (stage.progress > 0) {
      return 'IN_PROGRESS';
    }
    return 'PENDING';
  }

  get filteredStages(): ProjectStage[] {
    const filter = this.statusFilter();
    if (filter === 'ALL') {
      return this.stages();
    }
    return this.stages().filter((stage) => this.getStageStatus(stage) === filter);
  }

  get pendingStages(): ProjectStage[] {
    return this.filteredStages.filter((stage) => this.getStageStatus(stage) === 'PENDING');
  }

  get inProgressStages(): ProjectStage[] {
    return this.filteredStages.filter((stage) => this.getStageStatus(stage) === 'IN_PROGRESS');
  }

  get completedStages(): ProjectStage[] {
    return this.filteredStages.filter((stage) => this.getStageStatus(stage) === 'COMPLETED');
  }
}
