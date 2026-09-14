export type CalendarEvent = {
  id: string;
  userId: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CalendarEventDraft = {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
};