import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { map, share, take, filter, switchMapTo } from 'rxjs/operators';
import { interval } from 'rxjs';
import { EpisodeService } from '../service/episode.service';
import { Episode } from '../model/episode';
import { Theme } from '../model/theme';
import { environment } from '../../environments/environment';
import { User } from '../model/user';
import { LoggedUserService } from '../service/logged-user.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-episode-details',
  templateUrl: './episode-details.component.html',
  styleUrls: ['./episode-details.component.css']
})
export class EpisodeDetailsComponent implements OnInit {

  episode: Episode;
  addForm: FormGroup;
  currentUser: User;
  editableTheme: Theme;
  updateForm: FormGroup;

  now$ = interval(1000).pipe(map(x => new Date()), share());

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private episodeService: EpisodeService,
              private sessionUserService: LoggedUserService,
              private location: Location,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      title: ['', Validators.required]
    });

    this.updateForm = this.formBuilder.group({
      title: ['', Validators.required],
      timecode: ['', Validators.required]
    });

    this.currentUser = this.sessionUserService.getSessionUser();
    this.getEpisodeDetails();
    this.connect();
  }

  getEpisodeDetails(){
    const id = +this.route.snapshot.paramMap.get('id');
    this.episodeService.getEpisodeById(id)
      .subscribe(data => this.episode = data);
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.episodeService.addTheme(this.episode.id, this.addForm.value)
      .subscribe(data => { this.getEpisodeDetails() });
    this.addForm.reset();
  }

  updateTheme() {
    this.episodeService.updateTheme(this.editableTheme.id, this.updateForm.value)
      .subscribe(data => { this.getEpisodeDetails()});
    this.editableTheme = null;
  }

  track(episode:  Episode, theme: Theme) {
     this.episodeService.updateTimestamp(episode.id, theme).subscribe(data => { this.getEpisodeDetails()});
  }

  startEpisode(episode: Episode) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: `
      <h5>Before episode start please do the following:</h5>
      
      <ul>
        <li>check memory space on recorder</li>
        <li>start recording</li>
        <li>start stream</li>
      </ul>
      
      <h5 class="text-center">Are you ready to start episode ${episode.name}?</h5>
      `
    });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(Boolean),
      switchMapTo(this.episodeService.startEpisode(episode))
    )
     .subscribe(data => {
      this.getEpisodeDetails();
     });




    //this.episodeService.startEpisode(episode).subscribe(data => { this.getEpisodeDetails() });
  }

  stopEpisode(episode: Episode) {
    this.episodeService.stopEpisode(episode).subscribe(data => { this.getEpisodeDetails() });
  }

  isFinished(episode: Episode): boolean {
    if(!episode){
      return false;
    }
    return !episode.started && episode.themeList.filter(val => val.passed === true).length > 0;
  }

  export(episode: Episode){
    this.router.navigate([`export/${episode.id}`])
  }

  linkThemes(episode: Episode){
    this.router.navigate([`link-themes/${episode.id}`], { queryParams: { returnUrl: this.router.url }})
  }

  connect(): void {
    let source = new EventSource(`${ environment.apiUrl }/stream`);
    source.addEventListener('message', message => {
      this.getEpisodeDetails();
    });
 }

  unlinkThemes(id: number, themeId: number) {
    this.episodeService.unlinkThemesToEpisode(id, themeId).subscribe(data => { this.getEpisodeDetails()});
  }

  editTheme(theme: Theme){
    this.editableTheme =  theme;

    this.updateForm.controls['timecode'].setValue(this.editableTheme.timecode);
    this.updateForm.controls['title'].setValue(this.editableTheme.title);
  }

  cancelEdit(){
    this.editableTheme = null;
  }
}
