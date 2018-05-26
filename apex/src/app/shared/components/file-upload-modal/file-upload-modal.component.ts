import { CardService } from 'app/services/card-service';
import { IncidentService } from 'app/services/incident-service';
import { Observable } from 'rxjs/Observable';
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { PersonService } from 'app/services/person-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],  
})
export class FileUploadModalComponent implements OnInit {  
  person;   
  title = "Enviar arquivo";
  saving = false;
  selected_file : File;
  validated = false;
  validation_message = "";
  upload_action: (data: File) => Observable<any>;
  validation: (file: File) => Promise<{ result: boolean, message: string }>;

  @ViewChild('file_upload_modal') file_upload_modal: ElementRef;

  onFileChanged(event) {
    this.selected_file = event.target.files[0];

    if(!this.validation) {
      this.validated = true;
      this.validation_message = "";
      return;
    }
    this.validated = false;
    this.validation_message = "";
    this.validation(this.selected_file).then(validation => {
      this.validated = validation.result;      
      this.validation_message = validation.message;      
    });
  }

  constructor(private ngbModalService: NgbModal) {

  }

  ngOnInit() {    

  }  

  ngOnDestroy () {
    
  }

  open(parameters : { title : string, 
    validation : (data: File) => Promise<{ result: boolean, message: string}>,
    upload_action: (data: File) => Observable<any>}) {

    if(parameters.title) {
      this.title = parameters.title;
    }

    if(!parameters.upload_action) {
      console.log("no upload action!");
      return;
    }
    this.selected_file = null;
    this.validation_message = "";
    this.upload_action = parameters.upload_action; 
    this.validation = parameters.validation;   

    this.open_modal(this.file_upload_modal, true);        
  }

  send_file(close_action) {    
    this.upload_action(this.selected_file).subscribe((result) => {
      close_action(`file sended: ${this.title} `);
    });    
  }

  private open_modal(content, on_close_action = false) {
    this.saving = false;
    this.ngbModalService.open(content).result.then((result) => {                                  
      
    }, (reason) => {        
        console.log(reason);
    });
  }   

  
}