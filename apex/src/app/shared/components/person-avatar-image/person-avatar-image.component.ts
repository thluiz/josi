import { ModalType } from './../../../services/modal-service';
import { ModalService } from 'app/services/modal-service';
import { PersonService, PersonActions } from 'app/services/person-service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'person-avatar-image',
  templateUrl: './person-avatar-image.component.html'
})
export class PersonAvatarImageComponent implements OnInit, OnDestroy {  

  @Input() person: { id: number, avatar_img: string, name: string };
  @Input() editAvatarOnClick = false;
  
  private person_changes_subscriber: Subscription;
  
  constructor(private personService: PersonService, private modalService: ModalService) {
            
  }

  ngOnInit() {
    this.person_changes_subscriber = this.personService.personActions$
    .filter((event) => 
        event.type == PersonActions.CHANGE_AVATAR        
        && event.result
        && event.result.success
        && event.result.data.id == this.person.id)
    .subscribe((event) => {      
      console.log(event);                  
      this.person = event.result.data
    });  
  }

  edit_avatar() {
    if(!this.editAvatarOnClick) {
      return;
    }
    
    this.open_send_avatar_image();
  }

  open_send_avatar_image() {
    this.modalService.open(ModalType.FileUpload, {
      title: "Enviar Imagem para Avatar",
      validation: (file) => {
        return new Promise((resolve, reject) => {
          var img = new Image();
          img.src = window.URL.createObjectURL( file );
          console.log(file);
          img.onload = function() {
              var width = img.naturalWidth,
                  height = img.naturalHeight;
  
              window.URL.revokeObjectURL( img.src );
  
              if( width != height || width < 80) {
                  resolve({
                    result: false,
                    message: "A imagem precisa ser quadrada e ter pelo menos 80px de largura"
                  })
              }

              resolve({ result: true });
          }
        });                    
      },
      upload_action: (x: File) => {          
        return this.personService.save_avatar_img(this.person.id, x);
      }
    })
  }

  ngOnDestroy() {
    this.person_changes_subscriber.unsubscribe();
  }
}