import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase-service.service';
import { TaskDataService } from '../../services/task-data.service';
import { ITask } from '../../interfaces/itask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  isGuest = false;
  currentUser = "Gott Devil";
  tasks: ITask[] = [];
  upcomingTask!: ITask;

  constructor(public firebaseService: FirebaseService, private taskDataService: TaskDataService) {}

  ngOnInit() {
    this.taskDataService.getTasks().subscribe((taskList) => {
      this.tasks = taskList.map(task => ({
        ...task, // Spread operator
        parsedDate: this.parseDate(task.date) ?? null,
      }));
  
      this.findUpcomingTask();
    });
  }

  parseDate(dateString: string): Date | null {
    if (!dateString) return null;
  
    if (dateString.includes("-")) {
      return new Date(dateString);
    } else if (dateString.includes(".")) {
      const parts = dateString.split(".").map(Number);
      return new Date(parts[2], parts[1] - 1, parts[0]); 
    }
  
    return null;
  }
  
  findUpcomingTask() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    this.upcomingTask = (this.tasks as (ITask & { parsedDate: Date | null })[])
    .filter(task => task.parsedDate && task.parsedDate >= today && task.status != "done")
    .sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime())[0];
  
    console.log("Nächster Task:", this.upcomingTask);
  }

  getWelcomeMessage():string {
    const currentDate = new Date().getHours();
    if (currentDate < 12) {
      return "Good morning";
    } else if (currentDate < 18) {
      return "Good afternoon"
    } else {
      return "Good evening"
    }
  }

  getDateOfUpcomingTask(): string {
    if (!this.upcomingTask || !this.upcomingTask.parsedDate) {
      return "No upcoming tasks";
    }
  
    return this.upcomingTask.parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  getUpcomingTaskPrio(): string {
    if (!this.upcomingTask) {
      return "No upcoming tasks";
    }
    return this.upcomingTask.priority;
  }
  getUpcomingTaskPrioClass(): string {
    switch (this.getUpcomingTaskPrio()) {
      case "Low":
        return "bg-low";
      case "Medium":
        return "bg-medium";
      case "Urgent":
        return "bg-urgent";
      default:
        return "";
    }
  }
  
}
