import { ModalService, ModalType } from 'app/services/modal-service';
import { PersonService } from 'app/services/person-service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from 'app/services/security-service';

import { zip as observableZip, Observable, of } from 'rxjs';
import { debounceTime, delay, map, distinctUntilChanged, catchError, tap, switchMap } from 'rxjs/operators';
import { Result } from 'app/shared/models/result';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    toggleClass = 'ft-maximize';
    user_name;
    logout_url = environment.logout_url;
    current_user: any;
    current_person: any;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private securityService: SecurityService,
        private personService: PersonService,
        private modalService: ModalService) {
    }

    searching_people;
    search_failed;

    people_typeahead_formatter = (x) => x.name;

    search_people = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching_people = true),
            switchMap(term =>
                this.personService.search(term).pipe(
                    map(response => {
                        return <string[]>response;
                    }),
                    tap(() => this.search_failed = false),
                    catchError(() => {
                        this.search_failed = true;
                        return of([]);
                    }), )),
            tap(() => this.searching_people = false), )

    navegate_to(event) {
        if (event.person_id && event.person_id > 0) {
            this.router.navigateByUrl("/people/person/" + event.person_id);
            this.current_person = null;
        }
    }

    ngOnInit() {
        this.securityService.getCurrentUserData()
        .subscribe((result_user : Result<any>) => {
            this.current_user = result_user.data;
        });
    }

    ChangeLanguage(language: string) {

    }

    ToggleClass() {
        if (this.toggleClass === 'ft-maximize') {
            this.toggleClass = 'ft-minimize';
        }
        else
            this.toggleClass = 'ft-maximize'
    }

    open_new_person_modal() {
        this.modalService.open(ModalType.AddPerson,
            {
                branch_id: this.current_user.default_branch_id
            });
    }

    open_new_activity_modal() {
        this.modalService.open(ModalType.AddIncident, {
            branch_id: this.current_user.default_branch_id
        });
    }
}
