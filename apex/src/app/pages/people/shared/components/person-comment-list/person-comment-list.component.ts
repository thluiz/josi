
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ParameterService } from 'app/services/parameter-service';
import { PersonService } from 'app/services/person-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription, Observable } from 'rxjs';
import { ModalService, ModalType } from 'app/services/modal-service';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'person-comment-list',
  templateUrl: './person-comment-list.component.html',  
  styleUrls: ['./person-comment-list.scss']
})
export class PersonCommentListComponent implements OnInit, OnDestroy { 

  comments: any;     
  @Input() person:any;  

  private comment_changes_subscriber: Subscription;

  constructor(private modalService: ModalService, 
    private parameterService: ParameterService,
    private personService: PersonService,
    private markdownService: MarkdownService) {   

  }

  ngOnInit() {
    this.comment_changes_subscriber = this.personService.commentChanges$
      .filter((data) => { 
        console.log(data); 
        return data != null && data.person.id == this.person.id
      })
      .subscribe((data) => {            
        this.load_comments();      
      });

    this.markdownService.renderer.paragraph = (text: string) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `<p style="margin-bottom:0">${text}</p>`;
    };      
    
    this.load_comments();
  }

  ngOnDestroy() {
    this.comment_changes_subscriber.unsubscribe();
  }

  load_comments() {
    this.personService.getCommentsAboutPerson(this.person.id)
    .subscribe((data) => this.comments = data);
  }
       
  add_comment(){             
      this.modalService.open(ModalType.AddPersonComment, this.person);    
  } 

  archive_comment(comment) {    
    this.personService.archiveComment(comment, this.person).subscribe();
  }
}