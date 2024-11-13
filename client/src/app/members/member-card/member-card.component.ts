import { Component, input, ViewEncapsulation } from '@angular/core';
import { Member } from '../../_ㅡmodles/member';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MemberCardComponent {
  member = input.required<Member>();
}
