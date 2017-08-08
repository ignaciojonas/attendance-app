import { AttendanceAppPage } from './app.po';

describe('attendance-app App', () => {
  let page: AttendanceAppPage;

  beforeEach(() => {
    page = new AttendanceAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
