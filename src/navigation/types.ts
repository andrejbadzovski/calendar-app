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
  EventForm: { eventId?: string; dateISO?: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}