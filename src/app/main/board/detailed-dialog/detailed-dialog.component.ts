import { Component, Input } from '@angular/core';
import { ITask } from '../../../interfaces/itask';
import { IContact } from '../../../interfaces/icontact';
import { TaskDataService } from '../../../services/task-data.service';
import { ContactService } from '../../../services/contact-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detailed-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detailed-dialog.component.html',
  styleUrl: './detailed-dialog.component.scss'
})
export class DetailedDialogComponent {
  @Input() currentTaskId = "";
  @Input() close!: () => void;

  task: ITask = {
      title: "Unknown",
      description: "No task found",
      contacts: ["Andi","Hendrik"],
      date: 0,
      priority: "mid",
      category: "Userstory",
      subtasks: ["Do Nothing", "turn around"],
      status: "todo",
      id: ""
    };
    contacts!: IContact[];

    isUserStory = false;
    prioImagePath = "";
  
    constructor(private taskDataService: TaskDataService, private contactService: ContactService) {
  
    }
  
    ngOnInit() {
      this.contactService.getContacts().subscribe((contactList) => {
        this.contacts = contactList;
      });
      this.taskDataService.getTasks().subscribe((taskList) => {
        taskList.forEach(element => {
          if (this.currentTaskId == element.id) {
            this.task = element;
          }
        });
      });
      this.initTask();
    }

    initTask() {
      if (this.task.category == "User Story") {
        this.isUserStory = true;
      }
      this.prioImagePath = this.getPrioImagePath();
    }

    getPrioImagePath():string {
      switch (this.task.priority) {
        case "low": return "./assets/img/icons/TaskLowIcon.png";
        case "mid": return "./assets/img/icons/TaskMediumIcon.png";
        case "high": return "./assets/img/icons/TaskHighIcon.png";
      }
      return "";
    }

    editTask() {

    }

    deleteTask() {
      
    }

}
