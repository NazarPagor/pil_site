export interface ScheduleActivity {
  time: string;
  title: string;
  description: string;
}

export interface ScheduleDay {
  day: string;
  title: string;
  activities: ScheduleActivity[];
} 