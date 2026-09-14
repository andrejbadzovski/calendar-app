import type { CalendarEvent } from '@/types/event';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type TabParamList = {
  Calendar: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  EventForm: { event?: CalendarEvent; dateISO?: string } | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}